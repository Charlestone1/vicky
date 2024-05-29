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

import { Button, Card, Pagination, Select, Spinner, Tag } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'

import { useAppDispatch, useAppSelector } from '@/store'
import { SentInvData, fetchSentInvoiceData } from '@/store/slices/invoicesentout/sentSlice'
import { Link } from 'react-router-dom'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'


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
const fuzzyFilter: FilterFn<SentInvData> = (row, columnId, value, addMeta) => {
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

const SentOutInvoice = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  // const [filteredData, setFilteredData] = useState<Staff[]>([])


  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.sent)

  useEffect(() => {
    dispatch(fetchSentInvoiceData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const totalData = data?.length

  const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<SentInvData>[]>(
    () => [
      { header: 'Invoice Name', accessorKey: 'invoice.name' },
      { header: 'QB Id', accessorKey: 'invoice.qbId' },
      { header: 'QB Invoice No.', accessorKey: 'invoice.invoiceNumber' },
      { header: 'Name', accessorKey: 'customerName' },
      { header: 'Total Price', accessorKey: 'invoice.totalPrice' },
      {
        header: 'Payment Status',
        accessorKey: 'status',
        cell: ({ row }: { row: Row<SentInvData> }) => {
          const paymentDetail = row.original.invoice.paymentDetails;
          const invoice = row.original.invoice;

          if (paymentDetail.amountDue === 0 || paymentDetail.amountPaid === invoice.totalPrice) {
            return (
              <span className='flex flex-col gap-y-4'>
                <span className="mr-2 rtl:ml-2">
                  <Tag prefix prefixClass="bg-green-500">
                    Fully Paid
                  </Tag>
                </span>
                {paymentDetail.paymentDate && (
                  <span className="mr-2 rtl:ml-2">
                    {formatDateToMMMDDYYYY(paymentDetail.paymentDate).split('T')[0]}
                  </span>
                )}
              </span>
            );
          } else if (paymentDetail.amountPaid === 0) {
            return (
              <span className="mr-2 rtl:ml-2">
                <Tag prefix prefixClass="bg-red-500">
                  Not Paid
                </Tag>
              </span>
            );
          } else if (paymentDetail.amountDue && paymentDetail.amountDue > 0) {
            return (
              <span className='flex flex-col gap-y-4'>
                <span className="mr-2 rtl:ml-2">
                  <Tag prefix prefixClass="bg-yellow-500">
                    Partly Paid
                  </Tag>
                </span>
                <span>
                  Amount Due: <span className='font-bold'>${paymentDetail.amountDue}</span>
                </span>
              </span>
            );
          }
        },
      },
      // {
      //   header: 'Payment Date',
      //   accessorKey: 'invoice.paymentDetails.paymentDate',
      //   cell: ({ row }: { row: Row<SentInvData> }) => {
      //     return (
      //       <span>
      //         {row.original.invoice.paymentDetails.paymentDate === null ? (
      //           <span className="mr-2 rtl:ml-2">
      //             <Tag prefix prefixClass="bg-yellow-500">
      //               Unpaid
      //             </Tag>
      //           </span>
      //         ) : (
      //           <span className="mr-2 rtl:ml-2">
      //             <span>{formatDateToMMMDDYYYY(row.original.invoice.paymentDetails.paymentDate).split('T')[0]} </span>
      //           </span>
      //         )}
      //       </span>
      //     )
      //   },
      // },
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
        <p>Error occured Loading Sent out Invoice Data</p>
        <div className="text-center">
          <Button
            variant="solid"
            className="mt-4"
            onClick={() => dispatch(fetchSentInvoiceData())}
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
        <p>No invoice has been sent out yet.</p>
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
                // onClick={() => handleServiceClick(row.original._id)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        <Link
                          to={`/sent-out-invoice/invoice/${row.original._id}`}
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

export default SentOutInvoice