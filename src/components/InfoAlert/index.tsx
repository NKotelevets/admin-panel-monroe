import { Alert, Flex, Typography } from 'antd'
import { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

import InfoIcon from '@/assets/icons/info.svg'

const backgroundStyles: CSSProperties = {
  position: 'absolute',
  right: '24px',
  bottom: '20px',
  transition: 'all 0.3s linear 0s',
  zIndex: 999,
}

const alertStyles: CSSProperties = {
  width: 'calc(40vw - 48px)',
  padding: '9px 16px',
  backgroundColor: '#F1F0FF',
  borderColor: '#A49EFF',
  borderRadius: '2px',
}

const alertTypographyStyles: CSSProperties = {
  color: '#3E34CA',
  fontSize: '14px',
  fontWeight: 400,
  cursor: 'pointer',
}

const InfoAlert = () => {
  const { infoNotification, clearInfoNotification } = useAppSlice()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(infoNotification.redirectedPageUrl)
    clearInfoNotification()
  }

  return (
    <Flex style={backgroundStyles}>
      {infoNotification.message && (
        <Alert
          style={alertStyles}
          message={infoNotification.message}
          showIcon
          type="info"
          icon={<ReactSVG src={InfoIcon} style={{ marginTop: '5px' }} />}
          closable
          onClose={() => clearInfoNotification()}
          description={
            <Typography style={alertTypographyStyles} onClick={handleClick}>
              {infoNotification.actionLabel}
            </Typography>
          }
        />
      )}
    </Flex>
  )
}

export default InfoAlert

