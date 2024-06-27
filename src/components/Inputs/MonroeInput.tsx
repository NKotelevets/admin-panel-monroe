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
  inputClasses?: string
  labelClasses?: string
}

const MonroeInput: FC<IMonroeInputProps> = ({ label, error, inputClasses, labelClasses, ...rest }) => (
  <>
    <Flex vertical={false} justify="space-between" align="center">
      <Typography.Title className={`input-label ${labelClasses}`} level={4}>
        {label}
      </Typography.Title>

      {error && <Typography.Text className="input-error">{error}</Typography.Text>}
    </Flex>

    <Input className={`input ${inputClasses}`} {...rest} />
  </>
)

export default MonroeInput
