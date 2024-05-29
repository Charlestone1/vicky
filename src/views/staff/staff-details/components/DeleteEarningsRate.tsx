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
    data: { id: string; name: string; staff: string; serviceEarning: number }
    setIsOpen: (value: boolean) => void
    disableSubmit?: boolean
}

type DeleteEarningRateDetails = {
    // staffId: string
    earningRate: number
}

const validationSchema = Yup.object().shape({
    // customerId: Yup.string(),
    earningRate: Yup.number()
        .required('Please enter a number')
        .positive('must be greater than 1'),
})


const DeleteEarningsRate = (props: Props) => {
    const { deleteEarningsRate } = useAuth()
    const [message, setMessage] = useTimeOutMessage()
    const [success, setSuccess] = useState(false)
    // const { customerId } = useParams()
    // const { staffId } = useParams()

    const dispatch = useAppDispatch()
    // console.log(props.data)

    const deleteRate = async (
        values: DeleteEarningRateDetails,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { earningRate } = values

        setSubmitting(true)

        const serviceId = `${props?.data?.id}`
        const staffId = `${props?.data?.staff}`

        const result = await deleteEarningsRate(
            staffId,
            serviceId,
            {
                earningRate,
            }
        )

        if (result.status === 'failed') {
            setMessage(result.message)
            console.log('failed')
            toast.push(
                <Notification
                    title={`Delete Earnings Rate Request Failed`}
                    type="danger"
                >
                    {message}
                </Notification>
            )
        } else if (result.status === 'success') {
            setSuccess(true)
            setMessage(result.message)
            dispatch(fetchServiceData())
            dispatch(fetchUsersData())
            props?.setIsOpen(false)
            toast.push(
                <Notification
                    title={`Earnings Rate Deleted Successfully`}
                    type="success"
                ></Notification>
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
                    // customerId: '',
                    earningRate: props?.data?.serviceEarning,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {

                    if (props?.disableSubmit) {
                        deleteRate(values, setSubmitting)
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
                            // invalid={
                            //     errors.customerId && touched.customerId
                            // }
                            // errorMessage={errors.customerId}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    autoComplete="off"
                                    name="customerId"
                                    value={`${props?.data?.name}`}
                                    placeholder="Enter Service Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Dealership Price"
                                className="col-span-2 md:col-span-1"
                                invalid={errors.earningRate && touched.earningRate}
                                errorMessage={errors.earningRate}
                            >
                                <Field
                                    disabled
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
                                    color="red"
                                    onClick={() => console.log(errors)}
                                >
                                    {isSubmitting ? 'Deleting...' : 'Delete'}
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

export default DeleteEarningsRate