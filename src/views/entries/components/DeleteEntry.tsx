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
import { fetchEntriesData } from '@/store/slices/entries/entriesSlice'

interface DeleteVinFormProps extends CommonProps {
    data: {
        entryId: string,
        customerName: string
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}



type DeleteEntryFormSchema = {
    entryId: string,
    customerName: string
}

const validationSchema = Yup.object().shape({
    entryId: Yup.string(),
    customerName: Yup.string()
})

const DeleteEntry = (props: DeleteVinFormProps) => {
    const [success, setSuccess] = useState(false)
    const { deleteEntry } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()

    const deleteThisEntry = async (
        values: DeleteEntryFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { entryId, customerName } = values
        setSubmitting(true)

        // const employeeId = `${props?.data?.entryId}`


        const result = await deleteEntry({
            entryId,
            customerName,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchEntriesData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Deleted Entry`} type="success">
                    Entry deleted successfully.
                </Notification>
            )
        }

        setSubmitting(false)
    }

    function closeDialogBox() {
        props?.setIsOpen(false)
    }
    return (
        <div className='flex flex-col'>
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
            <h6 className='text-gray-500'>Are you sure you want to delete this entry for <b>{props.data?.customerName}</b>?</h6>
            <Formik
                initialValues={{
                    customerName: `${props?.data?.customerName}`,
                    entryId: `${props?.data?.entryId}`,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        deleteThisEntry(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">

                            <div className='hidden'>
                                <FormItem
                                    label="Entry Id"
                                    invalid={errors.entryId && touched.entryId}
                                    errorMessage={errors.entryId}
                                >
                                    <Field
                                        disabled
                                        type="text"
                                        size="sm"
                                        autoComplete="off"
                                        name="entryId"
                                        placeholder="Unavailable"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className='hidden'>
                                <FormItem
                                    label="Customer Name"
                                    invalid={errors.customerName && touched.customerName}
                                    errorMessage={errors.customerName}
                                >
                                    <Field
                                        disabled
                                        type="text"
                                        size="sm"
                                        autoComplete="off"
                                        name="customerName"
                                        placeholder="Enter Last Name"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    loading={isSubmitting}
                                    variant="plain"
                                    type="submit"
                                    color="red"
                                >
                                    {isSubmitting
                                        ? 'Deleting Entry...'
                                        : 'Yes, I want to delete'}
                                </Button>
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="solid"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={closeDialogBox}
                                >
                                    No
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

export default DeleteEntry