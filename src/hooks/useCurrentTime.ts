import { useState, useEffect } from 'react'

interface CurrentTime {
  hours: number
  minutes: number
  seconds: number
}

/**
 * Hook that returns the current time, updating every second.
 * Returns hours (0-23), minutes (0-59), and seconds (0-59).
 */
export function useCurrentTime(): CurrentTime {
  const getTime = (): CurrentTime => {
    const now = new Date()
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    }
  }

  const [time, setTime] = useState<CurrentTime>(getTime)

  useEffect(() => {
    // Update immediately in case we missed a second
    setTime(getTime())

    // Calculate ms until next second to sync with wall clock
    const msUntilNextSecond = 1000 - new Date().getMilliseconds()

    let intervalId: ReturnType<typeof setInterval> | null = null

    // First timeout to sync with the start of a second
    const syncTimeout = setTimeout(() => {
      setTime(getTime())

      // Then interval every second
      intervalId = setInterval(() => {
        setTime(getTime())
      }, 1000)
    }, msUntilNextSecond)

    // Cleanup both timeout and interval on unmount
    return () => {
      clearTimeout(syncTimeout)
      if (intervalId !== null) {
        clearInterval(intervalId)
      }
    }
  }, [])

  return time
}
