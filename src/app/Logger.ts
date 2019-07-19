import { createLogger, format, transports } from 'winston';
import 'reflect-metadata';
import Env from './decorator/Env';
import { isDev } from './Env';
import DataDir from './decorator/DataDir';

class LoggerFactory {
    @Env()
    public static env: string;

    @DataDir()
    public static dataDir: string;

    public static create() {
        const myFormat = format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
        });

        const defaultFormatters = [
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.errors({ stack: true }),
            format.splat(),
            myFormat,
        ];

        const logger = createLogger({
            level: isDev() ? 'debug' : 'info',
            format: format.combine(...defaultFormatters),
            transports: [
                new transports.Console({
                    format: format.combine(format.colorize(), ...defaultFormatters),
                }),
            ],
        });

        if (!isDev()) {
            logger.add(new transports.File({
                format: format.combine(...defaultFormatters),
                dirname: this.dataDir,
                filename: 'dashboard.log',
            }));
        }

        return logger;
    }
}

const Logger = LoggerFactory.create();

export default Logger;
