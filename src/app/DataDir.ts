import { app } from 'electron';
import { isDev } from './Env';

export const getDataDir = (): string => isDev() ? app.getAppPath() : app.getPath('userData');
