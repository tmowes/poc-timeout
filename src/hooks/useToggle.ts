import { useReducer } from 'react'

export const useToggle = (initialValue: boolean) =>
  useReducer((prev: boolean) => !prev, initialValue)
