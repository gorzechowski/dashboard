import {
    BrowserWindow,
    BrowserView,
    MenuItemConstructorOptions,
    Menu,
    globalShortcut,
} from 'electron';
import openAboutWindow from 'about-window';
import Logger from './Logger';
import { CommandSubscriber } from '../ipc/App';
import { isDev } from './Env';
import { appName } from './AppName';
import { RegisterTab, CloseSettings } from '../ipc/command';

interface TabConfig {
    switchAfter: number;
}

export default class MainWindow extends BrowserWindow {
    protected static INITIAL_TAB = -1;
    protected static SETTINGS_TAB = -2;
    protected static AUTH_TAB = -3;

    protected static BUILT_IN_TABS = [ MainWindow.INITIAL_TAB, MainWindow.SETTINGS_TAB, MainWindow.AUTH_TAB ];

    public switchTimerId: any;
    public tabsConfig: { [K: string]: TabConfig } = {};

    protected currentTabIndex: number = 0;
    protected tabs: BrowserView[] = [];
    protected onCommand: CommandSubscriber;

    public constructor(onCommand: CommandSubscriber) {
        super({
            width: 1000,
            height: 750,
            title: appName(),
            fullscreen: true,
            icon: `${__dirname}/../../assets/icon128x128.png`,
        });

        this.onCommand = onCommand;

        this.onCommand(CloseSettings, async () => {
            Logger.debug('Closing settings tab');

            this.setCurrentTabByIndex(0);
            this.startSwitchTimer();
        });

        this.onCommand(RegisterTab, async (payload: RegisterTab) => {
            Logger.debug('RegisterTab: %o', payload);

            const { index, switchAfter } = payload;

            if (this.tabsConfig[index]) {
                Logger.debug('RegisterTab: tab already registered %o', payload);
                return;
            }

            this.tabsConfig[index] = { switchAfter };

            if (this.tabs.length === Object.keys(this.tabsConfig).length) {
                this.stopSwitchTimer();

                this.setCurrentTabByIndex(0);
                this.startSwitchTimer();
            }
        });

        globalShortcut.register('CmdOrCtrl+Right', this.nextTab);
    }

    public startSwitchTimer = (restart?: boolean) => {
        if (restart && this.switchTimerId) {
            this.stopSwitchTimer();
        }

        const timeout = this.tabsConfig[this.currentTabIndex].switchAfter;

        Logger.debug('Start switch timer with timeout %ds', timeout / 1000);

        this.switchTimerId = setTimeout(this.nextTab, timeout);
    }

    public stopSwitchTimer = () => {
        if (this.switchTimerId) {
            Logger.debug('Stop switch timer');

            clearTimeout(this.switchTimerId);
            this.switchTimerId = null;
        }
    }

    public setCurrentTabByIndex = (index: number) => {
        Logger.debug('Setting current tab to %d', index);

        this.currentTabIndex = index;

        const tab: BrowserView = this.tabs[index];

        this.setCurrentTab(tab);
    }

    public setCurrentTab = (tab: BrowserView) => {
        const [ width, height ] = this.getSize();

        this.setBrowserView(tab);

        tab.setBounds({
            x: 0,
            y: 0,
            width,
            height,
        });

        this.setMenu(this.buildMenu());
    }

    public addTab = (tab: BrowserView) => {
        this.tabs.push(tab);
    }

    public reloadCurrentTab = () => {
        Logger.debug('Reloading current tab');

        this.getBrowserView().webContents.reload();
    }

    public nextTab = () => {
        if (this.currentTabIndex === MainWindow.INITIAL_TAB) {
            return;
        }

        Logger.debug('Switching to next tab');

        this.stopSwitchTimer();

        if (this.currentTabIndex === this.tabs.length - 1) {
            this.currentTabIndex = 0;
        } else {
            this.currentTabIndex++;
        }

        Logger.debug('Next tab calculated to %d', this.currentTabIndex);

        this.setCurrentTabByIndex(this.currentTabIndex);

        this.startSwitchTimer();
    }

    public showInitialTab = () => {
        return new Promise(resolve => {
            this.setInitialTab();

            setTimeout(resolve, 2000);
        })
            .then(() => (this.currentTabIndex = 0));
    }

    public setAuthTab = info => {
        Logger.debug('Setting current tab to auth');

        const tab: BrowserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
            },
        });

        this.stopSwitchTimer();

        this.currentTabIndex = MainWindow.AUTH_TAB;

        tab.setAutoResize({
            width: true,
            height: true,
        });

        tab.webContents.loadURL(`file://${__dirname}/../renderer/auth.html#${info.host}`);

        if (isDev()) {
            tab.webContents.openDevTools();
        }

        this.setCurrentTab(tab);
    }

    public setSettingsTab = () => {
        Logger.debug('Setting current tab to settings');

        this.stopSwitchTimer();

        this.currentTabIndex = MainWindow.SETTINGS_TAB;

        const tab: BrowserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
            },
        });

        tab.setAutoResize({
            width: true,
            height: true,
        });

        tab.webContents.loadURL(`file://${__dirname}/../renderer/settings.html`);

        if (isDev()) {
            tab.webContents.openDevTools();
        }

        this.setCurrentTab(tab);
    }

    protected setInitialTab = () => {
        Logger.debug('Setting current tab to initial');

        const tab: BrowserView = new BrowserView();
        this.currentTabIndex = MainWindow.INITIAL_TAB;

        tab.setAutoResize({
            width: true,
            height: true,
        });

        tab.webContents.loadURL(`file://${__dirname}/../renderer/initial.html`);

        this.setCurrentTab(tab);
    }

    protected buildMenu = () => {
        const template: Array<(MenuItemConstructorOptions)> = [
            {
                label: 'File',
                submenu: [
                    { role: 'quit' },
                ],
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Settings',
                        accelerator: 'F1',
                        click: this.setSettingsTab,
                        enabled: this.currentTabIndex !== MainWindow.INITIAL_TAB,
                    },
                ],
            },
            {
                label: 'View',
                submenu: [
                    { role: 'togglefullscreen' },
                    {
                        label: 'Reload current tab',
                        accelerator: 'F5',
                        click: this.reloadCurrentTab,
                        enabled: this.currentTabIndex !== MainWindow.INITIAL_TAB,
                    },
                    {
                        label: 'Next tab',
                        accelerator: 'CmdOrCtrl+Right',
                        click: () => this.nextTab,
                        enabled: !this.isBuiltInTab(this.currentTabIndex),
                    },
                ],
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About',
                        click: () => {
                            const aboutWindow = openAboutWindow({
                                icon_path: `${__dirname}/../../assets/icon256x256.png`,
                                package_json_dir: `${__dirname}/../../`,
                                product_name: appName(),
                            });

                            aboutWindow.setMenuBarVisibility(false);
                        },
                    },
                ],
            },
        ];

        return Menu.buildFromTemplate(template);
    }

    protected isBuiltInTab = (index: number) =>
        MainWindow.BUILT_IN_TABS.indexOf(index) >= 0
}
