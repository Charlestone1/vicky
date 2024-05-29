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
import { useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
// import { Customer, fetchQuickBooksCustomer } from '@/store/slices/quickbooks-customer/quickBooksCustomerSlice'
import { fetchStaffData } from '@/store/slices/staff/staffSlice'
import { fetchQuickBooksCustomer } from '@/store/slices/quickbooks-customer/quickBooksCustomerSlice'
import { fetchUsersData } from '@/store/slices/users/userSlice'

interface AssignCustomersToStaffProps extends CommonProps {
    data: {
        staffId: string | undefined
        firstName: string
        lastName: string
        permittedCustomers: string[]
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type AssignCustomerFormSchema = {
    customerQbIds: string[]
}

interface Option {
    value: string
    label: string
}


// const validationSchema = Yup.object().shape({
//     customerQbIds: Yup.array()
//         .min(1, 'Select at least one Customer')
//         .test(
//             'check-customerQbIds',
//             'Please select a customer',
//             function (value) {
//                 if (value && value[0] && value[0].length < 1) {
//                     // console.log(value[0].length)
//                     return this.createError({
//                         path: 'customerQbIds',
//                         message: 'select a customer',
//                     })
//                 }
//                 return true
//             }
//         ),
// })
const validationSchema = Yup.object().shape({
    customerQbIds: Yup.array()
        .nullable() // Allow null values, including empty arrays
})


const AddCustomerStaffCanSee = (props: AssignCustomersToStaffProps) => {
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const { assignCustomersStaffcanSee } = useAuth()

    const dispatch = useAppDispatch()
    const { data, loading } = useAppSelector((state) => state.quickbookscustomer)

    useEffect(() => {
        dispatch(fetchQuickBooksCustomer())
    }, [])

    const staffId = props.data.staffId

    const customerOptions: Option[] = data?.map(
        (customer) => ({
            value: `${customer.Id}`,
            label: `${customer.DisplayName}`
        })
    )

    const updateManPermission = async (
        values: AssignCustomerFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { customerQbIds } = values
        setSubmitting(true)

        // const managerId = `${props?.data?.id}`

        const result = await assignCustomersStaffcanSee(staffId, {
            customerQbIds
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchStaffData())
            dispatch(fetchUsersData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Updated`} type="success">
                    Successfully updated customer(s) assigned to Staff.
                </Notification>
            )
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
                <p>Assign Customers to  <b><em>{`${props.data.firstName.charAt(0).toUpperCase()}${props.data.firstName.slice(1).toLowerCase()} ${props.data.lastName.charAt(0).toUpperCase()}${props.data.lastName.slice(1).toLowerCase()}`}</em></b>.</p>
            </div>
            <Formik
                initialValues={{
                    customerQbIds: props.data.permittedCustomers
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // console.log('values:', values)
                    if (props.disableSubmit) {
                        updateManPermission(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting, }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-1 gap-x-3 mt-4">

                            <FormItem
                                label="Select Customer(s)"
                                invalid={Boolean(
                                    errors.customerQbIds &&
                                    touched.customerQbIds
                                )}
                                errorMessage={errors.customerQbIds as string}
                            >
                                <Field name="customerQbIds">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<AssignCustomerFormSchema>) => (
                                        <Select<Option, true>
                                            isLoading={loading}
                                            isMulti
                                            field={field}
                                            size="sm"
                                            form={form}
                                            options={customerOptions}
                                            value={customerOptions.filter(
                                                (option) =>
                                                    values.customerQbIds.includes(
                                                        option.value
                                                    )
                                            )}
                                            onChange={(selectedOptions) => {
                                                const selectedValues =
                                                    selectedOptions.map(
                                                        (option) =>
                                                            option.value
                                                    )
                                                form.setFieldValue(
                                                    field.name,
                                                    selectedValues
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    size="sm"
                                    disabled={isSubmitting}
                                    onClick={closeDialogBox}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    size="sm"
                                // onClick={() => {
                                //     console.log(errors)
                                // }}
                                >
                                    {isSubmitting
                                        ? 'Updating...'
                                        : 'Update'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddCustomerStaffCanSee