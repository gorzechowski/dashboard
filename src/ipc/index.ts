import { findKey } from 'lodash';
import { GetTabs, GetSettings } from './query';
import { Authenticate, CloseSettings, RegisterTab, SaveSettings, SaveTabs, RestartApp, Log } from './command';

const messagesMapping = {
    'get-tabs': GetTabs,
    'get-settings': GetSettings,
    'close-settings': CloseSettings,
    'save-tabs': SaveTabs,
    'save-settings': SaveSettings,
    'register-tab': RegisterTab,
    'restart-app': RestartApp,
    'auth': Authenticate,
    'log': Log,
};

export const findMessageName = (type: any) => {
    return findKey(messagesMapping, value => type === value);
};
