import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { nonNullishAsync } from './nonNullishAsync';
import { nullType } from './nullType';
import { number } from './number';
import { any } from './any';
import { undefinedType } from './undefinedType';
import { nullish } from './nullish';
import { unionAsync } from './unionAsync';
import { stringAsync } from './stringAsync';

describe('nonNullishAsync', () => {
  test('should not pass null or undefined', async () => {
    const schema1 = nonNullishAsync(
      unionAsync([stringAsync(), nullType(), undefinedType()])
    );
    const input1 = 'test';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    await expect(parseAsync(schema1, null)).rejects.toThrowError();
    await expect(parseAsync(schema1, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();

    const schema2 = nonNullishAsync(nullish(number()));
    const input2 = 123;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, null)).rejects.toThrowError();
    await expect(parseAsync(schema2, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema2, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema2, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not non nullish!';
    await expect(
      parseAsync(nonNullishAsync(any(), error), null)
    ).rejects.toThrowError(error);
  });
});
