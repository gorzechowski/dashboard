import { findMessageName } from '../ipc';

export type CommandSender = (event: any, payload?: any) => Promise<any>;
export type QuerySender = (event: any) => Promise<any>;

export const ipcSendFactory = (ipc: any): CommandSender | QuerySender => (message: any, payload?: any): Promise<any> =>
    new Promise((resolve, reject) => {
        if (typeof message !== 'string') {
            message = findMessageName(message);
        }

        let timerId;

        const onReply = (_: any, data: any) => {
            clearTimeout(timerId);
            resolve(data);
        };

        timerId = setTimeout(() => {
            ipc.removeListener(`${message}-reply`, onReply);
            reject();
        }, 5000);

        ipc.once(`${message}-reply`, onReply);

        ipc.send(message, payload);
    });

export interface IpcInterface {
    command: CommandSender;
    query: QuerySender;
}
