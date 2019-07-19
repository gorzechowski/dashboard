import { findMessageName } from '../ipc';

type SubscriberListener = (message: any) => Promise<any>;

export type CommandSubscriber = (name: object | string, listener: SubscriberListener) => void;
export type QuerySubscriber = (name: object | string, listener: SubscriberListener) => void;

export const commandSubscriberFactory = (ipc: any): CommandSubscriber =>
    (name: object | string, listener: SubscriberListener): void => {
        if (typeof name !== 'string') {
            name = findMessageName(name);
        }

        ipc.on(name, async (event: any, message: any) => {
            await listener(message);

            event.reply(`${name}-reply`);
        });
    };

export const querySubscriberFactory = (ipc: any): QuerySubscriber =>
    (name: object | string, listener: SubscriberListener): void => {
        if (typeof name !== 'string') {
            name = findMessageName(name);
        }

        ipc.on(name, async (event: any, message: any) => {
            const result = await listener(message);

            event.reply(`${name}-reply`, result);
        });
    };
