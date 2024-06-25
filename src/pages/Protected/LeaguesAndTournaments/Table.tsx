import { SearchOutlined } from '@ant-design/icons'
import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import { Button, Input, Space, Table, Tooltip, Typography } from 'antd'
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { FC, useRef, useState } from 'react'

import { useGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import { IFELeague } from '@/common/interfaces/league'

import './styles.css'

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface TableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFELeague>['field']
  sortOrder?: SorterResult<IFELeague>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TDataIndex = keyof IFELeague

const tournTagStyles = { border: '1px solid #A49EFF', backgroundColor: '#F1F0FF' }
const leagueTagStyles = { border: '1px solid #FF594D', backgroundColor: '#FFF1F0' }

const TypeTag: FC<{ text: string }> = ({ text }) => {
  const style = text === 'Tourn' ? tournTagStyles : leagueTagStyles

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
          color: text === 'Tourn' ? '#4C41E6' : '#BC261B',
        }}
      >
        {text}
      </Typography.Text>
    </Space>
  )
}

const MonroeTable = () => {
  const { isLoading, data } = useGetLeaguesQuery()
  const searchInput = useRef<InputRef>(null)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const handleReset = (clearFilters: () => void) => clearFilters()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFELeague> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            size="small"
            style={{ width: '50%' }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: '50%' }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
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

  const columns: TColumns<IFELeague> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      sorter: true,
      width: '20vw',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.name.startsWith(value as string),
      fixed: 'left',
      ...getColumnSearchProps('name'),
      render: (value) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
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
        { text: 'All', value: 'all' },
        { text: 'League', value: 'league' },
        { text: 'Tourn', value: 'tourn' },
      ],
      width: '116px',
      render: (value) => <TypeTag text={value} />,
    },
    {
      title: 'Default Playoff Format',
      dataIndex: 'playoffFormat',
      width: '20vw',
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
      width: '20vw',
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
      width: '20vw',
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
      width: '20vw',
      ellipsis: true,
      render: (value) => (
        <Tooltip title={value} placement="top" color="rgba(62, 62, 72, 0.75)">
          <Typography.Text
            style={{
              color: 'rgba(26, 22, 87, 0.85)',
            }}
          >
            {value}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: 'Welcome note',
      dataIndex: 'welcomeNote',
      width: '20vw',
      ellipsis: true,
      render: (value) => (
        <Tooltip title={value} color="rgba(62, 62, 72, 0.75)">
          <Typography.Text
            style={{
              color: 'rgba(26, 22, 87, 0.85)',
            }}
          >
            {value}
          </Typography.Text>
        </Tooltip>
      ),
    },
  ]

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    // `dataSource` is useless since `pageSize` changed
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setData([])
    // }
  }

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm']) => {
    confirm()
  }

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={isLoading}
      onChange={handleTableChange}
      // scroll={{ x: 1500, y: 1000 }}
      rowSelection={{
        type: 'checkbox',
      }}
    />
  )
}

export default MonroeTable
