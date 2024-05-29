import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { apiRequestStaffAccountDelete } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'
import { PasswordInput } from '@/components/shared'

interface RequestDeleteProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    email: string
    password: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
})

const RequestDeleteForm = (props: RequestDeleteProps) => {
    const { disableSubmit = false, className } = props
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const resp = await apiRequestStaffAccountDelete(values)
            if (resp.data) {
                setSubmitting(false)
                setEmailSent(true)
            }
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString()
            )
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1 text-gray-700">Delete Request Sent</h3>
                        <p>
                            Account Removal Request has been sent to the Admin.
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1 text-gray-700">Request Delete</h3>
                        <p>
                            Please enter your account credentials.
                        </p>
                    </>
                )}
            </div>
            <div className='flex justify-center items-center w-full'>
                {message && (
                    <Alert showIcon className="mb-4 w-full flex justify-center items-center" type="danger">
                        {message}
                    </Alert>
                )}

            </div>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="staff1@gmail.com"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Password"
                                    invalid={
                                        (errors.password &&
                                            touched.password) as boolean
                                    }
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="password"
                                        placeholder="Password"
                                        component={PasswordInput}
                                    />
                                </FormItem>
                            </div>
                            {
                                emailSent ?
                                    <Button
                                        disabled
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        Submit Email
                                    </Button> : <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        Submit Email
                                    </Button>
                            }
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RequestDeleteForm