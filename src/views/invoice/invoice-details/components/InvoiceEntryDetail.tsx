import { Button, Dialog, Notification, Spinner, toast } from '@/components/ui'
import { useAppSelector, useAppDispatch, RootState } from '@/store'
// import {
//     EntryData,
//     fetchEntriesData,
// } from '@/store/slices/entries/entriesSlice'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import PreviewInvoice from './PreviewInvoice'
import { FaEdit } from 'react-icons/fa'
import UpdateInvoiceServicePrice from './UpdateInvoiceServicePrice'
import { useSelector } from 'react-redux'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'
import UpdateService from './UpdateService'
import { BsTrash3Fill } from 'react-icons/bs'
import DeleteVin from './DeleteVin'
import { fetchEntryData } from '@/store/slices/entry/entrySlice'

const InvoiceEntryDetail = () => {
    // const [filteredInvoice, setFilteredInvoice] = useState<EntryData[]>([])
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [updateServiceDialogIsOpen, setUpdateServiceDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
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

    const { sendInvoice, resendInvoice } = useAuth()

    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state) => state.entry)
    // const { data, loading, error } = useAppSelector((state) => state.entries)
    const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()
    const { user } = useSelector((state: RootState) => state.auth)

    const [deleteVin, setDeleteVin] = useState<{
        vin: string,
        carId: string
    }>()

    useEffect(() => {
        try {
            if (invoiceIdParams) {
                dispatch(fetchEntryData(invoiceIdParams))
            }
        } catch (error) {
            console.log(error as TypeError);
        }

        // if (invoiceIdParams) {
        //     dispatch(fetchEntryData(invoiceIdParams))
        // }
        // console.log("it is me entry details");

    }, [dispatch, invoiceIdParams])

    // useEffect(() => {
    //     if (data) {
    //         const filteredData = data.filter(
    //             (item) => item._id === invoiceIdParams
    //         )
    //         setFilteredInvoice(filteredData || [])
    //         // setFilteredInvoice(filteredData)
    //     }
    // }, [data, invoiceIdParams])


    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }
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

    // send invoice to quickbooks
    const sendNow = async () => {
        setSubmitting(true)

        const invoiceId = `${data?._id}`

        const result = await sendInvoice(invoiceId)

        if (result.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
            toast.push(
                <Notification
                    title={`Send Invoice Request Failed`}
                    type="danger"
                >
                    {result.message}
                </Notification>
            )
        } else if (result.status === 'success') {
            // dispatch(fetchEntriesData())
            dispatch(fetchEntryData(invoiceIdParams))
            // setSuccess(true)
            setMessage(result.message)
            toast.push(
                <Notification
                    title={`Invoice Successfully Sent`}
                    type="success"
                >
                    Invoice{' '}
                    <span className="text-gray-500">
                        {data?.invoice.name}
                    </span>{' '}
                    was sent to Quickbooks
                </Notification>
            )

            // console.log('success')
        }

        setSubmitting(false)
    }
    // send invoice to quickbooks
    const resend = async () => {
        setSubmitting(true)

        const invoiceId = `${data?._id}`
        // console.log(invoiceId)

        const result = await resendInvoice(invoiceId)

        if (result.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
            toast.push(
                <Notification
                    title={`resend Invoice Request Failed`}
                    type="danger"
                >
                    {result.message}
                </Notification>
            )
        } else if (result.status === 'success') {
            // if (invoiceIdParams) {
            //     dispatch(fetchEntryData(invoiceIdParams))
            // }
            // setSuccess(true)
            setMessage(result.message)
            toast.push(
                <Notification
                    title={`Invoice Successfully resent`}
                    type="success"
                >
                    Invoice{' '}
                    <span className="text-gray-500">
                        {data?.invoice.name}
                    </span>{' '}
                    was sent to Quickbooks
                </Notification>
            )
            // console.log('success')
        }
        setSubmitting(false)
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
                        Invoice Name:{' '}
                        <span className="text-gray-600 text-sm md:text-lg font-semibold">
                            {data?.invoice?.name}
                        </span>
                    </p>
                    <p>
                        Invoice Id:{' '}
                        <span className="text-gray-600 text-sm md:text-lg font-semibold">
                            {data?._id}
                        </span>
                    </p>
                    <p>
                        Invoice Number:{' '}
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
                                                        {carDetail.year ? carDetail.year : ""}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.make} */}
                                                        {carDetail.make ? carDetail.make : ""}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.model} */}
                                                        {carDetail.model ? carDetail.model : ""}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.colour} */}
                                                        {carDetail.colour ? carDetail.colour : ""}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-nowrap align-top">
                                                        {/* {carDetail.category} */}
                                                        {carDetail.category ? carDetail.category : ""}
                                                    </td>
                                                    <td className="px-1 py-2 whitespace-normal align-top">
                                                        {
                                                            data?.invoice?.createdByDetails?.name
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
                                                                                                    invoiceId: invoiceIdParams
                                                                                                })
                                                                                                openUpdateServiceDialog()
                                                                                            }} />
                                                                                    </span>
                                                                                    {/* } */}
                                                                                </span>
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
                                                                            <td className="px-1 py-1 whitespace-nowrap min-w-[4rem] text-green-600 font-semibold">
                                                                                <span className='flex items-center justify-between gap-x-2'>

                                                                                    {
                                                                                        breakDown.price
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
                                                            // data?.invoice.sent ? "" :
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
                            {/* <td colSpan={10} className="text-right font-bold text-xl pr-12 py-2">
                                Total Amount:
                                {data && data?.invoice.totalPrice ? (
                                    <span className="text-green-600">
                                        {' '}
                                        ${data?.invoice.totalPrice.toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-gray-400"> Not available</span>
                                )}
                            </td> */}
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="flex justify-center md:justify-end gap-3 mt-4">
                <div>
                    <Button
                        variant="solid"
                        size='sm'
                        onClick={() => {
                            openDialog()
                        }}
                    >
                        <span className="hidden md:block">Preview Invoice</span>
                        <span className="md:hidden">Preview</span>
                    </Button>
                    <Dialog
                        isOpen={dialogIsOpen}
                        shouldCloseOnOverlayClick={false}
                        style={{
                            content: {
                                marginTop: 35,
                            },
                        }}
                        shouldCloseOnEsc={false}
                        width={700}
                        onClose={onDialogClose}
                        onRequestClose={onDialogClose}
                    >
                        <h5 className="mb-4">Invoice Preview</h5>
                        <PreviewInvoice disableSubmit setIsOpen={setIsOpen} />
                    </Dialog>
                </div>
                <div>
                    {data?.invoice?.sent ? (<>
                        {user.role && (user.role.includes("admin") || user.role.includes("gm")) ? (
                            <>
                                <Button
                                    loading={submitting}
                                    variant="solid"
                                    size='sm'
                                    color="yellow-600"
                                    onClick={() => {
                                        resend()
                                    }}
                                >
                                    {submitting
                                        ? 'Resending Invoice...'
                                        : 'Resend To QuickBooks'}
                                </Button>
                            </>) : (
                            <>
                                <Button disabled variant="solid" size='sm' color="gray-600">
                                    Invoice Sent
                                </Button>
                            </>
                        )}
                    </>
                    ) : (
                        <Button
                            loading={submitting}
                            variant="solid"
                            size='sm'
                            color="green-600"
                            onClick={() => {
                                sendNow()
                            }}
                        >
                            {submitting
                                ? 'Sending Invoice...'
                                : 'Send To QuickBooks'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InvoiceEntryDetail
