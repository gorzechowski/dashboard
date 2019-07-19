import { noop } from 'lodash';
import { getEnv } from '../Env';

export default () =>
    (target: any, propertyName: string) => {
        Object.defineProperty(target, propertyName, {
            get: getEnv,
            set: () => noop,
            enumerable: true,
            configurable: true,
        });
    };
