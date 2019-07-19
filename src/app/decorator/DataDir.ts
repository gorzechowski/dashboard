import { noop } from 'lodash';
import { getDataDir } from '../DataDir';

export default () => {
    return (target: any, propertyName: string) => {
        Object.defineProperty(target, propertyName, {
            get: getDataDir,
            set: () => noop,
            enumerable: true,
            configurable: true,
        });
    };
};
