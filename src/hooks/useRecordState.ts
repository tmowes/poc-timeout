import { ReducerWithoutAction, useReducer } from 'react'

type StateAction<S> = Partial<Record<keyof S, S[keyof S]>> | ReducerWithoutAction<S>

export const useRecordState = <T extends Record<string, unknown>>(initialState: T) =>
  useReducer((prevState: T, action: StateAction<T>) => {
    if (typeof action === 'function') {
      return {
        ...prevState,
        ...action(prevState),
      }
    }
    const hasUpdated = Object.entries(action).some(
      ([key, value]) => prevState[key] !== value,
    )
    return hasUpdated ? { ...prevState, ...action } : prevState
  }, initialState)
