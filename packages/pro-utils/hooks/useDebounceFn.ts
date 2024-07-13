import { useCallback, useEffect, useRef } from 'react';
import { useRefFunction } from './useRefFunction';

/**
 * 一个去抖的 hook，传入一个 function，返回一个去抖后的 function
 * @param {(...args: T) => Promise<any>} fn - 要去抖的函数
 * @param {number} wait? - 延迟时间（以毫秒为单位），默认为 undefined
 * @returns {Object} - 包含 run 和 cancel 函数的对象
 */
export function useDebounceFn<T extends any[], U = any>(
  fn: (...args: T) => Promise<any>,
  wait?: number,
) {
  const callback = useRefFunction(fn);

  const timer = useRef<any>();

  /**
   * 取消当前的计时器，停止所有正在进行的延迟操作
   */
  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  /**
   * 执行去抖操作，并在延迟结束后调用传入的函数
   * @param {...any} args - 传递给原始函数的参数
   * @returns {Promise<U | undefined>} - 一个 Promise，当初始延迟为 0 或未定义时立即解析，否则在延迟结束后解析
   */
  const run = useCallback(
    async (...args: any): Promise<U | undefined> => {
      if (wait === 0 || wait === undefined) {
        return callback(...args);
      }
      cancel();
      return new Promise<U>((resolve) => {
        timer.current = setTimeout(async () => {
          resolve(await callback(...args));
          return;
        }, wait);
      });
    },
    [callback, cancel, wait],
  );
  // 当组件卸载时，取消所有计时器
  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    run,
    cancel,
  };
}
