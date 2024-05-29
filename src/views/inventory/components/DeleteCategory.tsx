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

interface DeleteCategoryFormProps extends CommonProps {
    data: {
        name: string
        id: string
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpenDel: (value: boolean) => void
    setIsOpen: (value: boolean) => void
}

type DeleteVinFormSchema = {
    name: string
    id: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string(),
    id: Yup.string()
})

const DeleteCategory = (props: DeleteCategoryFormProps) => {
    const { data, setIsOpenDel, setIsOpen } = props
    const [success, setSuccess] = useState(false)
    const { deleteCategory } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()

    const deleteThisVin = async (
        values: DeleteVinFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { name, id } = values
        setSubmitting(true)

        const result = await deleteCategory({
            name,
            id
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else if (result?.status === 'success') {
            // dispatch(fetchOnPremisesData())
            setSuccess(true)
            setMessage(result.message)
            setIsOpenDel(false)
            setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Categories`} type="success">
                    Successfully Deleted {name} Categories.
                </Notification>
            )
        }
        setSubmitting(false)
    }

    function closeDialog() {
        setIsOpenDel(false)
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
            <h6 className='text-gray-500'>Are you sure you want to proceed with this request?</h6>
            <Formik
                initialValues={{
                    name: `${data?.name}`,
                    id: `${data?.id}`,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        deleteThisVin(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-1 gap-x-3">

                            <div className='hidden'>
                                <FormItem
                                    label="name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        disabled
                                        type="text"
                                        size="sm"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="category name"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={closeDialog}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    color="red"
                                >
                                    {isSubmitting
                                        ? 'Deleting Category...'
                                        : 'Delete'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default DeleteCategory
