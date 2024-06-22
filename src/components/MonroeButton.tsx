import { Button } from 'antd'
import { FC } from 'react'

interface IMonroeButtonProps {
  label: string
  isDisabled: boolean
  type: 'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined
  onClick?: () => void
  htmlType?: 'button' | 'submit' | 'reset'
}

const MonroeButton: FC<IMonroeButtonProps> = ({ isDisabled, label, onClick, type, htmlType = 'button' }) => (
  <Button
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
  >
    {label}
  </Button>
)

export default MonroeButton
