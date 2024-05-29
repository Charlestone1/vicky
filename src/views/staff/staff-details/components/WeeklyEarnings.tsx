import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
// import axios from 'axios'
import { Button, DatePicker, InputGroup, Pagination, Select } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import Addon from '@/components/ui/InputGroup/Addon'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { FormContainer } from '@/components/ui/Form'
// import moment from 'moment';
// import Notification from '@/components/ui/Notification'
// import toast from '@/components/ui/toast'

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
    // Row,
} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'

import { PaginationSelectOption } from '@/views/@types/shared'
import { Link } from 'react-router-dom'
import { EarningsData, apiCheckEarnings, fetchEarningsData } from '@/store/slices/earnings/earningsSlice'
import type { CommonProps } from '@/@types/common'

interface WeeklyEarningsProps extends CommonProps {
    disableSubmit?: boolean
}

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

type GetEarningsSchema = {
    startDate: string
    endDate: string
}

const validationSchema = Yup.object().shape({
    startDate: Yup.string().required('Please select start date'),
    endDate: Yup.string()
        .required('Please select end date')
        .test('startDateBeforeEndDate', 'End date must be equal or after start date', function (endDate) {
            const { startDate } = this.parent;
            if (!startDate || !endDate) {
                // If either date is not provided, the validation passes.
                return true;
            }
            return new Date(startDate) <= new Date(endDate);
        }),
});

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

const fuzzyFilter: FilterFn<EarningsData> = (row, columnId, value, addMeta) => {
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
const WeeklyEarnings = (props: WeeklyEarningsProps) => {
    const { disableSubmit = false } = props
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [submitting, setSubmitting] = useState(false)
    // const [toastKey, setToastKey] = useState<string | null>(null);
    const dispatch = useAppDispatch()
    const { data } = useAppSelector((state) => state.earnings)

    useEffect(() => {
        dispatch(fetchEarningsData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(() => {

    //     if (error) {
    //         // const newToastKey = Date.now().toString(); // Use a timestamp as a unique key
    //         // setToastKey(newToastKey);
    //         toast.push(
    //             <Notification title={`Failed to Fetch Earnings Details`} type="danger">
    //                 Selected interval should not be more than 7 days
    //             </Notification>
    //         );
    //     }
    // }, [error]);

    const checkEarnings = async (
        values: GetEarningsSchema,
        // setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            startDate,
            endDate,
        } = values
        setSubmitting(true)

        try {
            await dispatch(apiCheckEarnings({ startDate, endDate }))
        } catch (error) {
            console.log(error);
        }

        setSubmitting(false)
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
    const columns = useMemo<ColumnDef<EarningsData>[]>(
        () => [
            { header: 'First Name', accessorKey: 'firstName' },
            { header: 'Last Name', accessorKey: 'lastName' },
            {
                header: 'Weekly Earnings',
                accessorKey: 'weeklyEarning',
                cell: ({ row }) => {
                    let total = 0;
                    row.original.earningHistory.forEach((item) => {
                        total += item.amountEarned;
                    });
                    return <span>{total}</span>;
                },
            },

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
    return (
        <div className='flex flex-col gap-y-5'>

            <Formik
                initialValues={{
                    startDate: "",
                    endDate: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        checkEarnings(values)
                        // fetchEarningsData(values.startDate, values.endDate);//not working
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {() => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            <InputGroup className="mb-4 col-span-2">
                                <Field name="startDate">
                                    {({ field, form }: FieldProps) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            inputFormat="MMM, DD YYYY"
                                            // value={moment(field.value)}
                                            value={field.value}
                                            placeholder="Select Start Date"
                                            onChange={(date) => {
                                                form.setFieldValue(field.name, date)
                                            }}
                                        />
                                    )}
                                </Field>
                                <Addon>To</Addon>
                                <Field name="endDate">
                                    {({ field, form }: FieldProps) => (
                                        <DatePicker
                                            inputFormat="MMM, DD YYYY"
                                            field={field}
                                            form={form}
                                            // value={moment(field.value)}
                                            value={field.value}
                                            placeholder="Select End Date"
                                            onChange={(date) => {
                                                form.setFieldValue(field.name, date)
                                            }}
                                        />
                                    )}
                                </Field>
                            </InputGroup>

                            <div className="col-span-2 text-right mt-3">
                                <Button
                                    loading={submitting}
                                    variant="solid"
                                    type="submit"
                                >
                                    {submitting
                                        ? 'Getting Earnings...'
                                        : 'Get Earnings'}
                                </Button>
                            </div>

                            {/* <div className="mt-4 text-center"></div> */}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
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
                                    {/* {user.role && (user.role.includes("admin") || user.role.includes("gm")) &&
                                        <Th>{assignDealershipColumn.header}</Th>
                                    }
                                    <Th>{actionButtonsColumn.header}</Th> */}

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
                                                        to={`/staff/${row.original._id}/staff-info#manage-earnings`}
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
                                        {/* {user.role && (user.role.includes("admin") || user.role.includes("gm")) &&
                                            <Td>
                                                {flexRender(assignDealershipColumn.cell, {
                                                    row,
                                                })}
                                            </Td>
                                        }
                                        <Td>
                                            {flexRender(actionButtonsColumn.cell, {
                                                row,
                                            })}
                                        </Td> */}
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

        </div>
    )
}

export default WeeklyEarnings