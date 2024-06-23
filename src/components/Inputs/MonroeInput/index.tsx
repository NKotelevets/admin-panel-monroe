import { Flex, Input, Typography } from 'antd'
import { ChangeEventHandler, FC } from 'react'

import '../monroe-input.style.css'

interface IMonroeInputProps {
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  error?: string
}

const MonroeInput: FC<IMonroeInputProps> = ({ label, error, ...rest }) => (
  <>
    <Flex vertical={false} justify="space-between" align="center">
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

      {error && (
        <Typography.Text
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#BC261B',
          }}
        >
          {error}
        </Typography.Text>
      )}
    </Flex>

    <Input className="input" {...rest} />
  </>
)

export default MonroeInput

