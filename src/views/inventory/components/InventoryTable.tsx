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
import { Button, Card, Dialog, Pagination, Progress, Select, Spinner } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'
import { useAppDispatch, useAppSelector } from '@/store'
import { MdOutlineVisibility } from 'react-icons/md'
import { BsTrash3Fill } from 'react-icons/bs'
import { fetchOnPremisesData, CustomerData } from '@/store/slices/on-premise/onPremiseSlice'
import { FaUserAltSlash, FaUserPlus } from "react-icons/fa";


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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<CustomerData> = (row, columnId, value, addMeta) => {
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

const InventoryTable = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [onPremisePortalViewDialogIsOpen, SetOnPremisePortalViewDialogIsOpen] = useState(false)

    const [onpremPortal, setOnpremPortal] = useState<{
        customerName: string
        email: string
        vin: string
        services: string[]
        porter: string | null
        technician: string
    }>()


    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.onpremises)

    useEffect(() => {
        dispatch(fetchOnPremisesData())
        // dispatch(fetchOnPremiseData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openViewPortalDialog = () => {
        SetOnPremisePortalViewDialogIsOpen(true)
    }
    const onViewPortalDialogClose = () => {
        SetOnPremisePortalViewDialogIsOpen(false)
    }

    const totalData = data?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<CustomerData>[]>(
        () => [

            { header: 'Customer', accessorKey: 'customerName' },
            {
                header: 'Year, Make, Model',
                accessorKey: 'invoice.carDetails',
                cell: ({ row }: { row: Row<CustomerData> }) => {
                    const year = row.original.invoice.carDetails.year
                    const make = row.original.invoice.carDetails.make
                    const model = row.original.invoice.carDetails.model
                    return (
                        <span>
                            {`${year}, ${make}, ${model} `}
                        </span>
                    )
                },
            },
            {
                header: 'Services',
                accessorKey: 'invoice.carDetails.serviceNames',
                cell: ({ row }: { row: Row<CustomerData> }) => {
                    const serviceNames = row.original.invoice.carDetails.serviceNames
                    return (
                        <span>

                            {serviceNames && serviceNames.length > 1 ? (
                                <ul>
                                    {serviceNames.map((service, index) => (
                                        <li key={index}>{service},</li>
                                    ))}
                                </ul>
                            ) : (
                                serviceNames?.length === 1 && (
                                    <span>{serviceNames[0]}</span>
                                )
                            )
                            }
                        </span >
                    )
                },
            },

            {
                header: 'Progress',
                accessorKey: 'invoice.carDetails.perCentageOfServicesDone',
                cell: ({ row }: { row: Row<CustomerData> }) => {
                    const carDetails = row.original.invoice.carDetails;
                    const percentage = carDetails.perCentageOfServicesDone
                    // const carDetailWithPercentage = row.original.invoice.carDetails.find(carDetail => carDetail.perCentageOfServicesDone !== undefined);
                    // const percentage: number = carDetailWithPercentage ? carDetailWithPercentage.perCentageOfServicesDone : 0;
                    const fraction = row.original.invoice.carDetails.servicesDoneFraction
                    return (
                        <span className='flex justify-between items-center'>
                            <div className='w-24 gap-x-4'>
                                <Progress className="mx-0" color='orange-500' showInfo={false} percent={percentage} />
                            </div>
                            <span className='ml-4'>{`${fraction}`}</span>
                        </span>
                    )
                },
            },
            {
                header: 'Actions',
                accessorKey: 'actions',
                cell: ({ row }: { row: Row<CustomerData> }) => {
                    const car = row.original.invoice.carDetails
                    return (
                        <span className='flex justify-between items-center'>
                            <Button
                                icon={<MdOutlineVisibility />}
                                size="sm"
                                variant='plain'
                                onClick={() => {
                                    const carDetails = row.original.invoice.carDetails;
                                    const services = carDetails.serviceNames || [];
                                    setOnpremPortal({
                                        customerName: row.original.customerName,
                                        email: row.original.customerEmail,
                                        vin: row.original.invoice.carDetails.vin || "",
                                        services: services,
                                        porter: row.original.invoice.carDetails.porterName || "",
                                        technician: carDetails.assignmentDetails?.assignee || "Not Assigned",
                                    })
                                    openViewPortalDialog()
                                }}
                            />

                        </span>
                    )
                },
            },

        ],
        []
    )


    const table = useReactTable({
        data: data,
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
            <Card className="flex justify-center flex-col items-center min-h-[25rem]">
                <p>Error occured Loading Inventories Data</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchOnPremisesData())}
                    >
                        Refresh Data
                    </Button>
                </div>
            </Card>
        )
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center flex-col my-4">
                <p>No Vechicle On-Premise.</p>
            </div>
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
                                                {flexRender(
                                                    cell.column.columnDef
                                                        .cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </TBody>
                    {/* <Dialog
                        isOpen={onPremisePortalViewDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={500}
                        onClose={onViewPortalDialogClose}
                        onRequestClose={onViewPortalDialogClose}
                    >
                        <h5 className="mb-4">On-Premise</h5>
                        <ViewOnPremisePortal
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={onpremPortal!}
                        />
                    </Dialog> */}

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

export default InventoryTable