/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
// import { useParams } from 'react-router-dom'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useAppDispatch } from '@/store'
import { fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
import { fetchUsersData } from '@/store/slices/users/userSlice'

type Props = {
    data: { id: string; name: string, staff: string }
    setIsOpen: (value: boolean) => void
    disableSubmit?: boolean
}

type AddEarningsRateSchema = {
    serviceId: string
    earningRate: number
}

const validationSchema = Yup.object().shape({
    serviceId: Yup.string(),
    earningRate: Yup.number()
        .required('Enter a number')
        .positive('must be greater than 1'),
})

const AddEarningsRate = (props: Props) => {
    const { addEarningsRate } = useAuth()
    const [message, setMessage] = useTimeOutMessage()
    const [success, setSuccess] = useState(false)
    // const { staffId } = useParams()

    // console.log(props.data);
    const dispatch = useAppDispatch()

    const AddStaffEarn = async (
        values: AddEarningsRateSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { serviceId, earningRate } = values
        setSubmitting(true)

        const staff = `${props?.data?.staff}`
        const result = await addEarningsRate(staff, {
            serviceId,
            earningRate,
        })

        if (result.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
            toast.push(
                <Notification
                    title={`Add Earnings Rate Request Failed`}
                    type="danger"
                >
                    {message}
                </Notification>
            )
        } else if (result.status === 'success') {
            dispatch(fetchUsersData())
            dispatch(fetchServiceData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification
                    title={`Earnings Rate Added Successfully`}
                    type="success"
                >
                    Earning Rate ${earningRate} added for {props?.data?.name}
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
                    serviceId: '',
                    earningRate: 0,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // console.log('values:', values)
                    values.serviceId = `${props?.data?.id}`
                    // console.log('values:', values)
                    if (props?.disableSubmit) {
                        // console.log(values)

                        AddStaffEarn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            <FormItem
                                label="Service Name"
                                className="col-span-2 md:col-span-1"
                                invalid={
                                    errors.serviceId && touched.serviceId
                                }
                                errorMessage={errors.serviceId}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    autoComplete="off"
                                    name="serviceId"
                                    value={`${props?.data?.name}`}
                                    placeholder="Enter Services"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Earnings Rate"
                                className="col-span-2 md:col-span-1"
                                invalid={errors.earningRate && touched.earningRate}
                                errorMessage={errors.earningRate}
                            >
                                <Field
                                    type="number"
                                    autoComplete="off"
                                    name="earningRate"
                                    placeholder="number of vehicles"
                                    component={Input}
                                />
                            </FormItem>

                            <div className="col-span-2 flex md:justify-end justify-between mt-3">
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
                                    onClick={() => console.log(errors)}
                                >
                                    {isSubmitting ? 'Saving Rate...' : 'Add'}
                                </Button>
                            </div>

                            <div className="mt-4 text-center"></div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddEarningsRate
