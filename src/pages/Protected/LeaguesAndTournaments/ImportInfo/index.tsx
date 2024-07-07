import { FilterFilled, SearchOutlined } from '@ant-design/icons'
import { Button, GetProp, InputRef, Table, TableColumnType, TableProps } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import Input from 'antd/es/input/Input'
import Space from 'antd/es/space'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { useRef, useState } from 'react'
import { FC } from 'react'
import { ReactSVG } from 'react-svg'

import ReviewUpdateModal from '@/pages/Protected/LeaguesAndTournaments/components/ReviewUpdateModal'

import MonroeFilter from '@/components/Table/MonroeFilter'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import { IBECreateLeagueBody, IFELeague } from '@/common/interfaces/league'
import { TFullLeagueTournament } from '@/common/types/league'

import classes from './import-info.module.css'

import SyncIcon from '@/assets/icons/sync.svg'

interface ILeagueImportInfoTableRecord {
  name: string
  message: string
  type: 'Error' | 'Duplicate'
  idx: number
}

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<ILeagueImportInfoTableRecord>['field']
  sortOrder?: SorterResult<ILeagueImportInfoTableRecord>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TDataIndex = keyof ILeagueImportInfoTableRecord

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE}>League & Tourn</a>,
  },
  {
    title: (
      <Typography.Text
        style={{
          color: 'rgba(26, 22, 87, 0.85)',
        }}
      >
        Import info
      </Typography.Text>
    ),
  },
]

const duplicateTagStyles = { border: '1px solid #FFD770', backgroundColor: '#FFF9EB' }
const errorTagStyles = { border: '1px solid #FF594D', backgroundColor: '#FFF1F0' }

const TagType: FC<{ text: 'Error' | 'Duplicate' }> = ({ text }) => {
  const style = text === 'Duplicate' ? duplicateTagStyles : errorTagStyles

  return (
    <Space
      style={{
        ...style,
        padding: '0 8px',
        borderRadius: '2px',
        fontSize: '12px',
      }}
    >
      <Typography.Text
        style={{
          color: text === 'Duplicate' ? 'rgba(243, 178, 9, 1)' : '#BC261B',
        }}
      >
        {text}
      </Typography.Text>
    </Space>
  )
}

const ImportInfo = () => {
  const { tableRecords, duplicates, removeDuplicate } = useLeagueSlice()
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: tableRecords.length,
    },
  })
  const [updateRecord] = useUpdateLeagueMutation()
  const { setAppNotification } = useAppSlice()
  const searchInput = useRef<InputRef>(null)
  const [sortOrder, setSortOrder] = useState<'descend' | 'ascend' | null>(null)

  const handleUpdate = (idx: number) => {
    const currentDuplicate = duplicates.find((duplicate) => duplicate.index === idx)
    const newData = currentDuplicate!.new
    const normalizedNewRecord: Omit<IFELeague<TFullLeagueTournament>, 'createdAt' | 'updatedAt'> = {
      ...newData,
      type: newData.type === 0 ? 'League' : 'Tournament',
      playoffFormat: newData.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
      standingsFormat: newData.standings_format === 0 ? 'Winning %' : 'Points',
      tiebreakersFormat: newData.tiebreakers_format === 0 ? 'Winning %' : 'Points',
      welcomeNote: newData.welcome_note,
      playoffsTeams: newData.playoffs_teams,
      seasons: newData.league_seasons,
      description: newData.description,
    }

    const backendBodyFormat: IBECreateLeagueBody = {
      description: normalizedNewRecord.description,
      name: normalizedNewRecord.name,
      playoff_format: normalizedNewRecord.playoffFormat === 'Best Record Wins' ? 0 : 1,
      playoffs_teams: normalizedNewRecord.playoffsTeams,
      standings_format: normalizedNewRecord.standingsFormat !== 'Points' ? 0 : 1,
      tiebreakers_format: normalizedNewRecord.tiebreakersFormat !== 'Points' ? 0 : 1,
      type: normalizedNewRecord.type === 'League' ? 0 : 1,
      welcome_note: normalizedNewRecord.welcomeNote,
    }

    updateRecord({ id: normalizedNewRecord.id, body: backendBodyFormat })
      .unwrap()
      .then(() => {
        setAppNotification({
          message: 'Successfully update',
          type: 'success',
          timestamp: new Date().getTime(),
        })
        setSelectedIdx(null)
        removeDuplicate(idx)
      })
      .catch(() => setSelectedIdx(null))
  }

  const handleReset = (clearFilters: () => void) => clearFilters()
  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<ILeagueImportInfoTableRecord> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Search name"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            style={{
              marginRight: '8px',
              flex: '1 1 auto',
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            style={{
              flex: '1 1 auto',
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1A1657' : '#BDBCC2' }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const columns: TColumns<ILeagueImportInfoTableRecord> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortOrder,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
            cursor: 'pointer',
          }}
          onClick={() => {
            record.type === 'Duplicate' && setSelectedIdx(record.idx)
          }}
        >
          {value}
        </Typography.Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        { text: 'Duplicate', value: 'Duplicate' },
        { text: 'Error', value: 'Error' },
      ],
      width: '112px',
      onFilter: (value, record) => value === record.type,
      render: (value) => <TagType text={value} />,
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: filtered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)',
          }}
        />
      ),
    },
    {
      title: 'Error message',
      dataIndex: 'message',
      width: '400px',
      render: (value) => (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {value}
        </Typography.Text>
      ),
    },
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) =>
        record.type === 'Duplicate' && <ReactSVG src={SyncIcon} onClick={() => handleUpdate(record.idx)} />,
    },
  ]

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    setSortOrder(Array.isArray(sorter) ? null : sorter.order || null)
  }

  return (
    <>
      {selectedIdx !== null && <ReviewUpdateModal idx={selectedIdx} onClose={() => setSelectedIdx(null)} />}

      <BaseLayout>
        <Flex className={classes.container} vertical>
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          <Typography.Title level={1} className={classes.title}>
            Import info
          </Typography.Title>

          <Typography.Text className={classes.description}>
            This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
            duplicate to review details, compare and decide whether to keep existing records or replace them with new
            entries. This helps ensure your data is accurate and up-to-date.
          </Typography.Text>

          <Table
            columns={columns}
            rowKey={(record) => record.name}
            dataSource={tableRecords}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Flex>
      </BaseLayout>
    </>
  )
}

export default ImportInfo
