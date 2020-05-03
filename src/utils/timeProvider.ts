import { ITimeProvider } from '@domain/core';

export class TimeProvider implements ITimeProvider {
  getCurrentTime() {
    return new Date();
  }
}
