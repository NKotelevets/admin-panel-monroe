import { Modal } from 'antd'
import { FC, ReactNode } from 'react'

import classNames from './monroe-modal.module.css'

type TMonroeModalType = 'warn'

interface IMonroeModalProps {
  onOk: () => void
  onCancel: () => void
  type: TMonroeModalType
  title: string
  content?: ReactNode
  okText: string
}

const MonroeModal: FC<IMonroeModalProps> = ({ onCancel, onOk, title, content, okText }) => (
  <div className={classNames['monroe-modal-overlay']}>
    <Modal
      className={classNames['monroe-modal']}
      title={title}
      centered
      open
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
    >
      {content}
    </Modal>
  </div>
)

export default MonroeModal

