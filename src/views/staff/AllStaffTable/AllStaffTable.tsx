/* eslint-disable react-hooks/exhaustive-deps */
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
import { useAppDispatch, useAppSelector, RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Staff, fetchStaffData } from '@/store/slices/staff/staffSlice'
import { Button, Card, Dialog, Pagination, Select, Spinner } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'
import RegisterStaffFormInput from '../RegisterStaff'
import { FaEdit, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { BsTrash3Fill } from 'react-icons/bs'
import UpdateStaffDetails from '../UpdateStaffDetails'
import DeleteStaff from '../DeleteStaff'
import { Link } from 'react-router-dom'
import { fetchUsersData } from '@/store/slices/users/userSlice'
import AssignDealerToStaff from '../staff-details/components/AssignDealerToStaff'
import UnAssignDealerToStaff from '../staff-details/components/UnAssignDealerToStaff'


interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

interface Customer {
    id: string;
    name: string;
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
                    Add New Staff
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
                    <h5 className="mb-4">Create New Staff Account</h5>
                    <RegisterStaffFormInput setIsOpen={setIsOpen} />
                </Dialog>
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<Staff> = (row, columnId, value, addMeta) => {
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

const AllStaffTable = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [filteredData, setFilteredData] = useState<Staff[]>([])
    const [filteredCustomerData, setFilteredCustomerData] = useState<Customer[]>([])

    const [addDealershipDialogIsOpen, setAddDealershipDialogIsOpen] = useState(false)
    const [removeDealershipDialogIsOpen, setRemoveDealershipDialogIsOpen] = useState(false)

    const [updateData, setUpdateData] = useState<{
        id: string
        firstName: string
        lastName: string
        role: string
        departments: string[]
    }>()
    const [deleteData, setDeleteData] = useState<{
        id: string
        firstName: string
        lastName: string
        role: string
        departments: string[]
    }>()
    const [dealership, setDealership] = useState<{
        id: string
        firstName: string
        lastName: string
        customer: Customer[]
    }>()

    const [removeDealership, setRemoveDealership] = useState<{
        id: string
        firstName: string
        lastName: string
        customer: Customer[]
    }>()

    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.staff)
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        dispatch(fetchStaffData())
        dispatch(fetchUsersData())
    }, [])

    useEffect(() => {
        if (data) {
            const filteredItems = data.filter(
                (item) => item.role === 'staff'
            )
            setFilteredData(filteredItems)
        }
    }, [data])

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }


    const totalData = filteredData?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<Staff>[]>(
        () => [
            { header: 'First Name', accessorKey: 'firstName' },
            { header: 'Last Name', accessorKey: 'lastName' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Role', accessorKey: 'role' },
        ],
        []
    )


    const table = useReactTable({
        data: filteredData,
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

    // edit and delete features
    const actionButtonsColumn = {
        header: 'Edit/Delete',
        // Use a custom cell renderer for the edit button column
        cell: ({ row }: { row: Row<Staff> }) => {


            return (
                <span className="flex justify-center">
                    <Button
                        icon={<FaEdit />}
                        className=""
                        size="xs"
                        onClick={() => {
                            setUpdateData({
                                id: row.original._id,
                                firstName: row.original.firstName,
                                lastName: row.original.lastName,
                                role: row.original.role,
                                departments: row.original.departments
                                    ? row.original.departments.map((department) => department.id)
                                    : [],
                            })
                            // handleServiceEdit()
                            openUpdateDialog()
                        }}
                    />

                    <Button
                        icon={<BsTrash3Fill />}
                        className="hover:bg-red-400 hover:text-white ml-1 text-red-600"
                        size="xs"
                        onClick={() => {
                            setDeleteData({
                                id: row.original._id,
                                firstName: row.original.firstName,
                                lastName: row.original.lastName,
                                role: row.original.role,
                                departments: row.original.departments
                                    ? row.original.departments.map((department) => department.id)
                                    : [],
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
            <div className="flex justify-center items-center min-h-[20rem] border border-gray-200 mt-4 rounded-md">
                <Spinner size="40px" />
            </div>
        )
    }

    if (error) {
        return (
            <Card className="flex justify-center flex-col items-center min-h-[25rem]">
                <p>Error occured Loading Staff Data</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchStaffData())}
                    >
                        Refresh Data
                    </Button>
                </div>
            </Card>
        )
    }

    if (filteredData.length === 0) {
        return (
            <div className="flex items-center justify-center flex-col my-4">
                <p>No Employee Have been added.</p>
                <div>
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => openDialog()}
                    >
                        Add New Staff
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
                        <h5 className="mb-4">Create New Staff Account</h5>
                        <RegisterStaffFormInput setIsOpen={setIsOpen} />
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
                                {user.role && (user.role.includes("admin")) &&
                                    <Th>{actionButtonsColumn.header}</Th>
                                }
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
                                                <Link
                                                    to={`/staff/${row.original.id}/staff-info`}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </Link>
                                            </Td>
                                        )
                                    })}
                                    {/* Render the edit button cell for each row */}
                                    {user.role && (user.role.includes("admin")) &&
                                        <Td>
                                            {flexRender(actionButtonsColumn.cell, {
                                                row,
                                            })}
                                        </Td>
                                    }
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
                        <h5 className="mb-4">Update User Details</h5>
                        <UpdateStaffDetails
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
                        <h5 className="mb-4">Delete User</h5>
                        <DeleteStaff
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={deleteData!}
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

export default AllStaffTable
