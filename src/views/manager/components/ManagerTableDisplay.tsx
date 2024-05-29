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
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { Button, Card, Dialog, Pagination, Select, Spinner } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'
import RegisterManager from './RegisterManager'
import { FaEdit } from 'react-icons/fa'
import { BsTrash3Fill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import UpdatePermission from './UpdatePermission'
import RemovePermission from './RemovePermission'
import { MdAddLocationAlt, MdWrongLocation } from 'react-icons/md'
import UpdateManagerDetails from './UpdateManagerDetails'
import DeleteManager from './DeleteManager'
import { LoggedStaffDetails, Manager, fetchManagerData } from '@/store/slices/manager/managerSlice'

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

    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
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
            {user.role && (user.role.includes("admin") || user.role.includes("gm")) &&
                <div>
                    <Button variant="solid" onClick={() => openDialog()}>
                        Add New Manager
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
                        <h5 className="mb-4">Create New Manager Account</h5>
                        <RegisterManager setIsOpen={setIsOpen} />
                    </Dialog>
                </div>
            }
        </div>
    )
}

const fuzzyFilter: FilterFn<Manager> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })

    return itemRank.passed
}

const ManagerTableDisplay = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [permissionDialogIsOpen, setPermissionDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [removePermissionDialogIsOpen, setRemovePermissionDialogIsOpen] = useState(false)


    const [permissionId, setPermissionId] = useState<{
        id: string
        firstName: string
        lastName: string
    }>()
    const [removePermissionId, setRemovePermissionId] = useState<{
        id: string
        firstName: string
        lastName: string
        granted: LoggedStaffDetails[]
    }>()
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


    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.manager)
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        dispatch(fetchManagerData())
    }, [])


    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }


    const totalData = data?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<Manager>[]>(
        () => [
            { header: 'Name', accessorKey: 'firstNameLastName' },
            // { header: 'Last Name', accessorKey: 'lastName' },
            { header: 'Email', accessorKey: 'email' },
            // { header: 'Role', accessorKey: 'role' },
            { header: 'Departments', accessorKey: 'departments.0.name' },
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

    // Edit/delete feature

    const openUpdateDialog = () => {
        setUpdateDialogIsOpen(true)
    }

    const onUpdateDialogClose = () => {
        setUpdateDialogIsOpen(false)
    }
    const openPermissionDialog = () => {
        setPermissionDialogIsOpen(true)
    }

    const onPermissionDialogClose = () => {
        setPermissionDialogIsOpen(false)
    }
    const openDeleteDialog = () => {
        setDeleteDialogIsOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogIsOpen(false)
    }
    const openRemovePermissionDialog = () => {
        setRemovePermissionDialogIsOpen(true)
    }

    const onRemovePermissionDialogClose = () => {
        setRemovePermissionDialogIsOpen(false)
    }

    // edit and delete features
    const actionButtonsColumn = {
        header: 'Edit/Delete',
        cell: ({ row }: { row: Row<Manager> }) => {


            return (
                <span className="">
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
                                departments: row.original.departments.map(
                                    (department) => department._id
                                ),
                            })
                            // handleServiceEdit()
                            openUpdateDialog()
                        }}
                    />

                    <Button
                        icon={<BsTrash3Fill />}
                        className="hover:bg-red-600 hover:text-white ml-1 text-red-600"
                        size="xs"
                        onClick={() => {
                            setDeleteData({
                                id: row.original._id,
                                firstName: row.original.firstName,
                                lastName: row.original.lastName,
                                role: row.original.role,
                                departments: row.original.departments.map(
                                    (department) => department._id
                                ),
                            })
                            // handleServiceDelete()
                            openDeleteDialog()
                        }}
                    />
                </span>
            )
        },
    }

    // update permission features
    const viewPermissionColumn = {
        header: 'Location Permission',
        // Use a custom cell renderer for the edit button column
        cell: ({ row }: { row: Row<Manager> }) => {
            const staffLocationsVisibleToManager = row.original.managerDetails?.staffLocationsVisibleToManager || [];
            return (
                <span className="flex gap-1">
                    <Button
                        icon={<MdAddLocationAlt />}
                        // className="hover:bg-yellow-600 hover:text-white ml-1 text-yellow-600"
                        size="sm"
                        variant='twoTone'
                        onClick={() => {
                            setPermissionId({
                                id: row.original._id,
                                firstName: row.original.firstName,
                                lastName: row.original.lastName,
                            })
                            openPermissionDialog()
                        }}
                    >Grant</Button>

                    <Button
                        icon={<MdWrongLocation />}
                        size="sm"
                        variant='twoTone'
                        color='red'
                        onClick={() => {
                            setRemovePermissionId({
                                id: row.original._id,
                                firstName: row.original.firstName,
                                lastName: row.original.lastName,
                                granted: staffLocationsVisibleToManager
                                // granted: row.original.managerDetails.staffLocationsVisibleToManager.map((staff) => staff)
                            })
                            openRemovePermissionDialog()
                        }}
                    >Remove</Button>
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
                <p>Error occured Loading Managers Data</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchManagerData())}
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
                <p>No Manager has been added.</p>
                {
                    user.role && (user.role.includes("admin") || user.role.includes("gm")) &&
                    <div>
                        <Button
                            variant="solid"
                            className="mt-4"
                            onClick={() => openDialog()}
                        >
                            Add New Manager
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
                            <h5 className="mb-4">Create New Manager Account</h5>
                            <RegisterManager setIsOpen={setIsOpen} />
                        </Dialog>
                    </div>
                }

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
                                {user.role && (user.role.includes("admin") || user.role.includes("gm")) &&
                                    <>
                                        <Th>{viewPermissionColumn.header}</Th>
                                        <Th>{actionButtonsColumn.header}</Th>
                                    </>
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
                                                {cell.column.id === 'firstNameLastName'
                                                    ? `${row.original.firstName.charAt(0).toUpperCase()}${row.original.firstName.slice(1).toLowerCase()} ${row.original.lastName.charAt(0).toUpperCase()}${row.original.lastName.slice(1).toLowerCase()}`
                                                    : flexRender(cell.column.columnDef.cell, cell.getContext())
                                                }

                                            </Td>
                                        )
                                    })}
                                    {/* Render the edit button cell for each row */}
                                    {user.role && (user.role.includes("admin") || user.role.includes("gm")) &&
                                        <>
                                            <Td>
                                                {flexRender(viewPermissionColumn.cell, {
                                                    row,
                                                })}
                                            </Td>
                                            <Td>
                                                {flexRender(actionButtonsColumn.cell, {
                                                    row,
                                                })}
                                            </Td>
                                        </>
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
                        <h5 className="mb-4">Update Manager Details</h5>
                        <UpdateManagerDetails
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
                        <h5 className="mb-4">Delete Manager</h5>
                        <DeleteManager
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={deleteData!}
                            setIsOpen={setDeleteDialogIsOpen}
                        />
                    </Dialog>
                    <Dialog
                        isOpen={permissionDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onPermissionDialogClose}
                        onRequestClose={onPermissionDialogClose}
                    >
                        <h5 className="mb-4">Add Location Permission</h5>
                        <UpdatePermission
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={permissionId!}
                            // filteredManagerData={filteredStaffData}
                            setIsOpen={setPermissionDialogIsOpen}
                        />
                    </Dialog>
                    <Dialog
                        isOpen={removePermissionDialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onRemovePermissionDialogClose}
                        onRequestClose={onRemovePermissionDialogClose}
                    >
                        <h5 className="mb-4">Remove Location Permission</h5>
                        <RemovePermission
                            disableSubmit
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data={removePermissionId!}
                            // filteredStaffData={filteredStaffData}
                            setIsOpen={setRemovePermissionDialogIsOpen}
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

export default ManagerTableDisplay
