import { useEffect, useLayoutEffect, useRef } from 'react'

type UseEventListenerOptions = {
  enabled?: boolean
  target?: GlobalEventHandlers
}

type UseEventListenerHook = <EventType extends keyof GlobalEventHandlersEventMap>(
  eventType: EventType,
  event: (e: GlobalEventHandlersEventMap[EventType]) => void,
  options?: UseEventListenerOptions,
) => void

const DEFAULT_OPTIONS: UseEventListenerOptions = {
  enabled: true,
  target: document,
}

export const useEventListener: UseEventListenerHook = (
  eventType,
  event,
  options = DEFAULT_OPTIONS,
) => {
  const { enabled = true, target = document } = options

  const eventHandlerRef = useRef(event)

  useLayoutEffect(() => {
    eventHandlerRef.current = event
  })

  useEffect(() => {
    if (!enabled) {
      return () => null
    }

    const eventHandler: typeof eventHandlerRef.current = (e) => {
      eventHandlerRef.current.call(target, e)
    }

    target.addEventListener(eventType, eventHandler)

    return () => {
      target.removeEventListener(eventType, eventHandler)
    }
  }, [enabled, eventType, target])
}
