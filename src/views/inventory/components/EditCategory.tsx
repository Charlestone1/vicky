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
import { Dialog, Notification, toast } from '@/components/ui'
import DeleteCategory from './DeleteCategory'

interface UpdateCategoryFormProps extends CommonProps {
    disableSubmit?: boolean
    setIsOpen: (value: boolean) => void
    data: {
        name: string
        id: string
    }
}


type EditCategorySchema = {
    name: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Enter a Category name'),
});



const EditCategory = (props: UpdateCategoryFormProps) => {
    const { disableSubmit = false, setIsOpen } = props

    const { AddInventoryCategory } = useAuth()

    const [message, setMessage] = useTimeOutMessage()
    const [success, setSuccess] = useState(false)
    const [deleter, setDeleter] = useState<{
        name: string
        id: string
    }>()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)


    const updateCat = async (
        values: EditCategorySchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { name } = values
        setSubmitting(true)
        const result = await AddInventoryCategory({ name })

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else if (result?.status === 'success') {
            setMessage(result.message)
            setIsOpen(false)
            // console.log("success");
            setSuccess(true)
            setMessage(result.message)
            setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Updated`} type="success">
                    Successfully Updated Category Name
                </Notification>
            )
        }


        setSubmitting(false)
    }

    function closeDialogBox() {
        setIsOpen(false)
    }

    const openDeleteDialog = () => {
        setDeleteDialogOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false)
    }
    return (
        <div>
            {success ? null : (
                <>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            {message}
                        </Alert>
                    )}
                </>

            )}
            <Formik
                initialValues={{
                    name: `${props.data.name}`,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        updateCat(values, setSubmitting)
                    } else {
                        setSubmitting(false)

                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className='grid grid-cols-1 gap-x-3'>
                            <FormItem
                                label="Category Name"
                                className='col-span-2 md:col-span-1'
                                invalid={errors.name && touched.name}
                                errorMessage={errors.name}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="name"
                                    placeholder="Enter Category Name"
                                    component={Input}
                                />
                            </FormItem>
                            <div className='flex justify-between items-center mt-3'>
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="solid"
                                    color='red'
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        setDeleter({
                                            name: props?.data?.name,
                                            id: props?.data?.id
                                        });
                                        // closeDialogBox();
                                        openDeleteDialog();
                                    }}
                                >
                                    Delete
                                </Button>
                                <Dialog
                                    isOpen={deleteDialogOpen}
                                    shouldCloseOnOverlayClick={false}
                                    shouldCloseOnEsc={false}
                                    bodyOpenClassName="overflow-hidden"
                                    width={550}
                                    onClose={onDeleteDialogClose}
                                    onRequestClose={onDeleteDialogClose}
                                >
                                    <h5 className="mb-4">Delete Category</h5>
                                    <DeleteCategory data={deleter!} setIsOpenDel={setDeleteDialogOpen} setIsOpen={setIsOpen} />
                                </Dialog>
                                <div className="col-span-2 flex md:justify-end justify-between">
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
                                    >
                                        {isSubmitting
                                            ? 'Updating...'
                                            : 'Update'}
                                    </Button>
                                </div>
                            </div>

                        </FormContainer>
                    </Form>
                )}
            </Formik>

        </div>
    )
}

export default EditCategory