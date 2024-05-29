import { useEffect, useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hook'
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
import { Button, Card, Pagination, Select, Spinner, Tag } from '@/components/ui'
import {
    EntryData,
    fetchEntriesData,
} from '@/store/slices/entries/entriesSlice'
import { PaginationSelectOption } from '@/views/@types/shared'
import { Link } from 'react-router-dom'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'

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
        <div className="flex justify-between my-4">
            <div className="flex items-center  mb-1">
                <span className="mr-2 hidden md:block">Search:</span>
                <Input
                    {...props}
                    // size="sm"
                    // value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            <div>

            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<EntryData> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    // console.log(value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const InvoiceDisplay = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const dispatch = useAppDispatch()
    const { data, error, loading } = useAppSelector((state) => state.entries)

    // sorted in descrnding to display most recent on top
    // const sortedData = useMemo(() => {
    //     if (data) {
    //         return [...data].sort(
    //             (a, b) =>
    //                 new Date(b.entryDate).getTime() -
    //                 new Date(a.entryDate).getTime()
    //         )
    //     }
    //     return []
    // }, [data])

    useEffect(() => {
        dispatch(fetchEntriesData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    //   For Pagination
    const totalData = data?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<EntryData>[]>(
        () => [
            { header: 'Invoice Id(Name)', accessorKey: 'invoice.name' },
            { header: 'QB ID', accessorKey: 'invoice.qbId' },
            { header: 'QB invoice No.', accessorKey: 'invoice.invoiceNumber' },
            // {
            //     header: 'Vin(s)',
            //     accessorKey: 'invoice.carDetails',
            //     // filterable: true,

            //     cell: ({ row }: { row: Row<EntryData> }) => {
            //         const vins = row.original.invoice.carDetails
            //             .map((carDetail) => carDetail.vin)
            //             .filter(Boolean); // Remove any undefined or null VINs

            //         return (
            //             <span>
            //                 {vins.length > 0 ? (
            //                     <ul>
            //                         {vins.map((vin) => (
            //                             <li key={vin}>{vin}</li>
            //                         ))}
            //                     </ul>
            //                 ) : (
            //                     ''
            //                 )}
            //             </span>
            //         );
            //     },
            // },
            { header: 'Customer Name', accessorKey: 'customerName' },
            { header: 'Total Price', accessorKey: 'invoice.totalPrice' },
            {
                header: 'Status',
                accessorKey: 'invoice.sent',
                // Set the cell renderer for the "Progress" column
                cell: ({ row }: { row: Row<EntryData> }) => {
                    return (
                        <span>
                            {row.original.invoice.sent ? (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-green-500">
                                        Sent
                                    </Tag>
                                </span>
                            ) : (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-yellow-500">
                                        In Progress
                                    </Tag>
                                </span>
                            )}
                        </span>
                    )
                },
            },
            {
                header: 'Date / Time',
                accessorKey: 'entryDate',
                // Set the cell renderer for the "Progress" column
                cell: ({ row }: { row: Row<EntryData> }) => {
                    return (
                        <span>
                            <span>{formatDateToMMMDDYYYY(row.original.entryDate).split('T')[0]} </span>
                        </span>
                    )
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
            // exact: exactFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        // globalFilterFn: exactFilter,
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

    // For Pagination
    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }


    if (loading) {
        return (
            <Card className="flex justify-center items-center min-h-[25rem]">
                <Spinner size="40px" />
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="flex justify-center flex-col items-center min-h-[25rem]">
                <p className="text-center">Error Loading Invoice Page</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchEntriesData())}
                    >
                        Refresh Page
                    </Button>
                </div>
            </Card>
        )
    }
    if (data.length === 0) {
        return (
            <Card className="flex justify-center items-center min-h-[25rem]">
                <p>No Invoice Available</p>
            </Card>
        )
    }

    return (
        <div className="border border-gray-300 rounded-lg p-3">
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
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
                                                <Link
                                                    to={`/invoice/${row.original._id}`}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </Link>
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

export default InvoiceDisplay
