import { Flex } from 'antd'
import { useNavigate } from 'react-router-dom'

import MonroeButton from '@/components/MonroeButton'

import { useLogout } from '@/hooks/useLogout'

import { PATH_TO_RANDOM_TEAM_PAGE } from '@/constants/paths'

const ProtectedPage = () => {
  const navigate = useNavigate()
  const { onLogOut } = useLogout()

  const viewRandomTeam = () => {
    const randomTeamId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
    navigate(`${PATH_TO_RANDOM_TEAM_PAGE}/${randomTeamId}`)
  }

  return (
    <Flex vertical align="center">
      <Flex vertical align="center" style={{ width: '600px' }}>
        <h1>Protected pages</h1>

        <MonroeButton
          isDisabled={false}
          label="Random team page"
          type="default"
          htmlType="button"
          onClick={viewRandomTeam}
        />

        <MonroeButton
          isDisabled={false}
          label="Log out"
          type="primary"
          htmlType="button"
          onClick={() => {
            onLogOut()
          }}
        />
      </Flex>
    </Flex>
  )
}

export default ProtectedPage

