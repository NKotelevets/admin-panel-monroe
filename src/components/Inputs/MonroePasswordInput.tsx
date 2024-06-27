import { Input, Typography } from 'antd'
import { ChangeEventHandler, FC } from 'react'

import '../monroe-input.style.css'

interface IMonroeInputProps {
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
}

const MonroeInput: FC<IMonroeInputProps> = ({ label, ...rest }) => (
  <>
    <Typography.Title
      level={4}
      style={{
        fontSize: '14px',
        fontWeight: 400,
        color: 'rgba(26, 22, 87, 0.85)',
      }}
    >
      {label}
    </Typography.Title>

    <Input.Password className="input" {...rest} />
  </>
)

export default MonroeInput

