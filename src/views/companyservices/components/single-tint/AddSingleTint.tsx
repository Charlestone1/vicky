import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
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

// type Option = {
//     value: string
//     label: string
// }
type DurationOption = {
    value: number
    label: string
}

// const typeOptions: Option[] = [
//     { value: 'installation', label: 'Installation' },
//     { value: 'removal', label: 'Removal' },
// ]

const completionTimeOptions: DurationOption[] = [
    { value: 0.25, label: '15 mins' },
    { value: 0.5, label: '30 mins' },
    { value: 0.75, label: '45 mins' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1hour 30mins' },
    { value: 2, label: '2 hours' },

]
const customerTimeOptions: DurationOption[] = [
    { value: 0.25, label: '15 mins' },
    { value: 0.5, label: '30 mins' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1hour 30mins' },
    { value: 2, label: '2 hours' },
    { value: 2.5, label: '2hours 30mins' },
    { value: 3, label: '3 hours' },
    { value: 3.5, label: '3hours 30mins' },
]

type AddSingleTintFormSchema = {
    type: string
    name: string
    customerTime: number
    // amount: number
    timeOfCompletion: number
    filmQualityOrVehicleCategoryAmount: {
        filmQualityId: string
        amount: number
    }[]
}

const validationSchema = Yup.object().shape({
    type: Yup.string(),
    name: Yup.string().required('Enter service name'),
    timeOfCompletion: Yup.number().required('Time is required')
        .typeError('Must be a number')
        .positive('Cannot be less than 1'),
    customerTime: Yup.number().required('Time is required')
        .typeError('Must be a number')
        .positive('Cannot be less than 1'),
    filmQualityOrVehicleCategoryAmount: Yup.array().of(
        Yup.object().shape({
            filmQualityId: Yup.string().required('Film Quality ID is required'),
            amount: Yup.number()
                .required('Price is required')
                .typeError('Must be a number')
                .positive('Cannot be less than 1'),
        })
    ),
})

const AddSingleTint = (props: AddSingleServicesFormProps) => {
    const { disableSubmit = false, className, setIsOpen } = props
    const { addSingleInstallServices } = useAuth()
    const [message, setMessage] = useTimeOutMessage()

    const dispatch = useAppDispatch()
    // const { data: filmdata, loading: filmLoading, error: filmError } = useAppSelector((state) => state.film)


    // useEffect(() => {
    //     dispatch(fetchServiceData())
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    const createServices = async (
        values: AddSingleTintFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { type, name, timeOfCompletion, customerTime, filmQualityOrVehicleCategoryAmount } = values
        // values.type = "installation"
        // console.log(values)

        setSubmitting(true)
        const result = await addSingleInstallServices({ type, name, timeOfCompletion, customerTime, filmQualityOrVehicleCategoryAmount })


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
                    type: 'installation',
                    name: '',
                    customerTime: 0.5,
                    timeOfCompletion: 1,
                    filmQualityOrVehicleCategoryAmount: [
                        {
                            filmQualityId: `65367c1f5a33254d3dc12276`,
                            amount: 0
                        },
                        {
                            filmQualityId: `65367c535a33254d3dc1227a`,
                            amount: 0
                        },
                        {
                            filmQualityId: `65367c755a33254d3dc1227e`,
                            amount: 0
                        },
                        {
                            filmQualityId: `65367c965a33254d3dc12282`,
                            amount: 0
                        },
                        {
                            filmQualityId: `65367caf5a33254d3dc12286`,
                            amount: 0
                        },
                    ]

                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
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
                                <div className=" grid grid-cols-1 sm:grid-cols-3 gap-x-3">
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
                                    <FormItem
                                        label="Completion Time"
                                        invalid={errors.timeOfCompletion && touched.timeOfCompletion}
                                        errorMessage={errors.timeOfCompletion}
                                    >
                                        <Field name="timeOfCompletion">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<AddSingleTintFormSchema>) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={completionTimeOptions}
                                                    value={completionTimeOptions.filter(
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
                                        label="customer Time"
                                        invalid={errors.customerTime && touched.customerTime}
                                        errorMessage={errors.customerTime}
                                    >
                                        <Field name="customerTime">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<AddSingleTintFormSchema>) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={customerTimeOptions}
                                                    value={customerTimeOptions.filter(
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

                                <div className=" grid grid-cols-1 sm:grid-cols-3 gap-x-3">
                                    <FormItem
                                        label="Basic ASWT film($)"
                                        invalid={typeof errors.filmQualityOrVehicleCategoryAmount?.[0] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[0]?.amount && touched.filmQualityOrVehicleCategoryAmount?.[0]?.amount}
                                        errorMessage={(typeof errors.filmQualityOrVehicleCategoryAmount?.[0] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[0]?.amount) || ""}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name={`filmQualityOrVehicleCategoryAmount[0].amount`}
                                            placeholder="BASIC ASWT FILM"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Llumar ATC($)"
                                        invalid={typeof errors.filmQualityOrVehicleCategoryAmount?.[1] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[1]?.amount && touched.filmQualityOrVehicleCategoryAmount?.[1]?.amount}
                                        errorMessage={(typeof errors.filmQualityOrVehicleCategoryAmount?.[1] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[1]?.amount) || ""}
                                    >

                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name={`filmQualityOrVehicleCategoryAmount[1].amount`}
                                            placeholder="LIFE TIME WARANTY"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Llumar CTX (ceramic)($)"
                                        invalid={typeof errors.filmQualityOrVehicleCategoryAmount?.[2] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[2]?.amount && touched.filmQualityOrVehicleCategoryAmount?.[2]?.amount}
                                        errorMessage={(typeof errors.filmQualityOrVehicleCategoryAmount?.[2] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[2]?.amount) || ""}
                                    >

                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name={`filmQualityOrVehicleCategoryAmount[2].amount`}
                                            placeholder="LIFE TIME WARANTY"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                                    <FormItem
                                        label="Llumar IRX (nano-ceramic)($)"
                                        invalid={typeof errors.filmQualityOrVehicleCategoryAmount?.[3] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[3]?.amount && touched.filmQualityOrVehicleCategoryAmount?.[3]?.amount}
                                        errorMessage={(typeof errors.filmQualityOrVehicleCategoryAmount?.[3] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[3]?.amount) || ""}

                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name={`filmQualityOrVehicleCategoryAmount[3].amount`}
                                            placeholder="LIFE TIME WARANTYt"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="LXpel prime XR plus($)"
                                        invalid={typeof errors.filmQualityOrVehicleCategoryAmount?.[4] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[4]?.amount && touched.filmQualityOrVehicleCategoryAmount?.[4]?.amount}
                                        errorMessage={(typeof errors.filmQualityOrVehicleCategoryAmount?.[4] !== "string" && errors.filmQualityOrVehicleCategoryAmount?.[4]?.amount) || ""}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name={`filmQualityOrVehicleCategoryAmount[4].amount`}
                                            placeholder="LIFE TIME WARANTY"
                                            component={Input}
                                        />
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

export default AddSingleTint
