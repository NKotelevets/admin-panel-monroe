// import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
// import Table from 'antd/es/table'
// import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'

// import { useState } from 'react'
import BaseLayout from '@/layouts/BaseLayout'

import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import classes from './import-info.module.css'

// type TColumns<T> = TableProps<T>['columns']
// type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

// interface ITableParams {
//   pagination?: TTablePaginationConfig
//   sortField?: SorterResult<IFELeague>['field']
//   sortOrder?: SorterResult<IFELeague>['order']
//   filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
// }

// type TDataIndex = keyof IFELeague

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

const ImportInfo = () => {
  // const [tableParams, setTableParams] = useState<ITableParams>({
  //   pagination: {
  //     current: 1,
  //     pageSize: limit,
  //     pageSizeOptions: [5, 10, 30, 50],
  //     showQuickJumper: true,
  //     showSizeChanger: true,
  //     total: 22,
  //   },
  // })

  // const columns: TColumns<IFELeague> = [
  //   {
  //     title: 'League/Tourn name',
  //     dataIndex: 'name',
  //     sorter: true,
  //     filterSearch: true,
  //     filterMode: 'tree',
  //     onFilter: (value, record) => record.name.startsWith(value as string),
  //     fixed: 'left',
  //     width: '20vw',
  //     ...getColumnSearchProps('name'),
  //     render: (value, record) => (
  //       <Typography.Text
  //         style={{
  //           color: '#3E34CA',
  //         }}
  //         onClick={() => navigate(PATH_TO_LEAGUE_TOURNAMENT_PAGE + '/' + record.id)}
  //       >
  //         {value}
  //       </Typography.Text>
  //     ),
  //   },
  //   {
  //     title: 'Type',
  //     dataIndex: 'type',
  //     filters: [
  //       { text: 'All', value: 'all' },
  //       { text: 'League', value: 'league' },
  //       { text: 'Tourn', value: 'tourn' },
  //     ],
  //     width: '112px',
  //     render: (value) => <TagType text={value} />,
  //   },
  //   {
  //     title: 'Default Playoff Format',
  //     dataIndex: 'playoffFormat',
  //     width: '220px',
  //     filters: [
  //       { text: 'All', value: 'all' },
  //       { text: 'Best Record Wins', value: 'best-record-wins' },
  //       { text: 'Single Elimination Bracket', value: 'single-elimination-bracket' },
  //     ],
  //     render: (value) => (
  //       <Typography.Text
  //         style={{
  //           color: 'rgba(26, 22, 87, 0.85)',
  //         }}
  //       >
  //         {value}
  //       </Typography.Text>
  //     ),
  //   },
  //   {
  //     title: 'Default Standings Format',
  //     dataIndex: 'standingsFormat',
  //     width: '225px',
  //     filters: [
  //       { text: 'All', value: 'all' },
  //       { text: 'Points', value: 'points' },
  //       { text: 'Winning %', value: 'winning' },
  //     ],
  //     render: (value) => (
  //       <Typography.Text
  //         style={{
  //           color: 'rgba(26, 22, 87, 0.85)',
  //         }}
  //       >
  //         {value}
  //       </Typography.Text>
  //     ),
  //   },
  // ]

  return (
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

        {/* <Table
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={leagues}
          pagination={tableParams.pagination}
          loading={isLoading || isFetching}
          onChange={handleTableChange}
        /> */}
      </Flex>
    </BaseLayout>
  )
}

export default ImportInfo

