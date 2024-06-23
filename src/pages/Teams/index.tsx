import { Flex } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import MonroeButton from '@/components/MonroeButton'

import { useLogout } from '@/hooks/useLogout'

import { PATH_TO_PROTECTED_PAGE } from '@/constants/paths'

const TeamsPage = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onLogOut } = useLogout()

  const goToProtectedPage = () => navigate(PATH_TO_PROTECTED_PAGE)

  return (
    <Flex vertical align="center">
      <Flex vertical align="center" style={{ width: '600px' }}>
        <h1>Team name: {params.id}</h1>
        <MonroeButton isDisabled={false} label="Go back" type="dashed" htmlType="button" onClick={goToProtectedPage} />
        <MonroeButton isDisabled={false} label="Log out" type="primary" htmlType="button" onClick={() => onLogOut()} />
      </Flex>
    </Flex>
  )
}

export default TeamsPage

