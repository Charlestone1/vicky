// import classNames from 'classnames'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
// import isLastChild from '@/utils/isLastChild'
// import {
//     HiOutlineDesktopComputer,
//     HiOutlineDeviceMobile,
//     HiOutlineDeviceTablet,
// } from 'react-icons/hi'
// import dayjs from 'dayjs'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// import { useState } from 'react'

// type LoginHistory = {
//     type: string
//     deviceName: string
//     time: number
//     location: string
// }

type ChangePassword = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

// const LoginHistoryIcon = ({ type }: { type: string }) => {
//     switch (type) {
//         case 'Desktop':
//             return <HiOutlineDesktopComputer />
//         case 'Mobile':
//             return <HiOutlineDeviceMobile />
//         case 'Tablet':
//             return <HiOutlineDeviceTablet />
//         default:
//             return <HiOutlineDesktopComputer />
//     }
// }

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Password Required'),
    newPassword: Yup.string()
        .required('Enter your new password')
        .min(8, 'Too Short!')
        .matches(/^[A-Za-z0-9_-]*$/, 'Only Letters & Numbers Allowed'),
    confirmNewPassword: Yup.string().oneOf(
        [Yup.ref('newPassword'), ''],
        'Password does not match'
    ),
})

// const Password = ({ data }: { data?: LoginHistory[] }) => {
const Password = () => {
    const [message, setMessage] = useTimeOutMessage()
    // const [success, setSuccess] = useState(false)

    const { changePasswordasnyc } = useAuth()

    const changePassword = async (
        values: ChangePassword,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { currentPassword, newPassword, confirmPassword } = values
        setSubmitting(true)
        const result = await changePasswordasnyc({
            currentPassword,
            newPassword,
            confirmPassword,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            toast.push(
                <Notification title={`Reset Password Failed`} type="danger">
                    {message}
                </Notification>
            )
            // console.log('failed')
        } else if (result?.status === 'success') {
            // setSuccess(true)
            setMessage(result.message)
            toast.push(
                <Notification title={`Password Updated`} type="success">
                    {message}
                </Notification>
            )
            // console.log('success')
        }

        setSubmitting(false)
    }

    // const onFormSubmit = (
    //     values: PasswordFormModel,
    //     setSubmitting: (isSubmitting: boolean) => void
    // ) => {
    //     toast.push(<Notification title={''} type="success" />, {
    //         placement: 'top-center',
    //     })
    //     setSubmitting(false)
    //     console.log('values', values)
    // }

    return (
        <>
            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log('values:', values)
                    setSubmitting(true)
                    setTimeout(() => {
                        changePassword(values, setSubmitting)
                    }, 1000)
                }}

                // onSubmit={(values, { setSubmitting }) => {
                //     console.log('values:', values);
                //     if (!disableSubmit) {
                //         changePassword(values, setSubmitting)
                //     } else {
                //         setSubmitting(false)
                //     }
                // }}
            >
                {({ touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title="Reset Password"
                                    desc="Enter your current & new password to reset your password"
                                />
                                <FormRow
                                    name="currentPassword"
                                    label="Current Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="newPassword"
                                    label="New Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder="New Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <div className=" mt-4 text-center md:ltr:text-right">
                                    <Button
                                        className="ltr:mr-1 rtl:ml-1"
                                        type="button"
                                        onClick={() => resetForm()}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Updating'
                                            : 'Update Password'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
            <div className="mt-6">
                {/* <FormDesription
                    title="Where you're signed in"
                    desc="You're signed in to your account on these devices."
                /> */}
                {/* {data && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-600 mt-6">
                        {data.map((log, index) => (
                            <div
                                key={log.deviceName}
                                className={classNames(
                                    'flex items-center px-4 py-6',
                                    !isLastChild(data, index) &&
                                        'border-b border-gray-200 dark:border-gray-600'
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="text-3xl">
                                        <LoginHistoryIcon type={log.type} />
                                    </div>
                                    <div className="ml-3 rtl:mr-3">
                                        <div className="flex items-center">
                                            <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {log.deviceName}
                                            </div>
                                            {index === 0 && (
                                                <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
                                                    <span className="capitalize">
                                                        {' '}
                                                        Current{' '}
                                                    </span>
                                                </Tag>
                                            )}
                                        </div>
                                        <span>
                                            {log.location} •{' '}
                                            {dayjs
                                                .unix(log.time)
                                                .format('DD-MMM-YYYY, hh:mm A')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )} */}
            </div>
        </>
    )
}

export default Password
