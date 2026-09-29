type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatLog(entry: LogEntry): string {
    const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      return `${base} ${JSON.stringify(entry.context)}`;
    }
    
    return base;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formatted);
        }
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        if (error?.stack) {
          console.error(error.stack);
        }
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
