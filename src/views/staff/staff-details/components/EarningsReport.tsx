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
import { Button, Card, Dialog, Input, Pagination, Select, Spinner } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'
import { useParams } from 'react-router-dom'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'
import { User } from '@/store/slices/users/userSlice'
import { ActionMeta, SingleValue } from 'react-select'
import AllTimeEarningsRep from './earningsrange/AllTimeEarningsRep'
import YearEarningsRepForm from './earningsrange/YearEarningsRepForm'
import MonthlyEarningsRepForm from './earningsrange/MonthlyEarningsRepForm'
import WeeklyEarningsRepForm from './earningsrange/WeeklyEarningsRepForm'
import DailyEarningsRepForm from './earningsrange/DailyEarningsRepForm'
import { EarningHistoryItem, apiEarningsRepCurrent } from '@/store/slices/earnings-report/earningsReportSlice'
import TFoot from '@/components/ui/Table/TFoot'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FaEdit } from 'react-icons/fa'
import UpdateEarningHistoryPrice from './UpdateEarningHistoryPrice'
import CurrentEarnings from './earningsrange/CurrentEarnings'


interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    showInput?: boolean
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    showInput = false,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)
    const { data: userzz } = useAppSelector((state) => state.user)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [oneUser, setOneUser] = useState<User[]>([])
    const [selectedOption, setSelectedOption] = useState<string>("current");
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
        { value: 'current', label: 'Current' },
    ]

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleOptionChange = (newValue: SingleValue<Option>, actionMeta?: ActionMeta<Option>) => {
        if (newValue) {
            setSelectedOption(newValue.value);
        }
    };

    return (
        <div className='mx-[-12px]'>
            {
                showInput && (

                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <Input
                                {...props}
                                size="sm"
                                // value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>

                    </div>
                )
            }

            <div>

            </div>
            <div className='flex flex-col mb-7 mlg:flex-row'>
                <Select
                    className=' w-32'
                    size='sm'
                    placeholder="Please Select"
                    options={intervalOptions}
                    value={intervalOptions.find(option => option.value === selectedOption)}
                    onChange={handleOptionChange}
                />
                <div className='mlg:ml-6 mt-4 mlg:mt-0'>

                    {selectedOption === 'all' && <AllTimeEarningsRep />}
                    {selectedOption === 'yearly' && <YearEarningsRepForm />}
                    {selectedOption === 'monthly' && <MonthlyEarningsRepForm />}
                    {selectedOption === 'weekly' && <WeeklyEarningsRepForm />}
                    {selectedOption === 'daily' && <DailyEarningsRepForm />}
                    {selectedOption === 'current' && <CurrentEarnings />}
                </div>
            </div>

        </div >
    )
}

const fuzzyFilter: FilterFn<EarningHistoryItem> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
}

const EarningsReport = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [earningsData, setEarningsData] = useState<EarningHistoryItem[]>([])
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [seeInput, setSeeInput] = useState(false)
    // const [dialogIsOpen, setIsOpen] = useState(false)

    const dispatch = useAppDispatch()

    const { data, error, loading } = useAppSelector((state) => state.earningsrep)
    const { staffId } = useParams<{ staffId: string }>()
    const { user } = useSelector((state: RootState) => state.auth)
    const [updateData, setUpdateData] = useState<{
        staffId: string | undefined
        earningHistoryId: string
        vin: string | undefined
        serviceName: string | undefined
        earningPrice: number
        year: number | undefined
        make: string | undefined
        model: string | undefined
    }>()

    useEffect(() => {
        dispatch(apiEarningsRepCurrent({ staffId }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffId])

    useEffect(() => {
        try {
            if (data && data[0]?.earningHistory) {
                // const filteredUser = data.checkInHistory
                setEarningsData(data[0]?.earningHistory);
            }
            const dataLength = data && data?.length;
            const inputLength = data[0]?.earningHistory && data[0]?.earningHistory.length;

            if (dataLength >= 1 || inputLength >= 1) {
                setSeeInput(true)
            } else if (dataLength < 1 || inputLength < 1) {
                setSeeInput(false)
            }
        } catch (error) {
            console.log(error as TypeError);
        }
    }, [data])

    const sortedData = useMemo(() => {
        if (earningsData) {
            return [...earningsData].sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
            )
        }
        return []
    }, [earningsData])

    // const openDialog = () => {
    //     setIsOpen(true)
    // }

    // const onDialogClose = () => {
    //     setIsOpen(false)
    // }
    const openUpdateDialog = () => {
        setUpdateDialogIsOpen(true)
    }

    const onUpdateDialogClose = () => {
        setUpdateDialogIsOpen(false)
    }

    //   For Pagination
    const totalData = data[0]?.earningHistory.length
    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<EarningHistoryItem>[]>(
        () => [
            { header: 'Customer', accessorKey: 'jobHistory.customerName' },
            { header: 'Service Name', accessorKey: 'serviceName' },
            // { header: 'Amount Earned($)', accessorKey: 'amountEarned' },
            { header: 'Description', accessorKey: 'description' },
            {
                header: 'Timestamp',
                accessorKey: 'timestamp',
                cell: ({ row }: { row: Row<EarningHistoryItem> }) => {
                    return (
                        <div>
                            <p>
                                {
                                    formatDateToMMMDDYYYY(row.original.timestamp)
                                }
                            </p>
                        </div>
                    )
                },
            },
            {
                header: 'Amount Earned($)',
                accessorKey: 'amountEarned',
                cell: ({ row }: { row: Row<EarningHistoryItem> }) => {
                    return (
                        <div>
                            <span>{row.original.amountEarned}</span>
                            {
                                row.original.canBeEdited &&
                                user.role && (user.role.includes("admin") || user.role.includes("gm") || user.role.includes("manager")) &&
                                <span className='ml-2'>
                                    <Button
                                        icon={<FaEdit />}
                                        className=""
                                        size="xs"
                                        onClick={() => {
                                            setUpdateData({
                                                staffId: staffId,
                                                earningHistoryId: row.original._id,
                                                vin: row.original.jobHistory?.invoice.carDetails.vin,
                                                serviceName: row.original.serviceName,
                                                earningPrice: row.original.amountEarned,
                                                year: row.original.jobHistory?.invoice.carDetails.year,
                                                make: row.original.jobHistory?.invoice.carDetails.make,
                                                model: row.original.jobHistory?.invoice.carDetails.model,
                                            })
                                            openUpdateDialog()
                                        }} />
                                </span>
                            }

                        </div>
                    )
                },
            },
            { header: 'Vin', accessorKey: 'jobHistory.invoice.carDetails.vin' },
            { header: 'Service Type', accessorKey: 'serviceType' },
            {
                header: 'Year, Make, Model',
                accessorKey: 'invoice',
                cell: ({ row }: { row: Row<EarningHistoryItem> }) => {
                    return (
                        <div>
                            <p>
                                {row.original.jobHistory?.invoice ?
                                    `${row.original.jobHistory?.invoice.carDetails.year}, ${row.original.jobHistory?.invoice.carDetails.make}, ${row.original.jobHistory?.invoice.carDetails.model}` :
                                    ""}
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
            <div className=" p-3 min-h-[25rem] w-full mt-5">

                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                    showInput={seeInput}
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <p className="text-center">Error Loading Earnings Reports</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(apiEarningsRepCurrent({ staffId }))}
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        )
    }
    if (data.length === 0 || earningsData.length === 0) {
        return (
            <div className='p-3 mt-3'>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                    showInput={seeInput}
                    onChange={(value) => setGlobalFilter(String(value))}
                />
                <Card className="flex justify-center items-center min-h-[5rem]">
                    <p>Staff Did not earn within this period</p>
                </Card>
            </div>
        )
    }


    return (
        <div className="border-b border-gray-300 p-3 mt-3">
            {/* <div className="border border-gray-300 rounded-lg p-3 mt-5"> */}
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search..."
                showInput={seeInput}
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
                    <TFoot>
                        <Tr>
                            <Td colSpan={table.getAllColumns().length}>
                                <div className=' my-1 text-base font-semibold'>
                                    <span className=''>Filtered Interval Total: </span>
                                    <span className='text-green-600 ml-4'>${data[0]?.totalAmountEarned}</span>
                                </div>
                            </Td>
                        </Tr>
                    </TFoot>
                    <Dialog
                        isOpen={updateDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onUpdateDialogClose}
                        onRequestClose={onUpdateDialogClose}
                    >
                        <h5 className="mb-4">Edit Earning Price</h5>
                        <UpdateEarningHistoryPrice
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={updateData!}
                            setIsOpen={setUpdateDialogIsOpen}
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

export default EarningsReport