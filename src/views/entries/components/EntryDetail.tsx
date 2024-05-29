import { Button, Dialog, Spinner } from '@/components/ui'
import { useAppSelector, useAppDispatch, RootState } from '@/store'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { FaEdit } from 'react-icons/fa'
import UpdateInvoiceServicePrice from './UpdateServicePrice'
import { useSelector } from 'react-redux'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'
import UpdateService from './UpdateService'
import { BsTrash3Fill } from 'react-icons/bs'
import { TbTrashOff } from "react-icons/tb";
import { fetchEntryData } from '@/store/slices/entry/entrySlice'
import DeleteVin from '@/views/invoice/invoice-details/components/DeleteVin'

const EntryDetail = () => {
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [updateServiceDialogIsOpen, setUpdateServiceDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [message, setMessage] = useTimeOutMessage()
    // const [success, setSuccess] = useState(false)
    const [updateData, setUpdateData] = useState<{
        servId: string
        entId: string
        vin: string
        carId: string
        price: number
        serviceName: string
    }>()
    const [updateService, setUpdateService] = useState<{
        oldServId: string
        oldServiceName: string
        carId: string
        vin: string
        invoiceId: string | undefined
    }>()

    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.entry)
    // const { data, loading, error } = useAppSelector((state) => state.entries)
    const { entryIdParams } = useParams<{ entryIdParams: string }>()
    const { user } = useSelector((state: RootState) => state.auth)

    const [deleteVin, setDeleteVin] = useState<{
        vin: string,
        carId: string
    }>()

    useEffect(() => {
        try {
            if (entryIdParams) {
                dispatch(fetchEntryData(entryIdParams))
            }
        } catch (error) {
            console.log(error as TypeError);
        }

    }, [dispatch, entryIdParams])

    const openUpdateDialog = () => {
        setUpdateDialogIsOpen(true)
    }

    const onUpdateDialogClose = () => {
        setUpdateDialogIsOpen(false)
    }
    const openUpdateServiceDialog = () => {
        setUpdateServiceDialogIsOpen(true)
    }

    const onUpdateServiceDialogClose = () => {
        setUpdateServiceDialogIsOpen(false)
    }

    const openDeleteDialog = () => {
        setDeleteDialogIsOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogIsOpen(false)
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
            <div className="mt-6">
                <p>Error occured Loading Invoice Details</p>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 p-4 rounded-md">
            <div>
                <div className="grid grid-cols-1 gap-y-2">
                    <p>
                        Entry Name:{' '}
                        <span className="text-gray-600 text-sm md:text-lg font-semibold">
                            {data?.invoice?.name}
                        </span>
                    </p>
                    <p>
                        Entry Id:{' '}
                        <span className="text-gray-600 text-sm md:text-lg font-semibold">
                            {data?._id}
                        </span>
                    </p>
                    <p>
                        Entry Number:{' '}
                        <span className="text-gray-600 text-sm md:text-lg font-semibold">
                            {data?.invoice?.invoiceNumber}
                        </span>
                    </p>
                    <p>
                        Customer Name:{' '}
                        <span className="text-gray-500 text-sm md:text-lg font-semibold capitalize">
                            {data?.customerName}
                        </span>
                    </p>
                </div>
            </div>
            <div className="py-8 px-4 sm:px-6 lg:px-1 overflow-x-auto ">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-2 py-3 text-left font-bold text-gray-500 uppercase tracking-wider"
                            >
                                Entry Details
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
                                                VIN
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Year
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Make
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Model
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Color
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
                                                Created By
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Work Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Services Breakdown
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.invoice && data.invoice.carDetails && data.invoice.carDetails.map(
                                            (carDetail, index) => (
                                                <tr
                                                    key={index}
                                                    className="text-sm"
                                                >
                                                    <td className="px-1 py-2 whitespace-normal align-top">
                                                        {carDetail.vin ? carDetail.vin : "Unavailable(Appt.)"}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.year} */}
                                                        {carDetail.year ? carDetail.year : "--"}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.make} */}
                                                        {carDetail.make ? carDetail.make : "--"}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.model} */}
                                                        {carDetail.model ? carDetail.model : "--"}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.colour} */}
                                                        {carDetail.colour ? carDetail.colour : "--"}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.category} */}
                                                        {carDetail.category ? carDetail.category : "--"}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-normal align-top">
                                                        {
                                                            data?.invoice?.createdByDetails?.name ? data?.invoice?.createdByDetails?.name : "--"
                                                        }
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap flex flex-col align-top">
                                                        <span>
                                                            {carDetail.entryDate ? formatDateToMMMDDYYYY(carDetail.entryDate) : " "}
                                                            {/* {customer.entryDate ? formatDateToMMMDDYYYY(customer.entryDate) : "Undone(Appt.)"} */}
                                                        </span>
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
                                                                        Service
                                                                        Name
                                                                    </th>
                                                                    <th
                                                                        scope="col"
                                                                        className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                                    >
                                                                        Service
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
                                                                        Price
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
                                                                                <span className='flex items-center justify-between gap-x-2'>

                                                                                    {
                                                                                        breakDown.serviceName
                                                                                    }
                                                                                    {/* {data?.invoice.sent ? "" : */}
                                                                                    <span>
                                                                                        <Button
                                                                                            icon={<FaEdit />}
                                                                                            className=""
                                                                                            size="xs"
                                                                                            onClick={() => {
                                                                                                setUpdateService({
                                                                                                    oldServId: breakDown.serviceId,
                                                                                                    oldServiceName: breakDown.serviceName,
                                                                                                    carId: carDetail._id,
                                                                                                    vin: carDetail?.vin || "",
                                                                                                    invoiceId: entryIdParams
                                                                                                })
                                                                                                openUpdateServiceDialog()
                                                                                            }} />
                                                                                    </span>
                                                                                    {/* } */}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-1 py-1 whitespace-nowrap">
                                                                                {
                                                                                    breakDown.serviceType || "--"
                                                                                }
                                                                            </td>
                                                                            <td className="px-1 py-1 whitespace-nowrap">
                                                                                {
                                                                                    breakDown.stafName && breakDown.stafName || "--"
                                                                                }
                                                                            </td>
                                                                            <td className="px-1 py-1 whitespace-nowrap min-w-[4rem] text-green-600 font-semibold">
                                                                                <span className='flex items-center justify-between gap-x-2'>

                                                                                    {
                                                                                        breakDown.price || "--"
                                                                                    }
                                                                                    {user.role && (user.role.includes("admin") || user.role.includes("gm")) &&

                                                                                        <span>
                                                                                            <Button
                                                                                                icon={<FaEdit />}
                                                                                                className=""
                                                                                                size="xs"
                                                                                                onClick={() => {
                                                                                                    setUpdateData({
                                                                                                        servId: breakDown.serviceId,
                                                                                                        serviceName: breakDown.serviceName,
                                                                                                        entId: data?._id,
                                                                                                        carId: carDetail._id,
                                                                                                        price: breakDown.price,
                                                                                                        vin: carDetail.vin || ""
                                                                                                    })
                                                                                                    openUpdateDialog()
                                                                                                }} />
                                                                                        </span>

                                                                                    }
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top text-green-500 font-semibold">
                                                        {carDetail.price}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top text-green-500 font-semibold">
                                                        {
                                                            carDetail.vin ?
                                                                user.role && (user.role.includes("admin") || user.role.includes("gm") || user.role.includes("manager")) &&
                                                                <span>
                                                                    <Button
                                                                        icon={<BsTrash3Fill />}
                                                                        className="hover:bg-red-400 hover:text-white ml-1 text-red-600"
                                                                        size="xs"
                                                                        onClick={() => {
                                                                            setDeleteVin({
                                                                                vin: carDetail.vin || "",
                                                                                carId: carDetail._id
                                                                            })
                                                                            openDeleteDialog()
                                                                        }} />
                                                                </span> : <span>
                                                                    <Button
                                                                        disabled
                                                                        icon={<TbTrashOff />}
                                                                        size="xs"
                                                                    />
                                                                </span>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        {/* ))} */}
                        <Dialog
                            isOpen={updateDialogIsOpen}
                            shouldCloseOnOverlayClick={false}
                            shouldCloseOnEsc={false}
                            width={700}
                            onClose={onUpdateDialogClose}
                            onRequestClose={onUpdateDialogClose}
                        >
                            <h5 className="mb-4">Apply Discounted Price</h5>
                            <UpdateInvoiceServicePrice
                                disableSubmit
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                data={updateData!}
                                setIsOpen={setUpdateDialogIsOpen}
                            />
                        </Dialog>
                        <Dialog
                            isOpen={updateServiceDialogIsOpen}
                            shouldCloseOnOverlayClick={false}
                            shouldCloseOnEsc={false}
                            width={700}
                            onClose={onUpdateServiceDialogClose}
                            onRequestClose={onUpdateServiceDialogClose}
                        >
                            <h5 className="mb-4">Update services</h5>
                            <UpdateService
                                disableSubmit
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                data={updateService!}
                                setIsOpen={setUpdateServiceDialogIsOpen}
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
                            <h5 className="mb-4">Delete Vehicle</h5>
                            <DeleteVin
                                disableSubmit
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                data={deleteVin!}
                                setIsOpen={setDeleteDialogIsOpen}
                            />
                        </Dialog>
                    </tbody>
                    <tfoot>
                        <tr className=" border-b border-gray-400">
                            <td
                                colSpan={10}
                                className="text-right font-bold text-xl pr-4 py-2"
                            >
                                Total:
                                <span className="text-green-600">
                                    {' '}
                                    $
                                    {data?.invoice?.totalPrice && data?.invoice.totalPrice.toFixed(
                                        2
                                    )}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default EntryDetail
