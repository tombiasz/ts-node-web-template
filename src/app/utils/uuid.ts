import * as _uuid from 'uuid';

export const ID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const uuid = {
  generate: (): string => {
    return _uuid.v4();
  },

  of: (value: string): string => {
    value = value.trim().toLocaleLowerCase();

    if (!ID_REGEX.test(value)) {
      throw new Error('invalid uuid');
    }

    return value;
  },
};
