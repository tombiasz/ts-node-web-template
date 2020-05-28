import { ITimeProvider } from '@app/userAccess/core';

export class TimeProvider implements ITimeProvider {
  getCurrentTime() {
    return new Date();
  }
}
