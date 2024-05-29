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
} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { Button, Card, Dialog, Pagination, Select, Spinner, Tooltip } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'


import CreateIncentive from './CreateIncentive'
import { EligibleStaff, IncentiveData, fetchIncentiveData } from '@/store/slices/incentive/incentiveSlice'
import { formatDateToMonthDayYear } from '@/utils/DateFormater'
import { RiCalendarEventFill } from 'react-icons/ri'
import Incentives from './Incentives'




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
    const [filteredData, setFilteredData] = useState<IncentiveData[]>([]);
    const { data } = useAppSelector((state) => state.incentive)

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

    useEffect(() => {
        const currentDate = new Date();

        if (data && data.length > 0) {
            const filtered = data.filter((item) => {
                const startTime = new Date(item.startTime);
                const endTime = new Date(item.endTime);

                return startTime <= currentDate && endTime >= currentDate;
            });

            setFilteredData(filtered);
        } else {
            setFilteredData([])
        }
    }, [data]);
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-10  lg:grid-cols-9 gap-6 lg:gap-20">
                <div className="flex items-center col-span-1 md:col-span-3 lg:col-span-3">
                    <Input
                        {...props}
                        // value={value}
                        // prefix={<RiSearch2Line className="text-sm" />}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div className='hidden md:flex justify-center items-center border-green-500 border-b-4 col-span-4 lg:col-span-4'>
                    <div className='flex justify-between w-full'>
                        <div className='flex'>
                            <div className='flex justify-center items-center '>
                                {filteredData[0] ? (
                                    <span className='h-4 w-4 rounded-full bg-green-500'></span>
                                ) : (
                                    <span className='h-4 w-4 rounded-full bg-gray-500'></span>
                                )}
                            </div>
                            <span className='flex justify-center items-center ml-4'>
                                {filteredData[0] ? filteredData.map((item) => (
                                    <span key={item.id}>
                                        {item.numberOfVehiclesThreshold} car(s) | <span className=' text-green-500'>+${item.amountToBePaid}</span>
                                    </span>
                                )) : (
                                    <span>
                                        0 car | <span className=' text-gray-500'>+ $0</span>
                                    </span>
                                )
                                }
                            </span>
                        </div>
                        <div className='text-lg flex justify-center items-center'>
                            <Tooltip
                                title={
                                    <div className="text-xs">
                                        {filteredData[0] ? filteredData.map((item) => (
                                            <span key={item.id}>
                                                {formatDateToMonthDayYear(item.startTime)} ~ {formatDateToMonthDayYear(item.endTime)}
                                            </span>
                                        )) : ("No Running Incentive")
                                        }
                                    </div>
                                }
                                placement="bottom-end"
                            >
                                <span className="cursor-pointer text-2xl"><RiCalendarEventFill /></span>
                            </Tooltip>

                        </div>
                    </div>
                </div >
                <div className='flex justify-end col-span-1 md:col-span-3 lg:col-span-2'>
                    <Button variant="solid" onClick={() => openDialog()} >
                        Add New
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
                        <h5 className="mb-4">Create an Incentive Programme</h5>
                        <CreateIncentive setIsOpen={setIsOpen} />
                    </Dialog>
                </div>
            </div >
            <div className=' flex md:hidden justify-center items-center border-green-500 border-b-4 mt-4'>
                <div className='flex justify-between w-full'>
                    <div className='flex'>
                        <div className='flex justify-center items-center'>
                            {filteredData[0] ? (
                                <span className='h-4 w-4 rounded-full bg-green-500'></span>
                            ) : (
                                <span className='h-4 w-4 rounded-full bg-gray-500'></span>
                            )}
                        </div>
                        <span className='flex justify-center items-center ml-4'>
                            {filteredData[0] ? filteredData.map((item) => (
                                <span key={item.id}>
                                    {item.numberOfVehiclesThreshold} car(s) | <span className=' text-green-500'>+${item.amountToBePaid}</span>
                                </span>
                            )) : (
                                <span>
                                    0 car | <span className=' text-gray-500'>+ $0</span>
                                </span>
                            )
                            }
                        </span>
                    </div>
                    <div className='text-lg flex justify-center items-center '>
                        <Tooltip
                            title={
                                <div className="text-xs">
                                    {filteredData[0] ? filteredData.map((item) => (
                                        <span key={item.id}>
                                            {formatDateToMonthDayYear(item.startTime)} ~ {formatDateToMonthDayYear(item.endTime)}
                                        </span>
                                    )) : ("No Running Incentive")
                                    }
                                </div>
                            }
                            placement="bottom-end"
                        >
                            <span className="cursor-pointer text-2xl"><RiCalendarEventFill /></span>
                        </Tooltip>

                    </div>
                </div>
            </div>
        </>


    )
}


const fuzzyFilter: FilterFn<EligibleStaff> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank,
    })

    return itemRank.passed
}
const IncentiveCampaign = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [filteredData, setFilteredData] = useState<IncentiveData[]>([]);
    const [eligible, setEligibleData] = useState<EligibleStaff[]>([]);

    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.incentive)


    useEffect(() => {
        dispatch(fetchIncentiveData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const currentDate = new Date();

        if (data && data.length > 0) {
            const filtered = data.filter((item) => {
                const startTime = new Date(item.startTime);
                const endTime = new Date(item.endTime);

                return startTime <= currentDate && endTime >= currentDate;
            });

            setFilteredData(filtered);
            setEligibleData(filtered[0]?.eligibleStaffs);
        } else {
            setFilteredData([])
        }
        // const filtered = data.filter((item) => {
        //     const startTime = new Date(item.startTime);
        //     const endTime = new Date(item.endTime);

        //     return startTime <= currentDate && endTime >= currentDate;
        // });

        // setFilteredData(filtered);
        // setEligibleData(filtered[0]?.eligibleStaffs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);


    const totalData = eligible?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<EligibleStaff>[]>(
        () => [
            { header: 'First Name', accessorKey: 'firstName' },
            { header: 'Last Name', accessorKey: 'lastName' },
            { header: 'Email', accessorKey: 'email' },
        ],
        []
    )

    const table = useReactTable({
        data: eligible,
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
                <p>Error occured Loading Incentive Data</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchIncentiveData())}
                    >
                        Refresh Data
                    </Button>
                </div>
            </Card>
        )
    }

    if (filteredData.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg p-3">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search Staff..."
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <p className=' text-center py-6'>No running Incentive</p>
                <div>
                    <Incentives />
                </div>
            </div>
        );
    }

    if (filteredData[0] && filteredData[0]?.eligibleStaffs.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg p-3">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search Staff..."
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <p className=' text-center py-6'>No Employee has qualified for this Incentive.</p>
                <div>
                    <Incentives />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="border border-gray-300 rounded-lg p-3">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search Staff..."
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
                <div className='pt-6'>
                    <Incentives />
                </div>
            </div>

        </>
    )
}

export default IncentiveCampaign