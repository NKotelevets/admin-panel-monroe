import { Route, Routes } from 'react-router-dom'

import SignIn from '@/pages/Auth/SingIn'
import LeaguesAndTournaments from '@/pages/Protected/LeaguesAndTournaments'

import Notification from '@/components/Notification'

import AuthProvider from '@/utils/AuthProvider'

import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE, PATH_TO_SIGN_IN_PAGE } from '@/constants/paths'

const Root = () => (
  <AuthProvider>
    <Notification />

    <Routes>
      <Route path={PATH_TO_SIGN_IN_PAGE} element={<SignIn />} />
      <Route path={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE} element={<LeaguesAndTournaments />} />
    </Routes>
  </AuthProvider>
)

export default Root

