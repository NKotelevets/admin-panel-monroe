import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import LeagueAndTournamentsTable from '@/pages/Protected/LeaguesAndTournaments/components/LeagueAndTournamentsTable'

import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

// import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'

// import { useBulkDeleteMutation, useDeleteAllMutation } from '@/redux/leagues/leagues.api'
import { PATH_TO_CREATE_LEAGUE_TOURNAMENT } from '@/constants/paths'

const LeaguesAndTournaments = () => {
  const navigate = useNavigate()
  const { total } = useLeagueSlice()
  const [selectedRecordsIds, setSelectedRecordsIds] = useState<string[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)
  const [isDeleteAllRecords, setIsDeleteAllRecords] = useState(false)
  const deleteRecordsModalCount = isDeleteAllRecords ? total : selectedRecordsIds.length
  // const [deleteAll] = useDeleteAllMutation()
  // const [bulkDelete] = useBulkDeleteMutation()
  // const { setAppNotification } = useAppSlice()

  const goToCreateLeagueTournamentPage = () => navigate(PATH_TO_CREATE_LEAGUE_TOURNAMENT)

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false)
  }, [])

  const handleDelete = () => {
    // if (isDeleteAllRecords) {
    //   deleteAll()
    // } else {
    //   bulkDelete({ ids: selectedRecordsIds })
    //     .unwrap()
    //     .then(() => {
    //       setAppNotification({
    //         message: `${selectedRecordsIds.length}/${selectedRecordsIds.length} leagues/tournaments have been successfully removed.`,
    //         timestamp: new Date().getTime(),
    //         type: 'success',
    //       })
    //       handleCloseModal()
    //     })
    // }
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Leagues and Tournaments</title>
      </Helmet>

      {isOpenModal && (
        <MonroeModal
          onCancel={handleCloseModal}
          okText="Delete"
          onOk={handleDelete}
          title={`Delete ${deleteRecordsModalCount} leagues/tournaments?`}
          type="warn"
          content={
            <>
              <p>Are you sure you want to delete {deleteRecordsModalCount} leagues/tournaments?</p>
            </>
          }
        />
      )}

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
              {!!selectedRecordsIds.length && (
                <MonroeButton
                  isDisabled={false}
                  label="Delete"
                  type="default"
                  icon={<DeleteOutlined />}
                  iconPosition="start"
                  onClick={() => setIsOpenModal(true)}
                  className="view-delete-button"
                />
              )}

              <Button className="import-button" icon={<UploadOutlined />} iconPosition="start" type="default">
                Import CSV
              </Button>

              <Button
                icon={<PlusOutlined />}
                iconPosition="start"
                type="primary"
                onClick={goToCreateLeagueTournamentPage}
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

          <Flex flex="1 1 auto" vertical>
            <LeagueAndTournamentsTable
              isDeleteAllRecords={isDeleteAllRecords}
              setSelectedRecordsIds={setSelectedRecordsIds}
              selectedRecordIds={selectedRecordsIds}
              showAdditionalHeader={showAdditionalHeader}
              setShowAdditionalHeader={setShowAdditionalHeader}
              setIsDeleteAllRecords={setIsDeleteAllRecords}
            />
          </Flex>
        </Flex>
      </BaseLayout>
    </>
  )
}

export default LeaguesAndTournaments
