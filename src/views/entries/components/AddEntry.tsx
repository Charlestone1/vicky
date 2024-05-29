/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
// import { fetchCustomerData } from '../CustomerList/store/slice/CustomersSlice'
import { Select } from '@/components/ui'
import { fetchEntriesData } from '@/store/slices/entries/entriesSlice'
import useAuth from '@/utils/hooks/useAuth'
import { fetchCustomerData, Customer } from '@/store/slices/customer-by-role/customerSlice'
// import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

interface CreateEntryProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type CreateEntrySchema = {
    customerName: string
    vin: string[]
    note: string | any
}

type CustomerNameData = {
    customerName: string
    qbId: string
}

type Option = {
    value: string
    label: string
}

const validationSchema = Yup.object().shape({
    customerName: Yup.string().required('Please select customer'),
})

const AddEntry = (props: CreateEntryProps) => {
    const { disableSubmit = false, setIsOpen } = props
    const [dealerNames, setDealerNames] = useState<CustomerNameData[]>([])
    // const [message, setMessage] = useTimeOutMessage()
    // const [success, setSuccess] = useState(false)


    const { data, loading } = useAppSelector((state) => state.customer)
    const dispatch = useAppDispatch()
    const { createEntry } = useAuth()

    useEffect(() => {
        dispatch(fetchCustomerData())
        if (data) {
            const allCustomer = data?.filter((item) => {
                return item.customerDetails?.qbId
            })
            const customerNames: CustomerNameData[] = allCustomer.map(
                (customer: Customer) => ({
                    customerName: `${customer.firstName} ${customer.lastName}`,
                    qbId: `${customer.customerDetails.qbId}`,
                })
            )
            setDealerNames(customerNames)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const customerNameOptions: Option[] = dealerNames?.map(
        (custom: CustomerNameData) => ({
            value: `${custom.qbId}`,
            label: `${custom.customerName}`,
        })
    )

    const CreateEntry = async (
        values: CreateEntrySchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { vin, customerName, note } = values

        // const vinArray = vin.split(/\s+/)
        // const vinArray = vin.split(/[\s,]+/)
        const vinArray = vin.split(/[\s,\-_]+/)

        // console.log('vin structure', vin)
        // console.log('vinArray structure', vinArray)

        const vinValidator = (vin: string) => {
            const validatorFirstState =
                /^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{2}\d{6}$/.test(vin)
            const validatorSecondState =
                /^[A-HJ-NPR-Za-hj-npr-z\d]{8}[\dX][A-HJ-NPR-Za-hj-npr-z\d]{2}\d{6}$/.test(
                    vin
                )
            const validatorThirdState = /^[A-HJ-NPR-Z0-9]{17}$/.test(vin)

            return (
                validatorFirstState ||
                validatorSecondState ||
                validatorThirdState
            )
        }

        setSubmitting(true)
        let requestBody
        const invalidVins: string[] = []
        if (note) {
            requestBody = {
                carDetails: vinArray.map((v: string) => {
                    if (vinValidator(v)) {
                        return {
                            vin: v,
                            customerNote: note,
                        }
                    } else {
                        invalidVins.push(v)
                        if (invalidVins.length > 0) {
                            invalidVins.forEach(() => {
                                toast.push(
                                    <Notification
                                        title={`Invalid VIN`}
                                        type="danger"
                                    >
                                        {' '}
                                        <p>Invalid VIN(s):</p>
                                        <ul>
                                            {invalidVins.map((invalidVin) => (
                                                <li key={invalidVin}>
                                                    {invalidVin}
                                                </li>
                                            ))}
                                        </ul>
                                    </Notification>
                                )
                            })
                            setSubmitting(false)
                        }
                    }
                }),
            }
        } else if (!note) {
            requestBody = {
                carDetails: vinArray.map((v: string) => {
                    if (vinValidator(v)) {
                        return {
                            vin: v,
                        }
                    } else {
                        invalidVins.push(v)
                        if (invalidVins.length > 0) {
                            invalidVins.forEach(() => {
                                toast.push(
                                    <Notification
                                        title={`Invalid VIN`}
                                        type="danger"
                                    >
                                        <p>You have entered invalid VINs:</p>
                                        <ul>
                                            {invalidVins.map((invalidVin) => (
                                                <li key={invalidVin}>
                                                    {invalidVin}
                                                </li>
                                            ))}
                                        </ul>
                                    </Notification>
                                )
                            })
                            setSubmitting(false)
                        }
                    }
                }),
            }
        }
        const carDetails = requestBody?.carDetails

        const result = await createEntry(customerName, { carDetails })


        if (result?.status === 'failed') {
            // setMessage(result.message)
            if (result?.message === 'Duplicate VINs found.') {
                toast.push(
                    <Notification title={`Entry Creation`} type="danger">
                        Duplicate VINs found.
                    </Notification>
                )
            }
            if (result?.message === 'Duplicate Entry') {
                toast.push(
                    <Notification type="danger">
                        Duplicate Entry. Atleast one of the entered VINs already exists.
                    </Notification>
                )
            }
            console.log('failed')
        } else if (result?.status === 'success') {
            // setSuccess(true)
            // setMessage(result.message)
            setIsOpen(false)
            dispatch(fetchEntriesData())
            toast.push(
                <Notification title={`Entry Creation Successfull`} type="success">
                    Entry successfully added
                </Notification>
            )
            console.log("Entry don go");
        }

        setSubmitting(false)
    }

    function closeDialogBox() {
        setIsOpen(false)
    }
    return (
        <div className="max-h-96 overflow-y-auto">
            {/* {success ? null : (
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
            )} */}
            <Formik
                initialValues={{
                    customerName: '',
                    vin: [''],
                    note: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        CreateEntry(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="">
                            <div className="grid grid-cols-2 gap-x-3 z-40">
                                <FormItem
                                    label=" Select Dealer"
                                    invalid={
                                        errors.customerName &&
                                        touched.customerName
                                    }
                                    errorMessage={errors.customerName}
                                >
                                    <Field name="customerName">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<CreateEntrySchema>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                isLoading={loading}
                                                options={customerNameOptions}
                                                value={customerNameOptions.filter(
                                                    (option) =>
                                                        option.value === values.customerName
                                                )}
                                                // value={
                                                //     customerNameOptions.find(
                                                //         (option) =>
                                                //             option.value ===
                                                //             field.value
                                                //     ) || null
                                                // }
                                                onChange={(option) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label="VIN"
                                    invalid={errors.vin && touched.vin}
                                    errorMessage={errors.vin as string}
                                >
                                    <Field
                                        type="text"
                                        // size="sm"
                                        autoComplete="off"
                                        name="vin"
                                        placeholder="Enter VIN"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <FormItem
                                label="Notes (optional)"
                                invalid={errors.note && touched.note}
                                errorMessage={errors.note}
                            >
                                <Field
                                    as="textarea"
                                    // size="sm"
                                    autoComplete="off"
                                    name="note"
                                    placeholder="Enter Notes"
                                    component={Input}
                                />
                            </FormItem>
                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    // size="sm"
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
                                // onClick={() => console.log(errors)}
                                >
                                    {isSubmitting
                                        ? 'Creating entry...'
                                        : 'Create entry'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddEntry