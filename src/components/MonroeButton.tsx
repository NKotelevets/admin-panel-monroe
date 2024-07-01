import { Button } from 'antd'
import { FC, ReactNode } from 'react'

interface IMonroeButtonProps {
  label: string
  isDisabled: boolean
  type: 'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined
  onClick?: () => void
  htmlType?: 'button' | 'submit' | 'reset'
  className?: string
  icon?: ReactNode
  iconPosition?: 'start' | 'end' | undefined
}

const MonroeButton: FC<IMonroeButtonProps> = ({
  isDisabled,
  label,
  onClick,
  type,
  htmlType = 'button',
  className,
  icon,
  iconPosition,
}) => (
  <Button
    className={className}
    style={{
      border: 0,
      height: '40px',
      width: '100%',
      fontSize: '16px',
    }}
    type={type}
    onClick={onClick}
    disabled={isDisabled}
    htmlType={htmlType}
    icon={icon}
    iconPosition={iconPosition}
  >
    {label}
  </Button>
)

export default MonroeButton
