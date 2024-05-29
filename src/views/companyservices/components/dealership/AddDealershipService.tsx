import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { Select } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
import { useAppDispatch } from '@/store'


interface AddSingleServicesFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type DurationOption = {
    value: number
    label: string
}

const timeOptions: DurationOption[] = [
    { value: 0.25, label: '15 mins' },
    { value: 0.5, label: '30 mins' },
    { value: 0.75, label: '45 mins' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1hour 30mins' },
    { value: 2, label: '2 hours' },
    { value: 2.5, label: '2hours 30mins' },
    { value: 3, label: '3 hours' },
    { value: 3.5, label: '3hours 30mins' },
    { value: 4, label: '4hours' },
    { value: 5, label: '5hours' },
    { value: 6, label: '6hours' },
    { value: 7, label: '7hours' },
    { value: 8, label: '8hours' },
]
const staffTimeOptions: DurationOption[] = [
    { value: 0.5, label: '30 mins' },
    { value: 0.75, label: '45 mins' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1hour 30mins' },
    { value: 2, label: '2 hours' },
    { value: 2.5, label: '2hours 30mins' },
    { value: 3, label: '3 hours' },
    { value: 3.5, label: '3hours 30mins' },
    { value: 4, label: '4hours' },
    { value: 5, label: '5hours' },
    { value: 6, label: '6hours' },
    { value: 7, label: '7hours' },
    { value: 8, label: '8hours' },
    { value: 8, label: '9hours' },
]

type AddDealershipServiceFormSchema = {
    name: string
    isForDealership: boolean
    customerTime: number
    timeOfCompletion: number
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Enter service name'),
    // timeOfCompletion: Yup.number().required('Time is required')
    //     .typeError('Must be a number')
    //     .positive('Cannot be less than 1'),
    // customerTime: Yup.number().required('Time is required')
    //     .typeError('Must be a number')
    //     .positive('Cannot be less than 1'),

})

const AddDealershipService = (props: AddSingleServicesFormProps) => {
    const { disableSubmit = false, className, setIsOpen } = props
    const { addDealershipServices } = useAuth()
    const [message, setMessage] = useTimeOutMessage()

    const dispatch = useAppDispatch()

    const createServices = async (
        values: AddDealershipServiceFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {

        const {
            name,
            isForDealership,
            customerTime,
            timeOfCompletion
        } = values


        setSubmitting(true)
        const result = await addDealershipServices({ name, isForDealership, customerTime, timeOfCompletion })

        if (result?.status === 'failed') {
            setMessage(result.message)
            toast.push(
                <Notification
                    title={`Add Services Request Failed`}
                    type="danger"
                >
                    {message}
                </Notification>
            )
        } else if (result?.status === 'success') {
            setMessage(result.message)
            dispatch(fetchServiceData())
            setIsOpen(false)
            toast.push(
                <Notification
                    title={`Service Added Successfully`}
                    type="success"
                >
                    {name} added to the Services List
                </Notification>
            )
        }

        setSubmitting(false)
    }

    function closeDialogBox() {
        setIsOpen(false)
    }
    return (
        <div className={className}>
            {message && (
                <Alert
                    showIcon
                    className="mb-4 w-full flex justify-center"
                    type="danger"
                >
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    name: '',
                    isForDealership: true,
                    customerTime: 0.5,
                    timeOfCompletion: 1,
                }}

                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.isForDealership = true
                    if (!disableSubmit) {
                        createServices(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form >
                        <FormContainer className="">
                            <div className='max-h-96 overflow-y-auto'>
                                <div className=" grid grid-cols-1 sm:grid-cols-1 gap-x-3">
                                    <FormItem
                                        label="Service Name"
                                        invalid={errors.name && touched.name}
                                        errorMessage={errors.name}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            placeholder="Enter Service Name"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                                    <FormItem
                                        label="Completion Time"
                                        invalid={errors.timeOfCompletion && touched.timeOfCompletion}
                                        errorMessage={errors.timeOfCompletion}
                                    >
                                        <Field name="timeOfCompletion">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<AddDealershipServiceFormSchema>) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={timeOptions}
                                                    value={timeOptions.filter(
                                                        (option) =>
                                                            option.value === values.timeOfCompletion
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem
                                        label="Customer Time"
                                        invalid={errors.customerTime && touched.customerTime}
                                        errorMessage={errors.customerTime}
                                    >
                                        <Field name="customerTime">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<AddDealershipServiceFormSchema>) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={staffTimeOptions}
                                                    value={staffTimeOptions.filter(
                                                        (option) =>
                                                            option.value === values.customerTime
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            <div className="col-span-3 text-right mt-6">
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
                                // onClick={() => console.log(errors)}
                                >
                                    {isSubmitting
                                        ? 'Saving Service...'
                                        : 'Save'}
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

export default AddDealershipService
