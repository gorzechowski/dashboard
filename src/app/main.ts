import { join } from 'path';
import {
    app,
    ipcMain,
    BrowserView,
    dialog,
} from 'electron';
import * as Queue from 'better-queue';
import { omit } from 'lodash';
import Logger from './Logger';
import { isDev } from './Env';
import { getDataDir } from './DataDir';
import { Tab, Setting } from './entities';
import { Authenticate, SaveTabs, SaveSettings, RestartApp, Log } from '../ipc/command';
import { GetTabs, GetSettings } from '../ipc/query';
import { commandSubscriberFactory, querySubscriberFactory, CommandSubscriber, QuerySubscriber } from '../ipc/App';
import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import MainWindow from './MainWindow';

class Application {
    protected mainWindow: MainWindow = null;
    protected tabsRepository: Repository<Tab>;
    protected settingRepository: Repository<Setting>;
    protected authQueue: Queue;
    protected authHandlers: { [K: string]: (data: any) => void } = {};
    protected onCommand: CommandSubscriber;
    protected onQuery: QuerySubscriber;

    public constructor(
        onCommand: CommandSubscriber,
        onQuery: QuerySubscriber,
        repository: Repository<Tab>,
        settingRepository: Repository<Setting>,
    ) {
        this.onCommand = onCommand;
        this.onQuery = onQuery;
        this.tabsRepository = repository;
        this.settingRepository = settingRepository;

        this.initIpc();

        this.authQueue = new Queue((info, next) => {
            Logger.debug('New auth queue task, %o', info);

            this.authHandlers[info.host] = next;

            this.mainWindow.setAuthTab(info);
        });

        this.authQueue.on('drain', () => {
            this.mainWindow.setCurrentTabByIndex(0);
        });
    }

    public run = async () => {
        const ignoreSsl = await this.settingRepository.findOne({ name: 'ignore-certificate-errors' });

        if (ignoreSsl.value === '1') {
            Logger.warn('Ignore certificate errors option ENABLED');
            app.commandLine.appendSwitch('ignore-certificate-errors');
        } else {
            Logger.debug('Ignore certificate errors option DISABLED');
        }

        app.on('login', (event, webContents, request, authInfo, callback) => {
            event.preventDefault();

            Logger.debug('Auth required');
            webContents.send('refresh-disable');

            this.authQueue.push({
                host: authInfo.host,
            }, (result: any) => {
                webContents.send('refresh-enable');
                callback(result.username, result.password);
            });
        });

        app.on('window-all-closed', () => {
            app.quit();
        });

        if (app.isReady()) {
            this.show();
        } else {
            app.on('ready', this.show);
        }
    }

    private show = () => {
        this.mainWindow = new MainWindow(this.onCommand);

        this.mainWindow.showInitialTab()
            .then(() => this.tabsRepository.find())
            .then((results: Tab[]) => {
                if (results.length === 0) {
                    return this.mainWindow.setSettingsTab();
                }

                results.forEach((item, index) => {
                    const qml = Buffer.from(item.qml).toString('base64');
                    const tab: BrowserView = new BrowserView({
                        webPreferences: {
                            nodeIntegration: true,
                            webviewTag: true,
                        },
                    });

                    tab.setAutoResize({
                        width: true,
                        height: true,
                    });

                    this.mainWindow.addTab(tab);

                    // TODO passing QML string by IPC
                    tab.webContents.loadURL(`file://${__dirname}/../renderer/qmltab.html#${qml}:${index}`);

                    if (isDev()) {
                        tab.webContents.openDevTools();
                    }
                });
            })
            .catch(Logger.error);
    }

    private initIpc = () => {
        this.onQuery(GetTabs, async () => {
            Logger.debug('GetTabs');

            const tabs = await this.tabsRepository.find({
                order: {
                    index: 'ASC',
                },
            });

            return tabs;
        });

        this.onQuery(GetSettings, async () => {
            Logger.debug('GetSettings');

            const settings = await this.settingRepository.find();

            return settings;
        });

        this.onCommand(Authenticate, async (data: Authenticate) => {
            Logger.debug('Authenticate: %o', omit(data, 'password'));

            this.authHandlers[data.host](data);
            delete this.authHandlers[data.host];
        });

        this.onCommand(SaveTabs, async (payload: SaveTabs) => {
            Logger.debug('SaveTabs: %o', payload);

            await this.tabsRepository.query('DELETE FROM tab');
            await this.tabsRepository.save(payload.tabs.map(tab => this.tabsRepository.create(tab)));
        });

        this.onCommand(SaveSettings, async (payload: SaveSettings) => {
            Logger.debug('SaveSettings: %o', payload);

            await this.settingRepository.query('DELETE FROM setting');
            await this.settingRepository.save(payload.settings.map(setting => this.settingRepository.create(setting)));
        });

        this.onCommand(RestartApp, async () => {
            Logger.debug('RestartApp');

            app.relaunch();
            app.exit();
        });

        this.onCommand(Log, async (payload: Log) => {
            const getMethodByPriority = (priority: string) => {
                if (Logger[priority]) {
                    return Logger[priority];
                }

                Logger.warn(`Log: priority ${priority} not supported`);
            };

            const log = getMethodByPriority(payload.priority);

            if (typeof payload.data === 'string') {
                log('Renderer: %s', payload.data);
            } else {
                log('Renderer: %o', payload.data);
            }
        });
    }
}

Logger.info('Using dataDir: %s', getDataDir());

const options: ConnectionOptions = {
    type: 'sqlite',
    database: `${getDataDir()}/database.sqlite`,
    entities: [ Tab, Setting ],
    logging: isDev(),
    synchronize: false,
    migrations: [ join(__dirname, './../migrations/*.js') ],
    migrationsRun: true,
};

createConnection(options)
    .then(connection => {
        const tabsRepository = connection.manager.getRepository(Tab);
        const settingRepository = connection.manager.getRepository(Setting);

        const application = new Application(
            commandSubscriberFactory(ipcMain),
            querySubscriberFactory(ipcMain),
            tabsRepository,
            settingRepository,
        );

        application.run();
    })
    .catch(error => {
        Logger.error(error);
        dialog.showErrorBox('Error', error.message);
        app.quit();
    });
