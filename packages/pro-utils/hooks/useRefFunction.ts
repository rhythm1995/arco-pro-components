import { useCallback, useRef } from 'react';

/* 
 * useRefFunction 是一个自定义的 React Hook，它接受一个函数作为参数，并返回一个新的函数。这个新函数可以被调用来执行原始函数，并且可以在组件的整个生命周期内保持对原始函数的引用，即使这会导致 React 发出警告或错误。
 * 它使用了 React 的 useRef 和 useCallback Hooks 来实现这个功能。
 * @param {Function} reFunction - 要保持引用的函数。
 * @returns {Function} 一个新函数，调用它会执行原始函数。
 */
const useRefFunction = <T extends (...args: any) => any>(reFunction: T) => {
  // 创建一个 ref，使用 useRef 来保持对 reFunction 的引用
  const ref = useRef<any>(null);
  // 将 reFunction 赋值给 ref.current 属性，确保 ref.current 始终指向最新的 reFunction
  ref.current = reFunction;
  // 返回一个 useCallback 包裹的箭头函数，它使用 ref.current 来调用 reFunction，并传递参数 rest
  return useCallback((...rest: Parameters<T>): ReturnType<T> => {
    // 检查 ref.current 是否存在，若存在则调用它并传递参数 rest，使用可选链操作符安全地调用函数
    return ref.current?.(...(rest as any));
  }, []);
};

export { useRefFunction };
