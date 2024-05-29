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
import { Button, Card, Pagination, Select, Spinner, Tag, Dialog } from '@/components/ui'
import {
    EntryData,
    fetchEntriesData,
} from '@/store/slices/entries/entriesSlice'
import { PaginationSelectOption } from '@/views/@types/shared'
import { Link } from 'react-router-dom'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'
import { BsTrash3Fill } from 'react-icons/bs'
import AddEntry from './components/AddEntry'
import DeleteEntry from './components/DeleteEntry'

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
    const [dialogIsOpen, setIsOpen] = useState(false)

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

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

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
            <div>
                <Button variant="solid" onClick={() => openDialog()}>
                    + Add New
                </Button>
                <Dialog
                    isOpen={dialogIsOpen}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                    // bodyOpenClassName="overflow-hidden"
                    width={700}
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                >
                    <h5 className=" mb-4">Create Entry</h5>

                    <p className="mb-3">
                        When entering multiple VIN, separate each with special
                        characters(hyphens, underscores, &)
                    </p>
                    <AddEntry setIsOpen={setIsOpen} />
                </Dialog>
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

const Entries = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [deleteEntry, setDeleteEntry] = useState<{
        entryId: string,
        customerName: string
    }>()
    const dispatch = useAppDispatch()
    const { data, error, loading } = useAppSelector((state) => state.entries)

    useEffect(() => {
        dispatch(fetchEntriesData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openDeleteDialog = () => {
        setDeleteDialogIsOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogIsOpen(false)
    }

    // delete features
    const actionColumn = {
        header: 'Action',
        // Use a custom cell renderer for the edit button column
        cell: ({ row }: { row: Row<EntryData> }) => {
            return (
                <Button
                    icon={<BsTrash3Fill />}
                    size="xs"
                    onClick={() => {
                        const entry = row.original
                        setDeleteEntry({
                            entryId: entry.id,
                            customerName: entry.customerName
                        })
                        openDeleteDialog()
                    }} />
            )
        },
    }
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
            { header: 'Customer Name', accessorKey: 'customerName' },
            { header: 'Email', accessorKey: 'customerEmail' },
            { header: 'Entry Number', accessorKey: 'invoice.name' },
            { header: 'Num. of vehicles', accessorKey: 'numberOfCarsAdded' },
            {
                header: 'Status',
                accessorKey: 'invoice.sent',
                // Set the cell renderer for the "Progress" column
                cell: ({ row }: { row: Row<EntryData> }) => {
                    const areAllServicesDoneArray =
                        row.original.invoice.carDetails?.map(
                            (item) => item.areAllServicesDone
                        )
                    return (
                        <Td className="w-[200px]">
                            {!areAllServicesDoneArray ||
                                areAllServicesDoneArray.length === 0 ? (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-gray-600">
                                        No vehicle
                                    </Tag>
                                </span>
                            ) : areAllServicesDoneArray.every(
                                (value) => value === true
                            ) ? (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-green-500">
                                        Tinted
                                    </Tag>
                                </span>
                            ) : areAllServicesDoneArray.some(
                                (value) => value === true
                            ) ? (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-yellow-500">
                                        In Progress
                                    </Tag>
                                </span>

                            ) : (
                                <span className="mr-2 rtl:ml-2">
                                    <Tag prefix prefixClass="bg-red-500">
                                        Not Tinted
                                    </Tag>
                                </span>
                            )}
                        </Td>
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
            // {
            //     header: 'Action',
            //     accessorKey: 'action',
            //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
            //     cell: ({ row }: { row: Row<EntryData> }) => {
            //         return (
            //             <Button
            //                 icon={<BsTrash3Fill />}
            //                 size="xs"
            //                 onClick={() => {
            //                     const entry = row.original
            //                     setDeleteEntry({
            //                         entryId: entry.id,
            //                         customerName: entry.customerName
            //                     })
            //                     openDeleteDialog()
            //                 }} />
            //         )
            //     },
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const table = useReactTable({
        data,
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

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
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
                <p className="text-center">Error Loading Entry Page</p>
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
            <div className="flex items-center justify-center flex-col my-4">
                <p>No Entry has been made.</p>
                <div>
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => openDialog()}
                    >
                        Create Entry
                    </Button>
                    <Dialog
                        isOpen={dialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        bodyOpenClassName="overflow-hidden"
                        width={700}
                        onClose={onDialogClose}
                        onRequestClose={onDialogClose}
                    >
                        <h5 className="mb-4 text-red-600">Create Entry</h5>
                        <AddEntry setIsOpen={setIsOpen} />
                    </Dialog>
                </div>
            </div>
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
                                <Th>{actionColumn.header}</Th>
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                <Link
                                                    to={`/jobs/entries/${row.original._id}`}
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
                                    <Td>
                                        {flexRender(actionColumn.cell, {
                                            row,
                                        })}
                                    </Td>
                                </Tr>
                            )
                        })}
                    </TBody>
                    <Dialog
                        isOpen={deleteDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onDeleteDialogClose}
                        onRequestClose={onDeleteDialogClose}
                    >
                        <h5 className="mb-4">Delete Vehicle</h5>
                        <DeleteEntry
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={deleteEntry!}
                            setIsOpen={setDeleteDialogIsOpen}
                        />
                    </Dialog>
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

export default Entries