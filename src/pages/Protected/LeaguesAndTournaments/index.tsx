import Table from './Table'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { Helmet } from 'react-helmet'

import BaseLayout from '@/layouts/BaseLayout'

const LeaguesAndTournaments = () => {
  return (
    <>
      <Helmet>
        <title>Admin Panel | Leagues and Tournaments</title>
      </Helmet>

      <BaseLayout>
        <Flex
          vertical
          style={{
            padding: '16px 24px',
            overflow: 'auto',
            height: '100%',
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            vertical={false}
            style={{
              marginBottom: '24px',
            }}
          >
            <Typography.Title
              color="rgba(26, 22, 87, 0.85)"
              style={{
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              Leagues & Tournaments
            </Typography.Title>

            <Flex>
              <Button className="import-button" icon={<UploadOutlined />} iconPosition="start" type="default">
                Import CSV
              </Button>

              <Button
                icon={<PlusOutlined />}
                iconPosition="start"
                type="primary"
                style={{
                  borderRadius: '2px',
                  border: '1px solid #BC261B',
                  background: '#BC261B',
                  boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.04)',
                  fontSize: '14px',
                  fontWeight: 400,
                  height: '32px',
                }}
              >
                Create new leagues/tourns
              </Button>
            </Flex>
          </Flex>

          <Flex flex="1 1 auto">
            <Table />
          </Flex>
        </Flex>
      </BaseLayout>
    </>
  )
}

export default LeaguesAndTournaments
