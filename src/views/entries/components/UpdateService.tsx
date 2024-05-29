import { FormItem, FormContainer } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useAppDispatch, useAppSelector } from '@/store'
import { Select } from '@/components/ui'
import { Service, fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
import { fetchInvoiceActivityLogData } from '@/store/slices/invoice-activity-log/activitiesSlice'
import { fetchEntryData } from '@/store/slices/entry/entrySlice'

interface UpdateInvoiceServiceFormProps extends CommonProps {

    data: {
        oldServId: string
        oldServiceName: string
        carId: string
        vin: string
        invoiceId: string | undefined
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type UpdateServiceSchema = {
    serviceId: string
}
interface Option {
    value: string
    label: string
}

const validationSchema = Yup.object().shape({
    // serviceId: Yup.string().required('Please enter your first name'),
    serviceId: Yup.string().required('Select a Service'),
})

const UpdateService = (props: UpdateInvoiceServiceFormProps) => {

    const [success, setSuccess] = useState(false)
    const { updateInvoiceService } = useAuth()
    const [message, setMessage] = useTimeOutMessage()
    const dispatch = useAppDispatch()

    // const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()
    const { data, loading } = useAppSelector((state) => state.services)

    useEffect(() => {
        dispatch(fetchServiceData())
    }, [dispatch])

    const serviceOptions: Option[] = data?.map(
        (service: Service) => ({
            value: `${service.id}`,
            label: `${service.name}`
        })
    )

    const modifyService = async (
        values: UpdateServiceSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { serviceId } = values
        setSubmitting(true)

        const carId = `${props?.data?.carId}`
        const oldServId = `${props?.data?.oldServId}`
        const invoiceIdParams = `${props?.data?.invoiceId}`

        const result = await updateInvoiceService(carId, oldServId, {
            serviceId,
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
                <Notification title={`Successfully Updated Service`} type="success">
                    Service Updated Successfully.
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
            <div>
                <p>Change Service Name {props.data.vin ? <>for VIN: <b><em>{`${props.data.vin}`}</em></b> </> : ""}.</p>
            </div>
            <Formik
                initialValues={{
                    serviceId: ``,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        modifyService(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3 mt-4">

                            <FormItem
                                label="Select Service"
                                invalid={Boolean(
                                    errors.serviceId && touched.serviceId
                                )}
                                errorMessage={errors.serviceId as string}
                            >
                                <Field name="serviceId">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<UpdateServiceSchema>) => (
                                        <Select
                                            isLoading={loading}
                                            field={field}
                                            form={form}
                                            options={serviceOptions}
                                            value={serviceOptions.filter(
                                                (option) =>
                                                    option.value === values.serviceId
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
                                    // size="sm"
                                    onClick={() => {
                                        console.log(errors)
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Updating service...'
                                        : 'Update Service'}
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

export default UpdateService