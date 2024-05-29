/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store'
import {
    EntryData,
    fetchEntriesData,
} from '@/store/slices/entries/entriesSlice'
import { Spinner } from '@/components/ui'
import Logo from '@/components/template/Logo'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'

type Props = {
    // data?: EntryData
    // data: { id: string }
    setIsOpen: (value: boolean) => void
    disableSubmit?: boolean
}

const PreviewInvoice = (props: Props) => {
    // const [filteredInvoice, setFilteredInvoice] = useState<EntryData[]>([])

    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.entry)
    const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()

    useEffect(() => {
        dispatch(fetchEntriesData())
    }, [dispatch])

    // useEffect(() => {
    //     if (data) {
    //         const filteredData = data.filter(
    //             (item) => item._id === invoiceIdParams
    //         )
    //         setFilteredInvoice(filteredData)
    //     }
    // }, [data, invoiceIdParams])

    function closeDialogBox() {
        props?.setIsOpen(false)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[10rem]">
                <Spinner size="40px" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="my-6">
                <p>Error occured Loading Invoice preview</p>
                <Button
                    variant="solid"
                    className="mt-4"
                    onClick={() => dispatch(fetchEntriesData())}
                >
                    Refresh Preview
                </Button>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full">
            <div className="max-h-[27rem] overflow-y-auto">
                <div>
                    <div className="flex justify-between w-full">
                        <div>
                            <div className=" max-w-[6rem]">
                                <Logo />
                            </div>
                            <p>
                                7723 Mapelwood Ave, <br /> N. Richland Hills Tx
                                76182
                            </p>
                        </div>
                        <div>
                            <p>
                                Invoice Name:{' '}
                                <span className="text-gray-600 font-semibold">
                                    {data?.invoice.name}
                                </span>
                            </p>
                            {
                                data?.invoice?.invoiceNumber &&
                                <p>
                                    Invoice Number:{' '}
                                    <span className="text-gray-600 font-semibold">
                                        {data?.invoice?.invoiceNumber}
                                    </span>
                                </p>
                            }
                            <p>
                                Invoice Id:{' '}
                                <span className="text-gray-600 font-semibold">
                                    {data?._id}
                                </span>
                            </p>
                            <p>
                                Entry/App. Date:{' '}
                                <span className="text-gray-500 font-semibold">
                                    {data?.entryDate ? formatDateToMMMDDYYYY(data?.entryDate) : "Undone (Appointment)"}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p>
                            Customer Name:{' '}
                            <span className="text-gray-500 font-semibold capitalize">
                                {data?.customerName}
                            </span>
                        </p>
                    </div>
                </div>
                <div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-2 py-3 text-left font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    Invoice Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                            <tr>
                                <td>
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                >
                                                    VIN - Year - Make -
                                                    Model - Color
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                >
                                                    Category
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                >
                                                    Job Description
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                >
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {data.invoice.carDetails.map(
                                                (carDetail, index) => (
                                                    <tr
                                                        key={index}
                                                        className="text-sm"
                                                    >
                                                        <td className="px-1 py-2 whitespace-normal align-top">
                                                            {carDetail.vin}{' '}
                                                            -{' '}
                                                            {carDetail.year}{' '}
                                                            -{' '}
                                                            {carDetail.make}{' '}
                                                            -{' '}
                                                            {
                                                                carDetail.model
                                                            }{' '}
                                                            -
                                                            {
                                                                carDetail.colour
                                                            }
                                                        </td>

                                                        <td className="px-1 py-2 whitespace-nowrap align-top">
                                                            {
                                                                carDetail.category
                                                            }
                                                        </td>

                                                        {/* <td className="px-1 py-1 whitespace-nowrap">{carDetail.entryDate}</td> */}
                                                        <td className="px-1 py-1 text-xs whitespace-nowrap">
                                                            <table className="min-w-full">
                                                                <thead className="bg-gray-200">
                                                                    <tr>
                                                                        <th
                                                                            scope="col"
                                                                            className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                                        >
                                                                            Name
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                                        >
                                                                            Type
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                                        >
                                                                            Staff
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                                        >
                                                                            Cost
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-200">
                                                                    {carDetail.priceBreakdown && carDetail.priceBreakdown.map(
                                                                        (
                                                                            breakDown,
                                                                            idx
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="text-xs"
                                                                            >
                                                                                <td className="px-1 py-1 whitespace-nowrap">
                                                                                    {
                                                                                        breakDown.serviceName
                                                                                    }
                                                                                </td>
                                                                                <td className="px-1 py-1 whitespace-nowrap">
                                                                                    {
                                                                                        breakDown.serviceType
                                                                                    }
                                                                                </td>
                                                                                <td className="px-1 py-1 whitespace-nowrap">
                                                                                    {
                                                                                        breakDown.stafName && breakDown.stafName
                                                                                    }
                                                                                </td>
                                                                                <td className="px-1 py-1 whitespace-nowrap font-semibold text-green-500">
                                                                                    {
                                                                                        breakDown.price
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td className="px-1 py-2 whitespace-nowrap align-top text-green-600 font-semibold">
                                                            {
                                                                carDetail.price
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                        </tbody>
                        <tfoot>
                            <tr className=" border-b border-gray-400">
                                <td
                                    colSpan={10}
                                    className="text-right font-bold text-xl pr-4 py-2"
                                >
                                    Total Amount:
                                    <span className="text-green-600">
                                        {' '}
                                        $
                                        {data?.invoice.totalPrice.toFixed(
                                            2
                                        )}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div className="flex justify-end mt-3">
                <Button variant="plain" type="button" onClick={closeDialogBox}>
                    Close
                </Button>
            </div>
        </div>
    )
}

export default PreviewInvoice
