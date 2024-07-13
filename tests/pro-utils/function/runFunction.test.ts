import { runFunction } from '@utils';

// @ts-ignore
global.window = {
  // 模拟 window 对象的相关属性或方法
} as any;

describe('runFunction', () => {
  test('should call the function with provided arguments', () => {
    const func = jest.fn();
    runFunction(func, 1, 2, 3);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1, 2, 3);
  });

  test('should return the value when not a function', () => {
    const value = 'testValue';
    const result = runFunction(value);
    expect(result).toEqual(value);
  });
});
