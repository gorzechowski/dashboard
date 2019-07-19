import { app } from 'electron';
import { capitalize } from 'lodash';

export const appName = (): string => capitalize(app.getName());
