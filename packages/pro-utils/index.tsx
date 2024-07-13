import { isDeepEqualReact } from './functions/isDeepEqualReact';
import { runFunction } from './functions/runFunction';
import { useDebounceFn } from './hooks/useDebounceFn';
import { useDeepCompareEffect } from './hooks/useDeepCompareEffect';
import useMountMergeState from './hooks/useMountMergeState';
import { usePrevious } from './hooks/usePrevious';
import { useRefFunction } from './hooks/useRefFunction';
import { useSafeState } from './hooks/useState';

export {
  isDeepEqualReact,
  // functions
  runFunction,
  // hooks
  useDebounceFn, useDeepCompareEffect, useMountMergeState,
  usePrevious, useRefFunction, useSafeState
};

