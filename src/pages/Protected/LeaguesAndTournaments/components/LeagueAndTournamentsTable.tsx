import { SearchOutlined } from '@ant-design/icons'
import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import { Button, Flex, Input, Table, Tooltip, Typography } from 'antd'
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import TagType from '@/pages/Protected/LeaguesAndTournaments/components/TagType'

import MonroeModal from '@/components/MonroeModal'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useDeleteLeagueMutation, useGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import { PATH_TO_EDIT_LEAGUE_TOURNAMENT, PATH_TO_LEAGUE_TOURNAMENT_PAGE } from '@/constants/paths'

import { IFELeague } from '@/common/interfaces/league'

import '../styles.css'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFELeague>['field']
  sortOrder?: SorterResult<IFELeague>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TDataIndex = keyof IFELeague

interface ILeagueAndTournamentsTableProps {
  setSelectedRecordsIds: Dispatch<SetStateAction<string[]>>
  selectedRecordIds: string[]
  showAdditionalHeader: boolean
  setShowAdditionalHeader: Dispatch<SetStateAction<boolean>>
  isDeleteAllRecords: boolean
  setIsDeleteAllRecords: Dispatch<SetStateAction<boolean>>
}

const LeagueAndTournamentsTable: FC<ILeagueAndTournamentsTableProps> = ({
  setSelectedRecordsIds,
  selectedRecordIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  setIsDeleteAllRecords,
  isDeleteAllRecords,
}) => {
  const { setPaginationParams, limit, offset, total, leagues } = useLeagueSlice()
  const { isLoading, data } = useGetLeaguesQuery({ limit, offset: limit * offset }, { refetchOnMountOrArgChange: true })
  const searchInput = useRef<InputRef>(null)
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: offset + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: data?.count,
    },
  })
  const [showDeleteSingleRecordModal, setShowDeleteSingleRecordModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState('')
  const [deleteRecord] = useDeleteLeagueMutation()
  const navigate = useNavigate()

  const handleReset = (clearFilters: () => void) => clearFilters()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFELeague> => ({
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

  const handleDelete = () =>
    deleteRecord({
      id: selectedRecordId,
    })
      .unwrap()
      .then(() => {
        setShowDeleteSingleRecordModal(false)
        setSelectedRecordId('')
      })
      .catch(() => setShowDeleteSingleRecordModal(false))

  const columns: TColumns<IFELeague> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      sorter: true,
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.name.startsWith(value as string),
      fixed: 'left',
      width: '20vw',
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
          }}
          onClick={() => navigate(PATH_TO_LEAGUE_TOURNAMENT_PAGE + '/' + record.id)}
        >
          {value}
        </Typography.Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        { text: 'All', value: 'all' },
        { text: 'League', value: 'league' },
        { text: 'Tourn', value: 'tourn' },
      ],
      width: '112px',
      render: (value) => <TagType text={value} />,
    },
    {
      title: 'Default Playoff Format',
      dataIndex: 'playoffFormat',
      width: '220px',
      filters: [
        { text: 'All', value: 'all' },
        { text: 'Best Record Wins', value: 'best-record-wins' },
        { text: 'Single Elimination Bracket', value: 'single-elimination-bracket' },
      ],
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
      title: 'Default Standings Format',
      dataIndex: 'standingsFormat',
      width: '225px',
      filters: [
        { text: 'All', value: 'all' },
        { text: 'Points', value: 'points' },
        { text: 'Winning %', value: 'winning' },
      ],
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
      title: 'Default Tiebreakers Format',
      dataIndex: 'tiebreakersFormat',
      width: '235px',
      filters: [
        { text: 'All', value: 'all' },
        { text: 'Points', value: 'points' },
        { text: 'Winning %', value: 'winning' },
      ],
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
      title: 'Description',
      dataIndex: 'description',
      width: '250px',
      render: (value) => (
        <>
          {value?.length > 25 ? (
            <Tooltip
              title={value}
              placement="top"
              color="rgba(62, 62, 72, 0.75)"
              style={{
                width: '250px',
              }}
            >
              <Typography.Text
                style={{
                  color: 'rgba(26, 22, 87, 0.85)',
                }}
              >
                {value.substring(0, 22).trim() + '...'}
              </Typography.Text>
            </Tooltip>
          ) : (
            <Typography.Text
              style={{
                color: 'rgba(26, 22, 87, 0.85)',
              }}
            >
              {value}
            </Typography.Text>
          )}
        </>
      ),
    },
    {
      title: 'Welcome note',
      dataIndex: 'welcomeNote',
      width: '250px',
      render: (value) => (
        <>
          {value?.length > 25 ? (
            <Tooltip
              title={value}
              placement="top"
              color="rgba(62, 62, 72, 0.75)"
              style={{
                width: '250px',
              }}
            >
              <Typography.Text
                style={{
                  color: 'rgba(26, 22, 87, 0.85)',
                }}
              >
                {value.substring(0, 22).trim() + '...'}
              </Typography.Text>
            </Tooltip>
          ) : (
            <Typography.Text
              style={{
                color: 'rgba(26, 22, 87, 0.85)',
              }}
            >
              {value}
            </Typography.Text>
          )}
        </>
      ),
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value) => {
        return (
          <Flex vertical={false} justify="center" align="center">
            <ReactSVG
              src={EditIcon}
              onClick={() => {
                navigate(PATH_TO_EDIT_LEAGUE_TOURNAMENT + `/${value.id}`)
              }}
            />

            <ReactSVG
              onClick={() => {
                setSelectedRecordId(value.id)
                setShowDeleteSingleRecordModal(true)
              }}
              src={DeleteIcon}
              style={{ marginLeft: '8px' }}
            />
          </Flex>
        )
      },
    },
  ]

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    setPaginationParams({
      offset: (pagination?.current && pagination?.current - 1) || 0,
      limit: pagination?.pageSize || 10,
    })
  }

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  useEffect(() => {
    if (data?.count) {
      setTableParams((params) => ({
        pagination: {
          ...params.pagination,
          total: data.count,
        },
      }))
    }
  }, [data])

  return (
    <>
      {showDeleteSingleRecordModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteSingleRecordModal(false)}
          onOk={handleDelete}
          title="Delete league/tournament?"
          type="warn"
          content={
            <>
              <p>Are you sure you want to delete this league/tournament?</p>
            </>
          }
        />
      )}

      {showAdditionalHeader && (
        <div className="leagues-table-header">
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.85)',
              marginRight: '10px',
            }}
          >
            {isDeleteAllRecords ? `All ${total} events are selected` : `All ${limit} events on this page are selected.`}
          </p>

          {!isDeleteAllRecords && (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => setIsDeleteAllRecords(true)}
            >
              Select all {total - limit} events in Leagues and Tournaments instead.
            </p>
          )}
        </div>
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={leagues}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRecordIds,
          onChange: (selected) => {
            if (selected.length === limit) setShowAdditionalHeader(true)

            if (selected.length !== limit) {
              setIsDeleteAllRecords(false)
              setShowAdditionalHeader(false)
            }

            setSelectedRecordsIds(selected as string[])
          },
        }}
        scroll={{
          x: 1000,
        }}
      />
    </>
  )
}

export default LeagueAndTournamentsTable
