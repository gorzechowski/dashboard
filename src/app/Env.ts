import { isUndefined } from 'lodash';

export const getEnv = (): string => isUndefined(process.env.NODE_ENV) ? 'production' : process.env.NODE_ENV;

export const isDev = (): boolean => getEnv() === 'development';
