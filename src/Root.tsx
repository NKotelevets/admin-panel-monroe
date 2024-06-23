import { Route, Routes } from 'react-router-dom'

import SignIn from '@/pages/Auth/SingIn'
import ProtectedPage from '@/pages/Protected'
import TeamsPage from '@/pages/Teams'

import Notification from '@/components/Notification'

import AuthProvider from '@/utils/AuthProvider'

const Root = () => (
  <AuthProvider>
    <Notification />
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/protected" element={<ProtectedPage />} />
      <Route path="/team/:id" element={<TeamsPage />} />
    </Routes>
  </AuthProvider>
)

export default Root

