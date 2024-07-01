import View from './pages/Protected/LeaguesAndTournaments/View'
import { Route, Routes } from 'react-router-dom'

import SignIn from '@/pages/Auth/SingIn'
import LeaguesAndTournaments from '@/pages/Protected/LeaguesAndTournaments'
import Create from '@/pages/Protected/LeaguesAndTournaments/Create'
import Edit from '@/pages/Protected/LeaguesAndTournaments/Edit'

import Notification from '@/components/Notification'

import AuthProvider from '@/utils/AuthProvider'

import {
  PATH_TO_CREATE_LEAGUE_TOURNAMENT,
  PATH_TO_EDIT_LEAGUE_TOURNAMENT,
  PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE,
  PATH_TO_LEAGUE_TOURNAMENT_PAGE,
  PATH_TO_SIGN_IN_PAGE,
} from '@/constants/paths'

const Root = () => (
  <AuthProvider>
    <Notification />

    <Routes>
      <Route path={PATH_TO_SIGN_IN_PAGE} element={<SignIn />} />
      <Route path={PATH_TO_CREATE_LEAGUE_TOURNAMENT} element={<Create />} />
      <Route path={`${PATH_TO_EDIT_LEAGUE_TOURNAMENT}/:id`} element={<Edit />} />
      <Route path={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE} element={<LeaguesAndTournaments />} />
      <Route path={`${PATH_TO_LEAGUE_TOURNAMENT_PAGE}/:id`} element={<View />} />
    </Routes>
  </AuthProvider>
)

export default Root
