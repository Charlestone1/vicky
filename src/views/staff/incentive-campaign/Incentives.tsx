import { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
// import Input from '@/components/ui/Input'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
// import type { InputHTMLAttributes } from 'react'
import { useAppSelector } from '@/store'
import { Pagination, Select, Tag } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'

import { IncentiveData, } from '@/store/slices/incentive/incentiveSlice'
import { formatDateToMonthDDYYYY } from '@/utils/DateFormater'
import moment from 'moment'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const fuzzyFilter: FilterFn<IncentiveData> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank,
    })
    return itemRank.passed
}

// const isActiveIncentive = (startTime: string, endTime: string): boolean => {
//     const currentDate = moment();
//     const formattedStartTime = moment(startTime).startOf('day');
//     const formattedEndTime = moment(endTime).startOf('day');

//     return currentDate.isAfter(formattedStartTime) && currentDate.isBefore(formattedEndTime);
// };

// const isActiveIncentive = (startTime: string, endTime: string): boolean => {
//     const currentDate = moment();
//     const formattedStartTime = moment(startTime).startOf('day');
//     const formattedEndTime = moment(endTime).startOf('day');

//     // Check if the current date is within the incentive's start and end dates
//     return (
//         currentDate.isSameOrAfter(formattedStartTime) &&
//         currentDate.isSameOrBefore(formattedEndTime)
//     );
// };

const isActiveIncentive = (startTime: string, endTime: string): boolean => {
    const currentDate = moment();
    const formattedStartTime = moment(startTime).startOf('day');
    const formattedEndTime = moment(endTime).startOf('day');

    return (
        currentDate.isSameOrAfter(formattedStartTime) &&
        currentDate.isSameOrBefore(formattedEndTime)
    );
};


const Incentives = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    // const [filteredData, setFilteredData] = useState<IncentiveData[]>([]);

    const { data } = useAppSelector((state) => state.incentive)

    const totalData = data?.length

    const pageSizeOption = [
        { value: 5, label: '5 / page' },
        { value: 10, label: '10 / page' },
        { value: 15, label: '15 / page' },
        { value: 20, label: '20 / page' },
        { value: 25, label: '25 / page' },
    ]

    const columns = useMemo<ColumnDef<IncentiveData>[]>(
        () => [
            {
                header: 'Start Date',
                accessorKey: 'startTime',
                cell: ({ row }) => {
                    const startDater = formatDateToMonthDDYYYY(row.original.startTime)
                    return <span>{startDater}</span>;
                },
            },
            {
                header: 'End Date',
                accessorKey: 'endTime',
                cell: ({ row }) => {
                    const endDater = formatDateToMonthDDYYYY(row.original.endTime)
                    return <span>{endDater}</span>;
                },
            },
            { header: 'No. of Vehicle', accessorKey: 'numberOfVehiclesThreshold' },
            { header: 'Amount', accessorKey: 'amountToBePaid' },
            {
                header: 'Eligible Staff',
                accessorKey: 'Qualified',
                cell: ({ row }) => {
                    const eligible = row.original.eligibleStaffs.length
                    return <span>{eligible}</span>;
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const { startTime, endTime } = row.original;
                    const isActive = isActiveIncentive(startTime, endTime);

                    const currentDate = moment();
                    const formattedStartTime = moment(startTime).startOf('day');

                    // Check for future start time
                    const isFuture = currentDate.isBefore(formattedStartTime);

                    return (
                        <span>
                            {isActive ? (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-green-500">
                                        Active
                                    </Tag>
                                </span>
                            ) : isFuture ? (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-yellow-500">
                                        Pending
                                    </Tag>
                                </span>
                            ) : (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-red-500">
                                        Expired
                                    </Tag>
                                </span>
                            )}
                        </span>
                    );
                },
            },
        ],
        []
    )

    const table = useReactTable({
        data,
        // data: filteredData,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }
    return (
        <div className="border border-gray-300 rounded-lg p-3">
            <h4 className='py-2 text-gray-600'>All Incentives</h4>

            <div>
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className:
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                        onClick:
                                                            header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {
                                                        <Sorter
                                                            sort={header.column.getIsSorted()}
                                                        />
                                                    }
                                                </div>
                                            )}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </TBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                    <Pagination
                        pageSize={table.getState().pagination.pageSize}
                        currentPage={table.getState().pagination.pageIndex + 1}
                        total={totalData}
                        onChange={onPaginationChange}
                    />
                    <div style={{ minWidth: 130 }}>
                        <Select<PaginationSelectOption>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOption.filter(
                                (option) =>
                                    option.value ===
                                    table.getState().pagination.pageSize
                            )}
                            options={pageSizeOption}
                            onChange={(option) => onSelectChange(option?.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Incentives