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
// import type { ColumnDef, FilterFn, ColumnFiltersState, Row } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import {
    Button,
    Card,
    Dialog,
    Pagination,
    Select,
    Spinner,
} from '@/components/ui'
import {
    Service,
    fetchServiceData,
} from '@/store/slices/companyservices/companyServicesSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { FaEdit } from 'react-icons/fa'
import { BsTrash3Fill } from 'react-icons/bs'
// import { PriceListData, fetchPricelistData } from '@/store/slices/price-list/priceListSlice'
import { PaginationSelectOption } from '@/views/@types/shared'

import DeleteService from '../DeleteService'
import AddWindShieldInstall from './AddWindShieldInstall'
import EditWindshieldInstall from './EditWindshieldInstall'
// import { fetchFilmQualityData } from '@/store/slices/film-quality/filmSlice'

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
                    // size="sm"
                    // value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            <div>
                <Button variant="solid" onClick={() => openDialog()}>
                    Add Services
                </Button>
                <Dialog
                    isOpen={dialogIsOpen}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                    width={700}
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}

                >
                    <h5 className="mb-4">Create Windshield Installation Service</h5>
                    <AddWindShieldInstall setIsOpen={setIsOpen} />
                </Dialog>
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<Service> = (row, columnId, value, addMeta) => {
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

const WindshieldInstall = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [windshield, setWindshield] = useState<Service[]>([])
    const [updateData, setUpdateData] = useState<{
        id: string
        name: string
        customerTime: number
        timeOfCompletion: number
        filmQualityOrVehicleCategoryAmount: [
            {
                filmQualityId: string
                amount: number
            },
            {
                filmQualityId: string
                amount: number
            },
        ]
    }>()
    const [oneDelete, setOneDelete] = useState<{
        id: string
        name: string
        type: string
    }>()

    const dispatch = useAppDispatch()
    const { data, error, loading } = useAppSelector((state) => state.services)

    useEffect(() => {
        try {
            dispatch(fetchServiceData())
        } catch (error) {
            console.log(error as TypeError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        try {
            if (data) {
                const filteredService = data.filter(service =>
                    service.type === "installation" && service.isFull === false && service.isWindshield === true
                    // service.type === "installation" && service.isWindshield === true
                );

                setWindshield(filteredService);
            }
        } catch (error) {
            console.log(error as TypeError);

        }
    }, [data])

    //   For Pagination
    const totalData = windshield?.length

    const formatTime = (number: number): string => {
        if (number === 1) {
            return '1hour';
        } else if (number === 1.5) {
            return '1hours 30mins';
        } else if (number === 2) {
            return '2hours';
        } else if (number === 2.5) {
            return '2hours 30mins';
        } else if (number === 3) {
            return '3hours';
        } else if (number === 3.5) {
            return '3hours 30mins';
        } else if (number === 4) {
            return '4hours';
        } else {
            return '';
        }
    };

    const pageSizeOption = [
        { value: 5, label: '5 / page' },
        { value: 10, label: '10 / page' },
        { value: 15, label: '15 / page' },
        { value: 20, label: '20 / page' },
        { value: 25, label: '25 / page' },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<Service>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'Llumar Air 80', accessorKey: `filmQualityOrVehicleCategoryAmount.0.amount` },
            { header: 'Xpel XR Plus', accessorKey: `filmQualityOrVehicleCategoryAmount.1.amount` },
            {
                header: 'Time',
                accessorKey: 'timeOfCompletion',
                cell: ({ row }: { row: Row<Service> }) => {
                    return (
                        <span>
                            {row.original.timeOfCompletion && formatTime(row.original.timeOfCompletion)}
                        </span>
                    )
                },
            },
            {
                header: 'Customer Time',
                accessorKey: 'customerTime',
                cell: ({ row }: { row: Row<Service> }) => {
                    return (
                        <span>
                            {row.original.customerTime && formatTime(row.original.customerTime)}
                        </span>
                    )
                },
            },
        ],
        []
    )

    const table = useReactTable({
        data: windshield,
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

    // For Pagination
    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    // Define a new column for the edit button
    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }
    const openUpdateDialog = () => {
        setUpdateDialogIsOpen(true)
    }
    const onUpdateDialogClose = () => {
        setUpdateDialogIsOpen(false)
    }
    const openDeleteDialog = () => {
        setDeleteDialogIsOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogIsOpen(false)
    }

    const actionButtonsColumn = {
        header: 'Edit/Delete',
        cell: ({ row }: { row: Row<Service> }) => {
            return (
                <span className="flex">
                    <Button
                        icon={<FaEdit />}
                        className=""
                        size="xs"
                        onClick={() => {
                            setUpdateData({
                                id: row.original._id,
                                name: row.original.name,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                customerTime: row.original.customerTime!,
                                timeOfCompletion: row.original.timeOfCompletion,
                                filmQualityOrVehicleCategoryAmount: [
                                    {
                                        filmQualityId: row.original.filmQualityOrVehicleCategoryAmount[0]?.filmQualityId.id,
                                        amount: row.original.filmQualityOrVehicleCategoryAmount[0]?.amount
                                    },
                                    {
                                        filmQualityId: row.original.filmQualityOrVehicleCategoryAmount[1]?.filmQualityId.id,
                                        amount: row.original.filmQualityOrVehicleCategoryAmount[1]?.amount
                                    },
                                ]
                            })
                            openUpdateDialog()
                        }}
                    />

                    <Button
                        icon={<BsTrash3Fill />}
                        className="hover:bg-red-400 hover:text-white ml-1 text-red-600"
                        size="xs"
                        onClick={() => {
                            setOneDelete({
                                id: row.original._id,
                                name: row.original.name,
                                type: row.original.type,
                            })
                            openDeleteDialog()
                        }}
                    />
                </span>
            )
        },
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
                <p>Error Loading Services Data</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchServiceData())}
                    >
                        Refresh Data
                    </Button>
                </div>
            </Card>
        )
    }
    if (windshield.length === 0) {
        return (
            <Card className="flex justify-center flex-col items-center min-h-[25rem]">
                <p className="text-center">No Windshield Installation Services have been added</p>
                <div className="text-center mt-4">
                    <Button variant="solid" onClick={() => openDialog()}>
                        Add Services
                    </Button>
                    <Dialog
                        isOpen={dialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onDialogClose}
                        onRequestClose={onDialogClose}
                    >
                        <h5 className="mb-4">Create Windshield Installation Service</h5>
                        <AddWindShieldInstall setIsOpen={setIsOpen} />
                    </Dialog>
                </div>
            </Card>
        )
    }
    return (
        <div className="border border-gray-300 rounded-lg p-3">
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
                                <Th>{actionButtonsColumn.header}</Th>
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
                                                {/* // <Td key={cell.id} onClick={handleRowClick}>  */}
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}

                                    {/* Render the edit button cell for each row */}

                                    <Td>
                                        {flexRender(actionButtonsColumn.cell, {
                                            row,
                                        })}
                                    </Td>
                                </Tr>
                            )
                        })}
                    </TBody>
                    <Dialog
                        isOpen={updateDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onUpdateDialogClose}
                        onRequestClose={onUpdateDialogClose}
                    >
                        <h5 className="mb-4">Windshield Installation Service Details</h5>
                        <EditWindshieldInstall
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={updateData!}
                            setIsOpen={setUpdateDialogIsOpen}
                        />
                    </Dialog>
                    <Dialog
                        isOpen={deleteDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onDeleteDialogClose}
                        onRequestClose={onDeleteDialogClose}
                    >
                        <h5 className="mb-4">Windshield Installation Service</h5>
                        <DeleteService
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={oneDelete!}
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

export default WindshieldInstall