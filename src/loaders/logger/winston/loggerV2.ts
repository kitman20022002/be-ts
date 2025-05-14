import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';
import * as fs from 'fs';



const logDir = 'storage/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const createLogger = (filename?: string) => {

  const dailyRotateFileTransport = new (winston.transports as any).DailyRotateFile({
    filename: path.join(logDir, 'logger-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  });

  const transports: winston.transport[] = [dailyRotateFileTransport];

  if (process.env.NODE_ENV === 'development' || 'local') {
    transports.push(new winston.transports.Console());
  }

  const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
      file: filename ? path.basename(filename) : undefined,
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        ({ timestamp, level, message, file, error, requestPath, method }) => {
          const fileInfo = file ? `[${file}]` : '';
          const requestInfo = requestPath && method ? `[${method} ${requestPath}]` : '';
          const stack = error?.stack;
          const contextInfo = error?.context ? `\n${JSON.stringify(error.context)}` : '';
          const stackTrace = stack ? `\n${stack}` : '';
          return `[${timestamp}]${fileInfo}${requestInfo} [${level}]: ${message}${contextInfo}${stackTrace}`;
        },
      ),
    ),
    transports,
  });
  return logger;
};

const logger = createLogger();
export { createLogger, logger };