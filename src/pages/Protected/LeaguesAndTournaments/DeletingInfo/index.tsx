import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Breadcrumb, Button, Flex, Space, Table, Tooltip } from 'antd'
import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import Input from 'antd/es/input/Input'
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BaseLayout from '@/layouts/BaseLayout'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'

import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE, PATH_TO_LEAGUE_TOURNAMENT_PAGE } from '@/constants/paths'

import { IDeletionItemError } from '@/common/interfaces/api'

import classes from './deleting-info.module.css'

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
        Deleting info
      </Typography.Text>
    ),
  },
]

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

type TDataIndex = keyof IDeletionItemError

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IDeletionItemError>['field']
  sortOrder?: SorterResult<IDeletionItemError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const errorTagStyles = {
  border: '1px solid #FF594D',
  backgroundColor: '#FFF1F0',
  padding: '0 8px',
  borderRadius: '2px',
  fontSize: '12px',
}

const DeletingInfo = () => {
  const { deletedRecordsErrors } = useLeagueSlice()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
    },
  })
  const searchInput = useRef<InputRef>(null)
  const navigate = useNavigate()

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IDeletionItemError> => ({
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

  const columns: TColumns<IDeletionItemError> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.name.includes(value as string),
      fixed: 'left',
      width: '20vw',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: tableParams.sortOrder,
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
      title: 'Status',
      dataIndex: '',
      width: '60px',
      render: () => (
        <Space style={errorTagStyles}>
          <Typography.Text
            style={{
              color: '#BC261B',
            }}
          >
            Error
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      width: '300px',
      render: (value) => (
        <>
          {value?.length > 80 ? (
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
                {value.substring(0, 77).trim() + '...'}
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
  ]

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })
  }

  return (
    <BaseLayout>
      <Flex className={classes.container} vertical>
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        <Typography.Title level={1} className={classes.title}>
          Deleting info
        </Typography.Title>

        <Typography.Text className={classes.description}>
          This panel provides a summary of deleted leagues/tournaments, listing the rows with errors. Click on the error
          to view the details and correct the error that is preventing deletion.
        </Typography.Text>

        <Table
          columns={columns}
          rowKey={(record) => record.name}
          dataSource={deletedRecordsErrors}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Flex>
    </BaseLayout>
  )
}

export default DeletingInfo

