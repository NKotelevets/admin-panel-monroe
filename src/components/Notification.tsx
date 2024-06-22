import { Alert, Flex } from 'antd'
import { useEffect, useRef, useState } from 'react'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

interface IResetSeconds {
  resetSeconds: () => void
}

const Notification = () => {
  const { cleanError, error } = useAppSlice()
  const [seconds, setSeconds] = useState<number>(0)

  const restoreCounter = () => setSeconds(0)

  const messageRef = useRef<IResetSeconds>({ resetSeconds: restoreCounter })

  useEffect(() => {
    if (error.message) restoreCounter()
  }, [error.message])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (error.message) {
      interval = setInterval(() => {
        setSeconds((state) => state + 1)
      }, 1000)

      if (seconds >= 6) {
        cleanError()
        setSeconds(0)
        clearInterval(interval)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [seconds, error.message])

  useEffect(() => {
    if (messageRef.current && error.message) messageRef.current.resetSeconds()
  }, [error.timestamp])

  return (
    <Flex
      style={{
        position: 'absolute',
        right: '20px',
        bottom: error.message && seconds < 4 ? '20px' : '5px',
        opacity: error.message && seconds < 4 ? 1 : 0,
        transition: 'all 0.7s linear 0s',
      }}
    >
      <Alert message={error.message} showIcon type="error" closable onClose={() => cleanError()} />
    </Flex>
  )
}

export default Notification

