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
import { useAppDispatch } from '@/store'
import { fetchEntryData } from '@/store/slices/entry/entrySlice'
import { fetchInvoiceActivityLogData } from '@/store/slices/invoice-activity-log/activitiesSlice'
import { useParams } from 'react-router-dom'
import { fetchOnPremisesData } from '@/store/slices/on-premise/onPremiseSlice'

interface DeleteVinFormProps extends CommonProps {
    data: {
        vin: string
        carId: string
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}



type DeleteVinFormSchema = {
    vin: string
    carId: string
}

const validationSchema = Yup.object().shape({
    vin: Yup.string(),
    carId: Yup.string()
})

const DeleteVin = (props: DeleteVinFormProps) => {
    const [success, setSuccess] = useState(false)
    const { deleteOneVin } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()
    const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()

    const deleteThisVin = async (
        values: DeleteVinFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { vin, carId } = values
        setSubmitting(true)

        // const employeeId = `${props?.data?.vin}`


        const result = await deleteOneVin({
            vin,
            carId,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchEntryData(invoiceIdParams))
            dispatch(fetchOnPremisesData())
            dispatch(fetchInvoiceActivityLogData(invoiceIdParams))
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Deleted Vin`} type="success">
                    Successfully Deleted VIN:{vin} from this invoice.
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
        <div className='flex flex-col'>
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
            <h6 className='text-gray-500'>Are you sure you want to proceed with this request?</h6>
            <Formik
                initialValues={{
                    vin: `${props?.data?.vin}`,
                    carId: `${props?.data?.carId}`,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        deleteThisVin(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            {props?.data?.vin ? null :
                                <div>
                                    <FormItem
                                        label="Vin"
                                        invalid={errors.vin && touched.vin}
                                        errorMessage={errors.vin}
                                    >
                                        <Field
                                            disabled
                                            type="text"
                                            // size="sm"
                                            autoComplete="off"
                                            name="vin"
                                            placeholder="Unavailable"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                            }
                            <div className='hidden'>
                                <FormItem
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
                                        placeholder="Enter Last Name"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    loading={isSubmitting}
                                    variant="plain"
                                    type="submit"
                                    color="red"
                                >
                                    {isSubmitting
                                        ? 'Deleting Vin...'
                                        : 'Delete'}
                                </Button>
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="solid"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={closeDialogBox}
                                >
                                    Cancel
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

export default DeleteVin