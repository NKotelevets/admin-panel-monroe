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

      if (seconds >= 5) {
        cleanError()
        setSeconds(0)
        clearInterval(interval)
      }
    }

    if (!error.message && interval) {
      cleanError()
      setSeconds(0)
      clearInterval(interval)
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
        right: '24px',
        bottom: error.message ? '20px' : '5px',
        opacity: error.message ? 1 : 0,
        transition: 'all 0.3s linear 0s',
        zIndex: 999,
      }}
    >
      {error.message && (
        <Alert
          style={{
            width: 'calc(40vw - 48px)',
            padding: '9px 16px',
          }}
          message={error.message}
          showIcon
          type="error"
          closable
          onClose={() => {
            cleanError()
            setSeconds(0)
          }}
        />
      )}
    </Flex>
  )
}

export default Notification

