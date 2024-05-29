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
import { useParams } from 'react-router-dom'
import { apiEarningsRepCurrent } from '@/store/slices/earnings-report/earningsReportSlice'

interface UpdateInvoiceServiceFormProps extends CommonProps {
    data: {
        staffId: string | undefined
        earningHistoryId: string
        vin: string | undefined
        serviceName: string | undefined
        earningPrice: number
        year: number | undefined
        make: string | undefined
        model: string | undefined
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type UpdateEarningHistFormSchema = {
    newAmountEarned: number
}

const validationSchema = Yup.object().shape({
    newAmountEarned: Yup.number()
        .required('Enter New price')
        .min(1, 'Price must be greater than or equal to 1'),
})
const UpdateEarningHistoryPrice = (props: UpdateInvoiceServiceFormProps) => {
    const [success, setSuccess] = useState(false)
    const { updateEarningsHistoryEarning } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()

    const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()

    const modifyEarningHistoryPrice = async (
        values: UpdateEarningHistFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { newAmountEarned } = values
        setSubmitting(true)

        const staffId = `${props?.data?.staffId}`
        const earningHistoryId = `${props?.data?.earningHistoryId}`

        const result = await updateEarningsHistoryEarning(staffId, earningHistoryId, {
            newAmountEarned
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(apiEarningsRepCurrent({ staffId }))
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Updated Price`} type="success">
                    Earning Price Updated Successfully.
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
                    newAmountEarned: props?.data?.earningPrice,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // console.log('values:', values)
                    const earningPrice = props?.data?.earningPrice
                    const newAmountEarnedChanged = values.newAmountEarned !== earningPrice;

                    if (props.disableSubmit && newAmountEarnedChanged) {
                        modifyEarningHistoryPrice(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting, isValid }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            {
                                props?.data?.vin &&
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
                            }

                            {
                                props?.data?.year !== undefined || props?.data?.make !== undefined || props?.data?.model !== undefined &&
                                <FormItem
                                    label="Year, Make, Model"
                                // invalid={errors.carId && touched.carId}
                                // errorMessage={errors.carId}
                                >
                                    <Field
                                        disabled
                                        value={`${props?.data?.year}, ${props?.data?.make}, ${props?.data?.model}`}
                                        type="text"
                                        // size="sm"
                                        autoComplete="off"
                                        name="yearmakemodel"
                                        component={Input}
                                    />
                                </FormItem>
                            }

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
                                label="Earning Price:"
                                invalid={errors.newAmountEarned && touched.newAmountEarned}
                                errorMessage={errors.newAmountEarned}
                            >
                                <Field
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="newAmountEarned"
                                    placeholder="Enter New Price"
                                    component={Input}
                                />
                            </FormItem>

                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    disabled={isSubmitting}
                                    // size="sm"
                                    onClick={closeDialogBox}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    disabled={!isValid || isSubmitting || values.newAmountEarned === props.data.earningPrice}
                                    variant="solid"
                                    type="submit"
                                // size="sm"
                                // onClick={() => {
                                //     console.log(errors)
                                // }}
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
        </div >
    )
}

export default UpdateEarningHistoryPrice