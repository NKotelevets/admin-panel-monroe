import { Flex } from 'antd'
import { FC, ReactNode, useState } from 'react'

import './tooltip.styles.css'

interface IMonroeTooltipProps {
  text: ReactNode
  children: ReactNode
  width: string
  containerWidth?: string
}

const MonroeTooltip: FC<IMonroeTooltipProps> = ({ children, text, width, containerWidth = 'auto' }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Flex
      className="tooltip"
      style={{
        width: containerWidth,
      }}
    >
      {showTooltip && (
        <Flex className="tooltip-content" style={{ width }}>
          {text}
        </Flex>
      )}

      <div
        style={{ width: containerWidth }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
    </Flex>
  )
}

export default MonroeTooltip

