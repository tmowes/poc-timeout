import { DependencyList, EffectCallback, useEffect, useLayoutEffect, useRef } from 'react'

type Destructor = ReturnType<EffectCallback>

type UseAsyncEffectHook = {
  (effect: () => Promise<void>, destructor?: Destructor, deps?: DependencyList): void
  (effect: () => Promise<void>, deps?: DependencyList): void
}

export const useAsyncEffect: UseAsyncEffectHook = (
  effect: () => Promise<void>,
  destructor?: Destructor | DependencyList,
  deps?: DependencyList,
) => {
  const willDestroy = typeof destructor === 'function'

  const dependencyList = willDestroy
    ? (deps as DependencyList)
    : (destructor as DependencyList)

  const effectHandler = useRef(effect)

  useLayoutEffect(() => {
    effectHandler.current = effect
  }, [effect])

  useEffect(() => {
    effectHandler.current()

    return () => {
      if (willDestroy) {
        destructor()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList)
}
