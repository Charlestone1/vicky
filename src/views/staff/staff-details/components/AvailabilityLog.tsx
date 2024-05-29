import { useEffect, useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import Table from '@/components/ui/Table'
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
import { Button, Card, Dialog, Pagination, Select, Spinner } from '@/components/ui'
// import {
//     UserData,
//     fetchEntriesData,
// } from '@/store/slices/entries/entriesSlice'
import { PaginationSelectOption } from '@/views/@types/shared'
import { useParams } from 'react-router-dom'
import { formatDateToMonthDDYYYY, formatTimeHmma } from '@/utils/DateFormater'
import { FaPowerOff } from 'react-icons/fa'
import { User } from '@/store/slices/users/userSlice'
import Checkin from './Checkin'
import CheckOut from './Checkout'

import YearComp from './range/YearComp'
import { CheckHistory, CheckInOutState, fetchCheckinData } from '@/store/slices/check-report/checkreportSlice'
import { ActionMeta, SingleValue } from 'react-select'
import MonthlyCheckinForm from './range/MonthlyCheckinForm'
import WeeklyCheckinForm from './range/WeeklyCheckinForm'
import DailyCheckinForm from './range/DailyCheckinForm'
import AllTimeCheckin from './range/AllTimeCheckin'
// import { fetchStaffJobsData } from '@/store/slices/staff-jobs/staffJobsSlice'

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
    // ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)
    const { data: userzz } = useAppSelector((state) => state.user)

    const [oneUser, setOneUser] = useState<User[]>([])
    const [check, setCheck] = useState<{
        checkInType: string,
        staffId: string | undefined,

    }>()
    const [checkInDialogIsOpen, setCheckInDialogIsOpen] = useState(false)
    const [checkOutDialogIsOpen, setCheckOutDialogIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string>("all");

    // const dispatch = useAppDispatch()
    const { staffId } = useParams()

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {

        if (userzz) {
            const filteredUser = userzz.filter(staff =>
                staff._id === staffId
            );
            setOneUser(filteredUser);
        }
    }, [staffId, userzz])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    type Option = {
        value: string
        label: string
    }

    const intervalOptions: Option[] = [
        { value: 'all', label: 'All' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'daily', label: 'Daily' },
    ]

    const openCheckInDialog = () => {
        setCheckInDialogIsOpen(true)
    }

    const onCheckInDialogClose = () => {
        setCheckInDialogIsOpen(false)
    }
    const openCheckOutDialog = () => {
        setCheckOutDialogIsOpen(true)
    }

    const onCheckOutDialogClose = () => {
        setCheckOutDialogIsOpen(false)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleOptionChange = (newValue: SingleValue<Option>, actionMeta?: ActionMeta<Option>) => {
        if (newValue) {
            setSelectedOption(newValue.value);
        }
    };

    return (
        <div>
            <div className="flex justify-between my-2 relative">
                {/* <div className="flex items-center">
                </div> */}
                <div className='flex flex-col mb-7 lg:flex-row'>
                    <Select
                        className=' w-32'
                        size='sm'
                        placeholder="Please Select"
                        options={intervalOptions}
                        value={intervalOptions.find(option => option.value === selectedOption)}
                        onChange={handleOptionChange}
                    />
                    <div className='lg:ml-6 mt-4 lg:mt-0 '>
                        {selectedOption === 'all' && <AllTimeCheckin />}
                        {selectedOption === 'yearly' && <YearComp />}
                        {selectedOption === 'monthly' && <MonthlyCheckinForm />}
                        {selectedOption === 'weekly' && <WeeklyCheckinForm />}
                        {selectedOption === 'daily' && <DailyCheckinForm />}
                    </div>
                </div>
                <div className='absolute right-0 lg:right-5'>

                    {oneUser && oneUser[0]?.staffDetails?.checkInDetails?.isCheckedIn === true ? <>
                        <Button
                            disabled={!oneUser[0]?.staffDetails?.isLoggedIn}
                            icon={<FaPowerOff fill='red' />}
                            variant="plain"
                            size='sm'
                            onClick={() => {
                                setCheck({
                                    checkInType: "checkOut",
                                    staffId: staffId
                                })
                                openCheckOutDialog()
                            }}
                        >
                            Check-out
                        </Button>
                    </> : <>
                        <Button
                            disabled={!oneUser[0]?.staffDetails?.isLoggedIn}
                            icon={<FaPowerOff fill='green' />}
                            variant="plain"
                            size='sm'
                            onClick={() => {
                                setCheck({
                                    checkInType: "checkIn",
                                    staffId: staffId,
                                })
                                openCheckInDialog()
                            }}
                        >
                            Check-In
                        </Button>
                    </>}
                </div>
            </div>

            <div>

            </div>

            <Dialog
                isOpen={checkInDialogIsOpen}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                width={700}
                onClose={onCheckInDialogClose}
                onRequestClose={onCheckInDialogClose}
            >
                <h5 className="mb-4">Check In Staff</h5>
                <Checkin
                    disableSubmit
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    data={check!}
                    setIsOpen={setCheckInDialogIsOpen}
                />
            </Dialog>
            <Dialog
                isOpen={checkOutDialogIsOpen}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                width={700}
                onClose={onCheckOutDialogClose}
                onRequestClose={onCheckOutDialogClose}
            >
                <h5 className="mb-4">Check Out Staff</h5>
                <CheckOut
                    disableSubmit
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    data={check!}
                    setIsOpen={setCheckOutDialogIsOpen}
                />
            </Dialog>
        </div >
    )
}

const fuzzyFilter: FilterFn<CheckHistory> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
}

const AvailabilityLog = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [checkData, setCheckData] = useState<CheckHistory[]>([])

    const dispatch = useAppDispatch()

    const { data, error, loading } = useAppSelector((state: { checkinout: CheckInOutState }) => state.checkinout)
    const { staffId } = useParams<{ staffId: string }>()

    useEffect(() => {
        dispatch(fetchCheckinData({ staffId }))
        // dispatch(fetchStaffJobsData(staffId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffId])

    useEffect(() => {
        try {
            if (data && data.checkInHistory) {
                // const filteredUser = data.checkInHistory
                setCheckData(data.checkInHistory);
            }
        } catch (error) {
            console.log(error as TypeError);
        }
    }, [data])

    const sortedData = useMemo(() => {
        if (checkData) {
            return [...checkData].sort(
                (a, b) =>
                    new Date(b.checkInDetails.timestamp).getTime() -
                    new Date(a.checkInDetails.timestamp).getTime()
            )
        }
        return []
    }, [checkData])

    const myTotal = data.checkInHistory ? data.checkInHistory.length : 50
    const myEmpty = data.checkInHistory ? data.checkInHistory.length : 0

    //   For Pagination
    const totalData = myTotal
    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<CheckHistory>[]>(
        () => [

            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ row }: { row: Row<CheckHistory> }) => {
                    return (
                        <div>
                            <p>
                                {
                                    row.original.checkInDetails &&
                                    formatDateToMonthDDYYYY(row.original.checkInDetails.timestamp)
                                }
                            </p>
                        </div>
                    )
                },
            },
            {
                header: 'Check-In Time',
                accessorKey: 'checkin',
                cell: ({ row }: { row: Row<CheckHistory> }) => {
                    return (
                        <div>
                            <p>
                                {
                                    row.original.checkInDetails &&
                                    formatTimeHmma(row.original.checkInDetails.timestamp)
                                }
                            </p>
                        </div>
                    )
                },
            },
            {
                header: 'Check-Out Time',
                accessorKey: 'checkout',
                cell: ({ row }: { row: Row<CheckHistory> }) => {
                    return (
                        <div>
                            <p>
                                {
                                    row.original.checkOutDetails &&
                                    formatTimeHmma(row.original.checkOutDetails.timestamp)
                                }
                            </p>
                        </div>
                    )
                },
            },

        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const table = useReactTable({
        data: sortedData,
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

    // For Pagination
    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }


    if (loading) {
        return (
            <div className="p-3 min-h-[25rem] w-full">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search columns..."
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <Card className="flex justify-center items-center min-h-[25rem]">
                    <Spinner size="40px" />
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="border border-gray-300 rounded-lg p-3 min-h-[25rem] w-full mt-5">

                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <p className="text-center">Error Loading Checkin Reports</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchCheckinData({ staffId }))}
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        )
    }
    if (myEmpty === 0) {
        return (
            <div className='border border-gray-300 rounded-lg p-3 mt-5'>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <Card className="flex justify-center items-center min-h-[25rem]">
                    <p>Staff Did not Checkin within selected period</p>
                </Card>
            </div>
        )
    }


    return (
        <div className="border-b border-gray-300 rounded-lg p-3 mt-5">
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

export default AvailabilityLog