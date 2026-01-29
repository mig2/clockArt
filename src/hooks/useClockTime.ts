import { useState, useEffect, useCallback, useRef } from 'react'

export interface ClockTime {
  hours: number
  minutes: number
  seconds: number
}

export interface UseClockTimeReturn {
  /** Current simulated time */
  time: ClockTime
  /** Set the clock to a specific time */
  setTime: (hours: number, minutes: number, seconds: number) => void
  /** Reset to current wall-clock time */
  setNow: () => void
  /** Current speed multiplier */
  speed: number
  /** Change the speed multiplier */
  setSpeed: (speed: number) => void
}

function getNow(): ClockTime {
  const now = new Date()
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  }
}

/** Increment a ClockTime by one second, handling rollover */
function tickForward(t: ClockTime): ClockTime {
  let { hours, minutes, seconds } = t
  seconds++
  if (seconds >= 60) {
    seconds = 0
    minutes++
    if (minutes >= 60) {
      minutes = 0
      hours++
      if (hours >= 24) {
        hours = 0
      }
    }
  }
  return { hours, minutes, seconds }
}

/**
 * Hook that provides a clock time with adjustable speed.
 *
 * - speed=1: real time (1 simulated second per 1 real second)
 * - speed=10: 10× (10 simulated seconds per 1 real second)
 * - speed=60: 60× (1 simulated minute per 1 real second)
 *
 * The interval is `1000 / speed` ms, each tick advancing 1 simulated second.
 */
export function useClockTime(initialSpeed = 1): UseClockTimeReturn {
  const [time, setTimeState] = useState<ClockTime>(getNow)
  const [speed, setSpeedState] = useState(initialSpeed)
  const timeRef = useRef<ClockTime>(getNow())

  const setTime = useCallback((hours: number, minutes: number, seconds: number) => {
    const t = { hours, minutes, seconds }
    timeRef.current = t
    setTimeState(t)
  }, [])

  const setNow = useCallback(() => {
    const t = getNow()
    timeRef.current = t
    setTimeState(t)
  }, [])

  const setSpeed = useCallback((s: number) => {
    setSpeedState(Math.max(1, Math.min(60, s)))
  }, [])

  useEffect(() => {
    const intervalMs = 1000 / speed

    const intervalId = setInterval(() => {
      const next = tickForward(timeRef.current)
      timeRef.current = next
      setTimeState(next)
    }, intervalMs)

    return () => {
      clearInterval(intervalId)
    }
  }, [speed])

  return { time, setTime, setNow, speed, setSpeed }
}
