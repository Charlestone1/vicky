/* eslint-disable react-hooks/exhaustive-deps */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { fetchEntriesData } from '@/store/slices/entries/entriesSlice'
import { useAppDispatch } from '@/store'
import { useParams } from 'react-router-dom'
import { fetchEntryData } from '@/store/slices/entry/entrySlice'
import { fetchInvoiceActivityLogData } from '@/store/slices/invoice-activity-log/activitiesSlice'

interface UpdateInvoiceServiceFormProps extends CommonProps {
    data: {
        servId: string
        entId: string
        carId: string
        vin: string
        price: number
        serviceName: string
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type UpdateStaffFormSchema = {
    serviceId: string
    carId: string
    price: number
}

const validationSchema = Yup.object().shape({
    // serviceId: Yup.string().required('Please enter your first name'),
    carId: Yup.string().required('Enter a Car Id'),
    price: Yup.number()
        .required('Enter a price')
        .min(1, 'Price must be greater than or equal to 1'),
})
const UpdateInvoiceServicePrice = (props: UpdateInvoiceServiceFormProps) => {
    const [success, setSuccess] = useState(false)
    const { updateInvoiceServicePrice } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()

    const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()

    const modifyServicePrice = async (
        values: UpdateStaffFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { serviceId, carId, price } = values
        setSubmitting(true)

        const entryId = `${props?.data?.entId}`

        const result = await updateInvoiceServicePrice(entryId, {
            serviceId,
            carId,
            price,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchEntryData(invoiceIdParams))
            dispatch(fetchInvoiceActivityLogData(invoiceIdParams))
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Updated Price`} type="success">
                    Service Price Updated Successfully.
                </Notification>
            )
            // console.log('success')
        }

        setSubmitting(false)
    }



    function closeDialogBox() {
        props?.setIsOpen(false)
    }
    return (
        <div>
            {success ? null : (
                <>
                    {message && (
                        <Alert
                            showIcon
                            className="mb-4 w-full flex justify-center"
                            type="danger"
                        >
                            {message}
                        </Alert>
                    )}
                </>
            )}
            <Formik
                initialValues={{
                    serviceId: `${props?.data?.servId}`,
                    carId: `${props?.data?.carId}`,
                    price: props?.data?.price,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.carId = `${props?.data?.carId}`
                    values.serviceId = `${props?.data?.servId}`

                    // console.log('values:', values)
                    if (props.disableSubmit) {
                        // add the new update here
                        modifyServicePrice(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            <FormItem
                                label="VIN"
                            // invalid={errors.vin && touched.vin}
                            // errorMessage={errors.vin}
                            >
                                <Field
                                    disabled
                                    value={`${props?.data?.vin}`}
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="vin"
                                    component={Input}
                                />
                            </FormItem>

                            {/* <FormItem
                                label="Car Id"
                                invalid={errors.carId && touched.carId}
                                errorMessage={errors.carId}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="carId"
                                    component={Input}
                                />
                            </FormItem> */}

                            <FormItem
                                label="Service Name"
                            >
                                <Field
                                    disabled
                                    type="text"
                                    name="serviceName"
                                    value={`${props?.data?.serviceName}`}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Service Price:"
                                invalid={errors.price && touched.price}
                                errorMessage={errors.price}
                            >
                                <Field
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="price"
                                    placeholder="Enter service price"
                                    component={Input}
                                />
                            </FormItem>

                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={closeDialogBox}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"

                                >
                                    {isSubmitting
                                        ? 'Modifying ...'
                                        : 'Modify Price'}
                                </Button>
                            </div>

                            {/* <div className="mt-4 text-center"></div> */}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default UpdateInvoiceServicePrice