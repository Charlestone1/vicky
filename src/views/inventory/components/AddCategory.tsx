import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'

interface AddCategoryFormProps extends CommonProps {
    disableSubmit?: boolean
    setIsOpen: (value: boolean) => void
}


type AddCategorySchema = {
    name: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Enter a Category name'),
});



const AddCategory = (props: AddCategoryFormProps) => {
    const { disableSubmit = false, className, setIsOpen } = props

    const { AddInventoryCategory } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    const addCat = async (
        values: AddCategorySchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { name } = values
        setSubmitting(true)
        const result = await AddInventoryCategory({ name })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log("failed");
        } else if (result?.status === 'success') {
            setMessage(result.message)
            setIsOpen(false)
            // console.log("success");
        }


        setSubmitting(false)
    }

    function closeDialogBox() {
        setIsOpen(false)
    }
    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // console.log('values:', values);
                    if (!disableSubmit) {
                        addCat(values, setSubmitting)

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

                            <div className="col-span-2 flex md:justify-end justify-between mt-3">
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
                                        ? 'Creating...'
                                        : 'Create'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>

        </div>
    )
}

export default AddCategory