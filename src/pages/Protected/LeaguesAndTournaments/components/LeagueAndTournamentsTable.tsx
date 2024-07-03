import { SearchOutlined } from '@ant-design/icons'
import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import { Button, Flex, Input, Table, Tooltip, Typography } from 'antd'
import type { FilterDropdownProps, FilterValue, SorterResult } from 'antd/es/table/interface'
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
  showCreatedRecords: boolean
}

const showTotal = (total: number) => (
  <Typography.Text
    style={{
      color: 'rgba(26, 22, 87) !important',
    }}
  >
    Total {total} items
  </Typography.Text>
)

const LeagueAndTournamentsTable: FC<ILeagueAndTournamentsTableProps> = ({
  setSelectedRecordsIds,
  selectedRecordIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  setIsDeleteAllRecords,
  isDeleteAllRecords,
  showCreatedRecords,
}) => {
  const {
    setPaginationParams,
    limit,
    offset,
    total,
    leagues,
    league_name,
    playoff_format,
    standings_format,
    tiebreakers_format,
    type,
    order_by,
  } = useLeagueSlice()
  const { isLoading, isFetching, data } = useGetLeaguesQuery(
    {
      limit,
      offset: limit * offset,
      league_name: league_name ? league_name : undefined,
      playoff_format: playoff_format ? playoff_format : undefined,
      standings_format: standings_format ? standings_format : undefined,
      tiebreakers_format: tiebreakers_format ? tiebreakers_format : undefined,
      type: type ? type : undefined,
      order_by,
    },
    { refetchOnMountOrArgChange: true },
  )
  const searchInput = useRef<InputRef>(null)
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: offset + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: data?.count,
      showTotal,
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
      sortOrder: order_by === 'asc' ? 'ascend' : 'descend',
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
            cursor: 'pointer',
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
        { text: 'All', value: '' },
        { text: 'League', value: 0 },
        { text: 'Tourn', value: 1 },
      ],
      width: '112px',
      render: (value) => <TagType text={value} />,
    },
    {
      title: 'Default Playoff Format',
      dataIndex: 'playoffFormat',
      width: '220px',
      filters: [
        { text: 'All', value: '' },
        { text: 'Best Record Wins', value: 0 },
        { text: 'Single Elimination Bracket', value: 1 },
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
        { text: 'All', value: '' },
        { text: 'Points', value: 0 },
        { text: 'Winning %', value: 1 },
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
        { text: 'All', value: '' },
        { text: 'Points', value: 0 },
        { text: 'Winning %', value: 1 },
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

  type TFilterValueKey = 'name' | 'playoffFormat' | 'standingsFormat' | 'tiebreakersFormat' | 'type'

  type TFilters = Record<TFilterValueKey, FilterValue | null>

  const handleTableChange: TableProps['onChange'] = (pagination, filters: TFilters, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
        showTotal,
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    setPaginationParams({
      offset: (pagination?.current && pagination?.current - 1) || 0,
      limit: pagination?.pageSize || 10,
      league_name: (filters?.['name']?.[0] as string) || '',
      playoff_format: (filters?.['playoffFormat']?.[0] as string) || '',
      standings_format: (filters?.['standingsFormat']?.[0] as string) || '',
      tiebreakers_format: (filters?.['tiebreakersFormat']?.[0] as string) || '',
      type: (filters?.['type']?.[0] as string) || '',
      order_by: !Array.isArray(sorter) && sorter.order === 'descend' ? 'desc' : 'asc',
    })
  }

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  useEffect(() => {
    if (data?.count) {
      setTableParams((params) => ({
        pagination: {
          ...params.pagination,
          total: data.count,
          showTotal,
        },
      }))
    }

    if (isDeleteAllRecords && data?.leagues.length) {
      const recordIds = data?.leagues.map((league) => league.id)
      setSelectedRecordsIds((prev) => [...prev, ...recordIds])
    }
  }, [data])

  const MOCKED_CREATED_LEAGUES_NAMES = ['For spring', 'Toyota 99', '12dsewqdewde']

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
            {isDeleteAllRecords
              ? `All ${total} records are selected.`
              : `All ${limit} records on this page are selected.`}
          </p>

          {!isDeleteAllRecords ? (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => setIsDeleteAllRecords(true)}
            >
              Select all {total} records in Leagues and Tournaments instead.
            </p>
          ) : (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => {
                setIsDeleteAllRecords(false)
                setSelectedRecordsIds([])
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all records
            </p>
          )}
        </div>
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={leagues}
        pagination={tableParams.pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        rowClassName={(record) =>
          showCreatedRecords && MOCKED_CREATED_LEAGUES_NAMES.includes(record.name) ? 'highlighted-row' : ''
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRecordIds,
          onChange: (selected) => {
            if (selected.length === limit) setShowAdditionalHeader(true)

            if (!isDeleteAllRecords) setSelectedRecordsIds(selected as string[])
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
