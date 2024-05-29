import { useAppDispatch, useAppSelector } from '@/store'
import { FormItem, FormContainer } from '@/components/ui/Form'

import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { Select } from '@/components/ui'
import { useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
// import { Customer, fetchQuickBooksCustomer } from '@/store/slices/quickbooks-customer/quickBooksCustomerSlice'
import { fetchStaffData } from '@/store/slices/staff/staffSlice'


interface AssignDealerToStaffProps extends CommonProps {
    data: {
        id: string
        firstName: string
        lastName: string
        customer: Customer[]
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type AssignDealerFormSchema = {
    customerId: string
    remove: boolean
}

interface Option {
    value: string
    label: string
}

interface Customer {
    id: string;
    name: string;
}

const validationSchema = Yup.object().shape({
    customerId: Yup.string().required('Please select a Staff'),
    remove: Yup.boolean().required('select status')
})

const AssignDealerToStaff = (props: AssignDealerToStaffProps) => {
    const [success, setSuccess] = useState(false)
    // const [customerData, setCustomer] = useState<Customer[]>([])
    // const [loading, setLoading] = useState(false);
    const [message, setMessage] = useTimeOutMessage()
    const { assignDealershipToStaff } = useAuth()

    // useEffect(() => {
    //     fetchQuickBooksCustomer()
    // }, [])

    const staffId = props.data.id

    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.quickbookscustomer)

    const customerOptions: Option[] = props.data.customer?.map(
        (customer: Customer) => ({
            value: `${customer.id}`,
            label: `${customer.name}`
        })
    )

    const updateManPermission = async (
        values: AssignDealerFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { customerId, remove } = values
        setSubmitting(true)

        // const managerId = `${props?.data?.id}`

        const result = await assignDealershipToStaff(staffId, {
            customerId,
            remove
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchStaffData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Dealer Assigned`} type="success">
                    Successfully Assigned Dealer to {props.data.firstName}.
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
                <p>Assign a dealer to  <b><em>{`${props.data.firstName.charAt(0).toUpperCase()}${props.data.firstName.slice(1).toLowerCase()} ${props.data.lastName.charAt(0).toUpperCase()}${props.data.lastName.slice(1).toLowerCase()}`}</em></b>.</p>
            </div>
            <Formik
                initialValues={{
                    customerId: ``,
                    remove: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.remove = false
                    // console.log('values:', values)
                    if (props.disableSubmit) {
                        updateManPermission(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3 mt-4">

                            <FormItem
                                label="Select Dealer"
                                invalid={Boolean(
                                    errors.customerId && touched.customerId
                                )}
                                errorMessage={errors.customerId as string}
                            >
                                <Field name="customerId">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<AssignDealerFormSchema>) => (
                                        <Select
                                            isLoading={loading}
                                            field={field}
                                            form={form}
                                            options={customerOptions}
                                            value={customerOptions.filter(
                                                (option) =>
                                                    option.value === values.customerId
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
                                    // size="sm"
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
                                        ? 'Assigning...'
                                        : 'Assign'}
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

export default AssignDealerToStaff