// import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
// import { apiOtp } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'
import useAuth from '@/utils/hooks/useAuth'

interface OtpProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type OtpSchema = {
    otp: string
}

const validationSchema = Yup.object().shape({
    otp: Yup.string().required('Enter otp sent to your email'),
})


const OtpForm = (props: OtpProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    // const [emailSent, setEmailSent] = useState(false)

    const [message, setMessage] = useTimeOutMessage()
    const { signInOtp } = useAuth()

    const onSendMail = async (
        values: OtpSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const resp = await signInOtp(values)
            if (resp?.code === 200) {
                setSubmitting(false)
                // setEmailSent(true)
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

            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    otp: '',
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
                            <div>
                                <FormItem
                                    label='Enter OTP'
                                    invalid={errors.otp && touched.otp}
                                    errorMessage={errors.otp}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="otp"
                                        placeholder="Enter otp"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                Submit
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default OtpForm