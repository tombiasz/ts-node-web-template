import { Logger } from '../../logger';

export abstract class UseCase<TData, TReturn> {
  abstract execute(data: TData): Promise<TReturn>;

  static extendLoggerWithContext(logger: Logger) {
    return logger.withContext({
      useCase: this.name,
    });
  }
}
