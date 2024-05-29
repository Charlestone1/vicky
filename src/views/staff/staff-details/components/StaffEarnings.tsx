/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
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
import { Button, Dialog, Pagination, Select, Spinner } from '@/components/ui'
import { Link, useParams } from 'react-router-dom'
import { FaEdit, FaPlus } from 'react-icons/fa'

import { Service } from '@/@types/auth'
import { PaginationSelectOption } from '@/views/@types/shared'
import { BsFillTrash3Fill } from 'react-icons/bs'

import { User, fetchUsersData } from '@/store/slices/users/userSlice'
import AddEarningsRate from './AddEarningsRate'
import UpdateStaffEarningRate from './UpdateStaffEarningRate'
import DeleteEarningsRate from './DeleteEarningsRate'

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
    // const [entriesDialogIsOpen, setEntriesDialogIsOpen] = useState(false)

    // const openEntriesDialog = () => {
    //     if (!entriesDialogIsOpen) {
    //         setEntriesDialogIsOpen(true)
    //     }
    // }

    // const onEntriesDialogClose = () => {
    //     // console.log('onDialogClose', e)
    //     setEntriesDialogIsOpen(false)
    // }

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
                {/* <span className="mr-2 hidden md:block">Search services:</span> */}
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


const StaffEarnings = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [dealershipDialogIsOpen, setDealershipDialogIsOpen] = useState(false)
    const [editDealershipDialogIsOpen, setEditDealershipDialogIsOpen] =
        useState(false)
    const [deleteDealershipDialogIsOpen, setDeleteDealershipDialogIsOpen] =
        useState(false)
    const [onedata, setOneData] = useState<{ id: string; name: string; staff: string }>()
    const [oneEdit, setOneEdit] = useState<{
        id: string
        name: string
        staff: string
        serviceEarning: number
    }>()
    const [oneDelete, setOneDelete] = useState<{
        id: string
        name: string
        staff: string
        serviceEarning: number
    }>()

    const [serviceId, setServiceId] = useState<string | null>(null)
    const [serviceName, setServiceName] = useState<string | null>(null)
    const [aStaffId, setAStaffId] = useState<string | null>(null)
    const [oneUser, setOneUser] = useState<User>()

    const dispatch = useAppDispatch()
    const { data, error, loading } = useAppSelector((state) => state.services);
    const { data: dataUser, error: errorUser, loading: loadingUser } = useAppSelector((state) => state.user);

    // const { customerId } = useParams()
    const { staffId } = useParams()

    useEffect(() => {
        dispatch(fetchServiceData())
        dispatch(fetchUsersData())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        try {
            if (dataUser) {
                const singleStaff = dataUser?.find((item) => {
                    return item.id === staffId
                })

                setOneUser(singleStaff)
            }
        } catch (error) {
            console.log(error as TypeError)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataUser])

    const totalData = data?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<Service>[]>(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'Service Type', accessorKey: 'type' },
        ],
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

    const openDealershipDialog = () => {
        if (!dealershipDialogIsOpen) {
            setDealershipDialogIsOpen(true)
        }
    }

    const onDealershipDialogClose = () => {
        setDealershipDialogIsOpen(false)
    }

    const openEditDealershipDialog = () => {
        if (!dealershipDialogIsOpen) {
            setEditDealershipDialogIsOpen(true)
        }
    }

    const onEditDealershipDialogClose = () => {
        setEditDealershipDialogIsOpen(false)
    }

    const openDeleteDealershipDialog = () => {
        if (!dealershipDialogIsOpen) {
            setDeleteDealershipDialogIsOpen(true)
        }
    }

    const onDeleteDealershipDialogClose = () => {
        setDeleteDealershipDialogIsOpen(false)
    }

    // Define a new column for the edit button
    const dealershipColumn = {
        header: 'Staff Earnings',
        // Use a custom cell renderer for the edit button column
        cell: ({ row }: { row: Row<Service> }) => {
            const getStaffDetails = () => {
                setServiceId(row.original._id)
                setServiceName(row.original.name)
                setAStaffId(oneUser!._id)

                // console.log(serviceId);
            }
            return (
                <>
                    {oneUser?.staffDetails?.earningRates.map((item) => (
                        <div key={item._id}>
                            {item.serviceId === row.original._id ? (
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-y-1 md:content-start'>
                                    <span className=' col-span-1'>${item.earningRate}</span>
                                    <span className='grid grid-cols-2 gap-1 col-span-2 min-w-[5rem]'>
                                        <Button
                                            icon={<FaEdit />}
                                            // className=" hover:bg-blue-600"
                                            shape="circle"
                                            size="sm"
                                            onClick={() => {
                                                setOneEdit({
                                                    id: row.original._id,
                                                    name: row.original.name,
                                                    staff: oneUser!._id,
                                                    serviceEarning: item.earningRate,
                                                });
                                                getStaffDetails();
                                                openEditDealershipDialog();
                                            }}
                                        />
                                        <Button
                                            icon={<BsFillTrash3Fill />}
                                            shape="circle"
                                            variant="solid"
                                            color="red"
                                            size="sm"
                                            onClick={() => {
                                                setOneDelete({
                                                    id: row.original._id,
                                                    name: row.original.name,
                                                    staff: oneUser!._id,
                                                    serviceEarning: item.earningRate,
                                                });
                                                getStaffDetails();
                                                openDeleteDealershipDialog();
                                            }}
                                        />
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    ))}
                    {!oneUser?.staffDetails?.earningRates?.some(
                        (item) => item.serviceId === row.original.id
                    ) && (
                            <Button
                                icon={<FaPlus />}
                                shape="circle"
                                variant="solid"
                                size="sm"
                                onClick={() => {
                                    setOneData({
                                        id: row.original._id,
                                        name: row.original.name,
                                        staff: oneUser!._id,
                                    })
                                    getStaffDetails()
                                    openDealershipDialog()
                                }}
                            />
                        )}
                </>
            )
        },
    }

    if (loading || loadingUser) {
        return (
            <div className="flex justify-center items-center min-h-[20rem]  mt-4">
                <Spinner size="40px" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-6">
                <p>Error occured Loading Earninings Data</p>
                <Button
                    variant="solid"
                    className="mt-4"
                    onClick={() => {
                        dispatch(fetchUsersData())
                        dispatch(fetchServiceData())
                    }}
                >
                    Refresh Data
                </Button>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center flex-col my-4">
                <p>No services Have been added.</p>
                <div>
                    <Link to={'/services'}>
                        <Button variant="solid" size="sm" className="my-2">
                            Go to Services Page
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>

            <div className="p-3 border-b border-gray-300">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search columns..."
                    onChange={(value) => setGlobalFilter(String(value))}
                />
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
                                <Th>{dealershipColumn.header}</Th>
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
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                    <Td>
                                        {flexRender(dealershipColumn.cell, {
                                            row,
                                        })}
                                    </Td>
                                </Tr>
                            )
                        })}
                    </TBody>
                    <Dialog
                        isOpen={dealershipDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onDealershipDialogClose}
                        onRequestClose={onDealershipDialogClose}
                    >
                        <h5 className="mb-4">Add Earnings Rate</h5>
                        <AddEarningsRate
                            disableSubmit
                            data={onedata!}
                            setIsOpen={setDealershipDialogIsOpen}
                        />
                    </Dialog>
                    <Dialog
                        isOpen={editDealershipDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onEditDealershipDialogClose}
                        onRequestClose={onEditDealershipDialogClose}
                    >
                        <h5 className="mb-4">Update Earnings Rate</h5>
                        <UpdateStaffEarningRate
                            disableSubmit
                            data={oneEdit!}
                            setIsOpen={setEditDealershipDialogIsOpen}
                        />
                    </Dialog>
                    <Dialog
                        isOpen={deleteDealershipDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onDeleteDealershipDialogClose}
                        onRequestClose={onDeleteDealershipDialogClose}
                    >
                        <h5 className="mb-4">Delete Earnings Rate</h5>
                        <DeleteEarningsRate
                            disableSubmit
                            data={oneDelete!}
                            setIsOpen={setDeleteDealershipDialogIsOpen}
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
        </>
    )
}

export default StaffEarnings