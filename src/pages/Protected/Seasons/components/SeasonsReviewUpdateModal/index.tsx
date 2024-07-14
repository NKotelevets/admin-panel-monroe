import { containerStyles, contentStyles, contentWrapperStyles, defaultButtonStyles, titleStyles } from './styles'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { FC, useState } from 'react'

import SeasonDetailsColumn from '@/pages/Protected/Seasons/components/SeasonsReviewUpdateModal/components/SeasonDetailsColumn'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { compareObjects } from '@/utils/compareObjects'

import { ISeasonReviewUpdateData } from '@/common/interfaces/season'

const SeasonsReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = ({ idx, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const { duplicates } = useSeasonSlice()
  const currentDuplicate = duplicates.find((duplicate) => duplicate.index === currentIdx)
  const duplicateData = currentDuplicate!.existing
  const newData = currentDuplicate!.new

  const normalizedNewData: ISeasonReviewUpdateData = {
    expectedEndDate: newData.expectedEndDate,
    linkedLeagueName: newData.linkedLeagueTournament,
    name: newData.name,
    playoffFormat: newData.playoffFormat,
    standingsFormat: newData.standingsFormat,
    startDate: newData.startDate,
    tiebreakersFormat: newData.tiebreakersFormat,
  }

  const normalizedExistingData: ISeasonReviewUpdateData = {
    expectedEndDate: duplicateData.expected_end_date,
    linkedLeagueName: duplicateData.league.name,
    name: duplicateData.name,
    playoffFormat: 'Currently not available',
    startDate: duplicateData.start_date,
    standingsFormat: 'Currently not available',
    tiebreakersFormat: 'Currently not available',
  }

  const objectsDifferences: Record<Partial<keyof ISeasonReviewUpdateData>, boolean> = compareObjects(
    normalizedNewData,
    normalizedExistingData,
  )

  const handleNextDuplicate = () => setCurrentIdx((prev) => prev + 1)

  const handlePrevDuplicate = () => setCurrentIdx((prev) => prev - 1)

  const handleUpdate = () => {
    // TODO: add functionality when BE will be ready
  }

  const handleUpdateAll = () => {
    // TODO: add functionality when BE will be ready
  }

  return (
    <Flex style={containerStyles} align="center" justify="center">
      <Flex style={contentWrapperStyles} vertical>
        <Flex vertical style={contentStyles}>
          <Typography.Title level={3} style={titleStyles}>
            Review update
          </Typography.Title>

          <Flex>
            <SeasonDetailsColumn
              {...normalizedExistingData}
              title="current"
              isNew={false}
              differences={objectsDifferences}
            />

            <SeasonDetailsColumn {...normalizedNewData} title="new" isNew differences={objectsDifferences} />
          </Flex>
        </Flex>

        <Flex align="center" justify="space-between" style={{ padding: '16px' }}>
          <Flex align="center">
            <Button
              disabled={currentIdx === 0}
              style={{
                background: 'transparent',
                border: 0,
                padding: 6,
              }}
              onClick={handlePrevDuplicate}
            >
              <LeftOutlined />
            </Button>
            <Button
              disabled={currentIdx + 1 === duplicates.length}
              style={{
                background: 'transparent',
                border: 0,
                padding: 6,
              }}
              onClick={handleNextDuplicate}
            >
              <RightOutlined />
            </Button>

            <Typography.Text style={{ color: 'rgba(26, 22, 87, 1)' }}>
              {currentIdx + 1} of {duplicates.length} duplicate
            </Typography.Text>
          </Flex>

          <Flex>
            <Button type="default" style={defaultButtonStyles} onClick={onClose}>
              Close
            </Button>

            <Button type="default" style={defaultButtonStyles} onClick={handleUpdateAll}>
              Update All
            </Button>

            <Button disabled={currentIdx + 1 === duplicates.length} type="default" style={defaultButtonStyles}>
              Skip for this
            </Button>

            <Button
              type="primary"
              style={{
                borderRadius: '4px',
              }}
              onClick={handleUpdate}
            >
              Update current
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SeasonsReviewUpdateModal

