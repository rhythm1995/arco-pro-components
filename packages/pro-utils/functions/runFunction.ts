/** 
 * 运行函数或返回给定值
 *
 * @param valueEnum - 要运行的函数或要返回的值
 * @param rest - 传递给函数的值
 * @returns 如果 valueEnum 是函数，则返回调用该函数的结果，否则返回 valueEnum
 */
export function runFunction<T extends any[]>(valueEnum: any,...rest: T) {
  if (typeof valueEnum === 'function') {
      return valueEnum(...rest);
  }
  return valueEnum;
}
