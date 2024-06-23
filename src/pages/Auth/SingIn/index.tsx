import { Checkbox, Flex, Tooltip, Typography } from 'antd'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import * as Yup from 'yup'

import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroePasswordInput from '@/components/Inputs/MonroePasswordInput'
import MonroeButton from '@/components/MonroeButton'

import AuthLayout from '@/layouts/AuthLayout'

import { useSignInMutation } from '@/redux/auth/auth.api'
import { useLazyGetUserQuery } from '@/redux/user/user.api'

import { useCookies } from '@/hooks/useCookies'

import { AUTH_PAGES, PATH_TO_PROTECTED_PAGE } from '@/constants/paths'

import './sign-in.styles.css'

import LogotypeIcon from '@/assets/icons/logotype.svg'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const SignIn = () => {
  const navigate = useNavigate()
  const [isStaySignedIn, setIsStaySignedIn] = useState(false)
  const [signIn] = useSignInMutation()
  const { createCookie } = useCookies()
  const [searchParams] = useSearchParams()
  const prevRoute = searchParams.get('prev')
  const [getUserData] = useLazyGetUserQuery()

  const handleSubmit = (values: { email: string; password: string }) =>
    signIn({
      ...values,
      isStaySignIn: isStaySignedIn,
    })
      .unwrap()
      .then((data) => {
        createCookie('accessToken', data.access)
        createCookie('refreshToken', data.refresh)

        getUserData()

        if ((prevRoute && AUTH_PAGES.includes(prevRoute)) || !prevRoute) {
          navigate(PATH_TO_PROTECTED_PAGE)
        } else {
          navigate(prevRoute)
        }
      })

  return (
    <>
      <Helmet>
        <title>Admin Panel | Sign in</title>
      </Helmet>
      <AuthLayout>
        <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, errors, handleSubmit }) => {
            const isDisabledButton = Object.keys(errors).length === 0 && values.email && values.password

            return (
              <Flex align="center" justify="center" flex="1 1 auto" style={{ width: '400px' }}>
                <Form onSubmit={handleSubmit}>
                  <Flex vertical className="wrapper" style={{ width: '360px' }} justify="flex-start">
                    <ReactSVG src={LogotypeIcon} />

                    <Flex vertical style={{ margin: '32px 0 24px' }}>
                      <Typography.Title
                        className="title"
                        level={1}
                        style={{
                          color: '#1A1657',
                          fontSize: '30px',
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        Welcome back!
                      </Typography.Title>

                      <Typography.Title
                        className="subtitle"
                        level={5}
                        style={{
                          color: 'rgba(26, 22, 87, 0.85)',
                          fontSize: '14px',
                          margin: 0,
                        }}
                      >
                        Please enter your details
                      </Typography.Title>
                    </Flex>

                    <Flex vertical>
                      <MonroeInput
                        name="email"
                        label="Email"
                        error={errors.email}
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter your email here"
                      />
                      <Flex vertical style={{ margin: '16px 0' }}>
                        <MonroePasswordInput
                          label="Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Enter your password here"
                        />
                      </Flex>
                    </Flex>

                    <Flex vertical={false} justify="space-between" style={{ marginBottom: '40px', cursor: 'pointer' }}>
                      <Flex vertical={false} align="center">
                        <Checkbox
                          className="custom-checkbox"
                          checked={isStaySignedIn}
                          onChange={() => setIsStaySignedIn((prev) => !prev)}
                        />

                        <Typography.Text
                          className="checkbox-text"
                          style={{
                            color: 'rgba(26, 22, 87, 0.85)',
                            marginLeft: '8px',
                          }}
                        >
                          Stay signed in
                        </Typography.Text>
                      </Flex>

                      <Tooltip
                        overlayClassName="forgot-password-tooltip"
                        placement="top"
                        title="In order to recover your password, please go to Swift Schedule's mobile app"
                        color="#62636D"
                      >
                        <Typography.Text className="forgot-password">Forgot password</Typography.Text>
                      </Tooltip>
                    </Flex>

                    <Tooltip placement="top" title={errors.email ? 'Email is not valid' : ''} color="#62636D">
                      <Flex flex="1 1 auto" style={{ width: '100%' }}>
                        <MonroeButton label="Sign in" isDisabled={!isDisabledButton} type="primary" htmlType="submit" />
                      </Flex>
                    </Tooltip>
                  </Flex>
                </Form>
              </Flex>
            )
          }}
        </Formik>
      </AuthLayout>
    </>
  )
}

export default SignIn

