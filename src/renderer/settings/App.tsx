import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { SaveTabs, SaveSettings, RestartApp, CloseSettings } from '../../ipc/command';
import { GetTabs, GetSettings } from '../../ipc/query';
import { IpcInterface } from '../../ipc/Renderer';
import { Tab, Setting } from '../../app/entities';
import { max } from 'lodash';
import { AppBar, TabDefinition, SettingSwitch } from './components';
import { Settings, ThemeProvider } from './containers';

interface AppProps {
    ipc: IpcInterface;
}

interface AppState {
    tabs: any[];
    settings: any[];
    savedTabs: number;
}

const GridItem = styled(Grid)`
    && {
        padding: ${({ theme }) => theme.spacing(1)}px;
    }
`;

const SwitchesBar = styled.div`
    && {
        padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(3)}px;
        background-color: ${({ theme }) => theme.palette.primary.dark};
        border-top: 1px solid ${({ theme }) => theme.palette.primary.light};
        color:${({ theme }) => theme.palette.text.primary};
    }
`;

const QML_TEMPLATE = '\
import Dashboard 1.0\n\
\n\
SwitchableTab {\n\
    id: main\n\
    switchAfter: 30\n\
\n\
    WebView {\n\
        id: web\n\
        url: "https://google.pl"\n\
        x: 0\n\
        y: 0\n\
        width: main.width\n\
        height: main.height\n\
    }\n\
}';

const SETTINGS_DISPLAY_NAMES = {
    'ignore-certificate-errors': 'Ignore certificate errors',
};

export default class App extends React.Component<AppProps, AppState> {
    public state = {
        tabs: [],
        settings: [],
        savedTabs: 0,
    };

    public componentWillMount() {
        const { ipc } = this.props;

        ipc.query(GetTabs)
            .then((tabs: Tab[]) => {
                this.setState({
                    tabs,
                    savedTabs: tabs.length,
                });
            });

        ipc.query(GetSettings)
            .then((settings: Setting[]) => {
                this.setState({
                    settings,
                });
            });
    }

    public render() {
        const { tabs, settings, savedTabs } = this.state;

        return (
            <ThemeProvider>
                <AppBar
                    onCloseClicked={this.onCloseClicked}
                    onSaveClicked={this.onSaveClicked}
                    saveEnabled={tabs.length > 0}
                    closeEnabled={savedTabs > 0}
                >
                    <Button
                        variant='contained'
                        onClick={this.onAddClicked}
                    >
                        <AddIcon />
                        Add tab
                    </Button>
                </AppBar>

                <SwitchesBar>
                    {settings.filter(item => item.type === 'switch').map(setting => (
                        <SettingSwitch
                            onChange={this.onSettingChanged}
                            checked={setting && setting.value === '1'}
                            name={setting.name}
                            key={setting.name}
                        >
                            {SETTINGS_DISPLAY_NAMES[setting.name]}
                        </SettingSwitch>
                    ))}
                </SwitchesBar>

                <Settings>
                    <Grid container>
                        {tabs.map((tab, index) => (
                            <GridItem item key={index} lg={4} xs={4} md={4}>
                                <TabDefinition
                                    tab={tab}
                                    onQmlChanged={this.onQmlChanged}
                                    onRemoveClicked={this.onRemoveClicked}
                                />
                            </GridItem>
                        ))}
                    </Grid>
                </Settings>
            </ThemeProvider>
        );
    }

    private onQmlChanged = (tabIndex: number, qml: string) => {
        const tab = this.state.tabs.find(item => item.index === tabIndex);

        const { tabs } = this.state;
        tabs[tabs.indexOf(tab)].qml = qml;

        this.setState({ tabs });
    }

    private onSaveClicked = () => {
        const { tabs, settings } = this.state;
        const { ipc } = this.props;

        Promise.all([
            ipc.command(SaveTabs, { tabs } as SaveTabs),
            ipc.command(SaveSettings, { settings } as SaveSettings),
        ])
            .then(() => ipc.command(RestartApp));
    }

    private onAddClicked = () => {
        const { tabs } = this.state;
        const maxIndex = max(tabs.map(tab => tab.index));

        tabs.push({
            index: maxIndex ? maxIndex + 1 : 1,
            qml: QML_TEMPLATE,
        });

        this.setState({ tabs });
    }

    private onRemoveClicked = (tabIndex: number) => {
        let { tabs } = this.state;

        tabs = tabs.filter(tab => tab.index !== tabIndex);

        this.setState({ tabs });
    }

    private onSettingChanged = (settingName: string, settingValue: boolean) => {
        const { settings } = this.state;
        const setting = settings.find(item => item.name === settingName);

        if (setting) {
            settings[settings.indexOf(setting)].value = settingValue ? '1' : '0';

            this.setState({ settings });
        }
    }

    private onCloseClicked = () => {
        const { ipc } = this.props;

        ipc.command(CloseSettings);
    }
}
