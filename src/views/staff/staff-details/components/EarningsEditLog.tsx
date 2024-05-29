import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
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
    Row,
} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'

import { Pagination, Select, Spinner } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'

import { useParams } from 'react-router-dom'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'

import { useAppDispatch, useAppSelector } from '@/store'
import { UserLogData, fetchStaffLogData } from '@/store/slices/staff-logs/staffLogSlice'

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table


function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="flex justify-between gap-x-2 my-4">
            <div className="flex items-center  mb-1">
                <span className="mr-2 hidden md:block">Search:</span>
                <Input
                    {...props}
                    // value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<UserLogData> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    // console.log(value);

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const EarningsEditLog = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { staffId } = useParams<{ staffId: string }>()


    const [serviceorpriceLog, setServiceorpriceLog] = useState<UserLogData[]>([])


    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.stafflog)

    useEffect(() => {
        if (staffId) {
            dispatch(fetchStaffLogData(staffId))
        }
    }, [staffId])

    useEffect(() => {
        try {
            if (data) {
                const filteredActivity = data.filter(entry =>
                    entry.document.description === "Service Change" || entry.document.description === "Earning history updated"
                );
                setServiceorpriceLog(filteredActivity);
            }
        } catch (error) {
            console.log(error as TypeError);
        }

    }, [data])

    const totalData = serviceorpriceLog?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<UserLogData>[]>(
        () => [
            // { header: 'First Name', accessorKey: 'user.firstName' },
            // { header: 'Last Name', accessorKey: 'user.lastName' },
            {
                header: 'Updated By',
                accessorKey: 'user.firstName',
                cell: ({ row }: { row: Row<UserLogData> }) => {
                    return (
                        <span className="mr-2 rtl:ml-2">
                            <span>{`${row.original.user.firstName} ${row.original.user.lastName}`}</span>
                        </span>
                    )
                },
            },
            { header: 'VIN', accessorKey: 'document.carDetail.vin' },
            { header: 'Description', accessorKey: 'document.description' },
            {
                header: 'Action',
                accessorKey: 'document.oldServiceDetails',
                cell: ({ row }: { row: Row<UserLogData> }) => {
                    if (row.original.document.description === "Service changed") {
                        return (
                            <span>
                                Service Change {/* {row.original.document.oldServiceDetails.name} ~ {row.original.document.newServiceDetails.name} */}
                            </span>
                        )
                    } else if (row.original.document.description === "Earning history updated") {
                        return (
                            <span>
                                ${row.original.document.oldAmount} ~ ${row.original.document.newAmount}
                            </span>
                        )
                    } else if (row.original.document.description === "Vehicle deleted") {
                        return (
                            <span>
                                ${row.original.document.oldAmount} ~ ${row.original.document.newAmount}
                            </span>
                        )
                    } else
                        return (
                            <span>
                                others
                            </span>
                        )
                },
            },
            {
                header: 'Timestamp',
                accessorKey: 'timestamp',
                cell: ({ row }: { row: Row<UserLogData> }) => {
                    return (
                        <span className="mr-2 rtl:ml-2">
                            <span>{formatDateToMMMDDYYYY(row.original.timestamp).split('T')[0]} </span>
                        </span>
                    )
                },
            },
            // {
            //     header: 'Desc',
            //     accessorKey: 'description',
            //     cell: ({ row }: { row: Row<UserLogData> }) => {
            //         return (
            //             <span className="mr-2 rtl:ml-2">
            //                 <span>{row.original.document.earningDetails?.description}</span>
            //             </span>
            //         )
            //     },
            // },
            // {
            //     header: 'Service',
            //     accessorKey: 'services',
            //     cell: ({ row }: { row: Row<UserLogData> }) => {
            //         return (
            //             <span className="mr-2 rtl:ml-2">
            //                 <span>{row.original.document.earningDetails?.serviceName}</span>
            //             </span>
            //         )
            //     },
            // },
        ],
        []
    )


    const table = useReactTable({
        data: serviceorpriceLog,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[20rem] border border-gray-200 mt-4 rounded-md">
                <Spinner size="40px" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-6">
                <p>Error occured Loading Staff Earnings Log.</p>
            </div>
        )
    }

    if (serviceorpriceLog.length === 0) {
        return (
            <div className="border-b border-gray-300 flex items-center justify-center flex-col my-4">
                <p className='mb-8'>Staff Earnings has not been modified.</p>
            </div>
        )
    }

    return (
        <div className="border-b border-gray-300 rounded-lg p-3">
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search columns..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
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
                                <Tr
                                    key={row.id}
                                // onClick={() => handleServiceClick(row.original._id)}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {/* <Link
                                                    to={`/invoice/${row.original._id}`}
                                                > */}
                                                {flexRender(
                                                    cell.column.columnDef
                                                        .cell,
                                                    cell.getContext()
                                                )}
                                                {/* </Link> */}
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

export default EarningsEditLog