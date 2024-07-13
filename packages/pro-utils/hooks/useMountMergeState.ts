// 导入 useEvent 自定义钩子，用于创建事件处理函数
import useEvent from './useEvent';
// 导入 useLayoutUpdateEffect 自定义钩子，用于在组件挂载后立即执行某些操作
import { useLayoutUpdateEffect } from './useLayoutEffect';
// 导入 useState 自定义钩子，用于管理组件的状态
import { useSafeState as useState } from './useState';

// 定义 Updater 类型，表示更新状态的函数或值
type Updater<T> = (
  updater: T | ((origin: T) => T),
  ignoreDestroy?: boolean,
) => void;

// 判断值是否存在
function hasValue(value: unknown) {
  return value !== undefined;
}
/**
 * 使用 useMergedState 自定义钩子函数来管理组件的状态，与 useState 类似，useMergedState 会在组件挂载时初始化一个内部状态 innerValue，默认为 defaultStateValue。如果提供了 defaultValue，则会使用 defaultValue。如果提供了 value，则会使用 value 覆盖 innerValue。如果两者都没有提供，则使用 defaultStateValue。 可以使用 triggerChange 函数来更新 innerValue。updater 参数可以是一个值或者一个函数。如果是一个函数，它会接收当前状态作为参数，并应返回新的状态。后面的参数 ignoreDestroy 是一个可选的布尔值，用于控制即使组件卸载或销毁，状态更新也会被执行。这通常在一些特殊场景下使用，比如在动画或者异步操作中，确保某些操作即使组件销毁也能完成。 此外，您还可以提供一个 onChange 回调函数，它会在状态变化时被调用，接收两个参数：新状态和旧状态。如果存在 postState 函数，返回的值会作为 postMergedValue 返回，该值通常用于只读展示目的或渲染组件时使用。这种设计使得 useMergedState 非常适合需要同时支持受控和非受控模式的组件，让开发者能够灵活地管理状态。
 * @param defaultStateValue 默认状态值
 * @param option 可选配置对象
 * @returns [R, Updater<T>]
 */
export default function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
  },
): [R, Updater<T>] {
  // 解构 option 对象，获取 defaultValue、value 和 onChange 函数
  const { defaultValue, value, onChange, postState } = option || {};

  // ======================= 初始化 =======================
  // 使用 useState 初始化 innerValue
  const [innerValue, setInnerValue] = useState<T>(() => {
    if (hasValue(value)) {
      return value;
    } else if (hasValue(defaultValue)) {
      return typeof defaultValue === 'function'
        ? (defaultValue as any)()
        : defaultValue;
    } else {
      return typeof defaultStateValue === 'function'
        ? (defaultStateValue as any)()
        : defaultStateValue;
    }
  });
  // 合并 value 和 innerValue，得到 mergedValue
  const mergedValue = value !== undefined ? value : innerValue;
  // 通过 postState 函数处理 mergedValue，得到 postMergedValue
  const postMergedValue = postState ? postState(mergedValue) : mergedValue;

  // ====================== 变化 ======================
  // 使用 useEvent 创建 onChangeFn，确保 onChange 函数在组件的整个生命周期内保持稳定
  const onChangeFn = useEvent(onChange);
  // 记录 mergedValue 的历史值，用于在 useLayoutUpdateEffect 中检查变化
  const [prevValue, setPrevValue] = useState<[T]>([mergedValue]);

  // 在布局阶段检查 innerValue 是否变化，若有变化则调用 onChangeFn
  useLayoutUpdateEffect(() => {
    const prev = prevValue[0];
    if (innerValue !== prev) {
      onChangeFn(innerValue, prev);
    }
  }, [prevValue]);

  // 当 value 变为 undefined 时，将 innerValue 同步回 undefined
  useLayoutUpdateEffect(() => {
    if (!hasValue(value)) {
      setInnerValue(value);
    }
  }, [value]);

  // ====================== 更新 ======================
  // 使用 useEvent 创建 triggerChange 函数，用于更新 innerValue
  const triggerChange: Updater<T> = useEvent((updater: any, ignoreDestroy: any) => {
    setInnerValue(updater, ignoreDestroy);
    // 更新 prevValue 为当前的 mergedValue
    setPrevValue([mergedValue], ignoreDestroy);
  });

  // 返回 postMergedValue 和 triggerChange
  return [postMergedValue as unknown as R, triggerChange];
}
