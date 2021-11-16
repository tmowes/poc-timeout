import { useEffect, useState } from 'react'

export const useDebouncedValue = (value: string | number, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeHandler = setTimeout(() => setDebouncedValue(value), delay)
    return () => {
      clearTimeout(timeHandler)
    }
  }, [value, delay])

  return debouncedValue
}
