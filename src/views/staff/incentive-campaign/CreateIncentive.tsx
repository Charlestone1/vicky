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
import { DatePicker, InputGroup } from '@/components/ui'
import { useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useAppDispatch } from '@/store'
import Addon from '@/components/ui/InputGroup/Addon'
import type { FieldProps } from 'formik'
import { fetchIncentiveData } from '@/store/slices/incentive/incentiveSlice'
import moment from 'moment'
// import { fetchSpeedData } from '@/store/slices/driving-speed/speedSlice'

interface RegisterUserFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}
type CreateIncentiveSchema = {
    amountToBePaid: number
    numberOfVehiclesThreshold: number
    startTime: string
    endTime: string
}

const validationSchema = Yup.object().shape({
    amountToBePaid: Yup.number()
        .typeError('Amount must be a number')
        .required('Please enter amount')
        .min(1, 'Amount be greater than 0'),

    numberOfVehiclesThreshold: Yup.number()
        .typeError('No. of vehicles must be a number')
        .required('Please enter No. of vehicles')
        .min(1, 'No. of vehicles must be greater than 0'),

    startTime: Yup.string().required('Please select end date'),
    endTime: Yup.string().required('Please select end date'),
})

const CreateIncentive = (props: RegisterUserFormProps) => {
    const { disableSubmit = false, className, setIsOpen } = props
    const [success, setSuccess] = useState(false)
    // const [departmentsOp, setDepartmentsOp] = useState<DepartmentState>()
    const { createIncentiveProg } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()

    // const { data, loading, error } = useAppSelector((state) => state.speed)

    // useEffect(() => {
    //     dispatch(fetchSpeedData())
    // }, [])

    const createUser = async (
        values: CreateIncentiveSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            amountToBePaid,
            numberOfVehiclesThreshold,
            startTime,
            endTime,
        } = values
        setSubmitting(true)
        const result = await createIncentiveProg({
            amountToBePaid,
            numberOfVehiclesThreshold,
            startTime,
            endTime,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchIncentiveData())
            setSuccess(true)
            setMessage(result.message)
            setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Added Staff`} type="success">
                    Successfully Created and incentive programme.
                </Notification>
            )
            // console.log('success')
        }

        setSubmitting(false)
    }

    function closeDialogBox() {
        setIsOpen(false)
    }

    return (
        <div className={className}>
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
                    amountToBePaid: 0,
                    numberOfVehiclesThreshold: 0,
                    startTime: "",
                    endTime: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const momentStartTime = moment(values.startTime).startOf('day').utc();
                    const formattedStartTime = momentStartTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

                    const momentEndTime = moment(values.endTime).endOf('day').utc();
                    const formattedEndTime = momentEndTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

                    values.startTime = formattedStartTime
                    values.endTime = formattedEndTime

                    if (!disableSubmit) {
                        createUser(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            <FormItem
                                label="No. Of Vehicles"
                                invalid={errors.numberOfVehiclesThreshold && touched.numberOfVehiclesThreshold}
                                errorMessage={errors.numberOfVehiclesThreshold}
                            >
                                <Field
                                    type="number"
                                    // size="sm"
                                    autoComplete="off"
                                    name="numberOfVehiclesThreshold"
                                    placeholder="No. of vehicles to scan"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Bonus Amount"
                                invalid={errors.amountToBePaid && touched.amountToBePaid}
                                errorMessage={errors.amountToBePaid}
                            >
                                <Field
                                    type="number"
                                    // size="sm"
                                    autoComplete="off"
                                    name="amountToBePaid"
                                    placeholder="Bonus Amount to be paid"
                                    component={Input}
                                />
                            </FormItem>
                            <InputGroup className="mb-4 col-span-2 rounded-md">
                                <Field name="startTime">
                                    {({ field, form }: FieldProps) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            inputFormat="MMM, DD YYYY"
                                            value={field.value}
                                            placeholder="Select Start Date"
                                            onChange={(date) => {
                                                form.setFieldValue(field.name, date)
                                            }}
                                        />
                                    )}
                                </Field>
                                <Addon>To</Addon>
                                <Field name="endTime">
                                    {({ field, form }: FieldProps) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            inputFormat="MMM, DD YYYY"
                                            value={field.value}
                                            placeholder="Select End Date"
                                            onChange={(date) => {
                                                form.setFieldValue(field.name, date)
                                            }}
                                        />
                                    )}
                                </Field>
                            </InputGroup>

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
                                    variant="solid"
                                    type="submit"
                                >
                                    {isSubmitting
                                        ? 'Creating Incentive...'
                                        : 'Create'}
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


export default CreateIncentive
