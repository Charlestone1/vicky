import { FormItem, FormContainer } from '@/components/ui/Form'

import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
// import PasswordInput from '@/components/shared/PasswordInput'
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
import { useAppDispatch } from '@/store'
import { LoggedStaffDetails, fetchManagerData } from '@/store/slices/manager/managerSlice'

interface UpdateManagerPermissionProps extends CommonProps {
    data: {
        id: string
        firstName: string
        lastName: string
        granted?: LoggedStaffDetails[]
    }

    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type UpdateManagerFormSchema = {
    idToRemove: string
}

const validationSchema = Yup.object().shape({
    idToRemove: Yup.string().required('Please select a Staff'),
})

const RemovePermission = (props: UpdateManagerPermissionProps) => {
    // const { disableSubmit = false, className, setIsOpen } = props
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const { removeManagerPermission } = useAuth()
    const dispatch = useAppDispatch()

    const staffOptions = props.data?.granted?.map((staff) => ({
        value: staff._id,
        label: `${staff.firstName} ${staff.lastName}`,
    })) || [];

    // console.log(props.data.granted);

    const removeManagerPermit = async (
        values: UpdateManagerFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { idToRemove } = values
        setSubmitting(true)




        const managerId = `${props?.data?.id}`

        const result = await removeManagerPermission(managerId, {
            idToRemove
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchManagerData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Permission Granted`} type="success">
                    Successfully Removed {props.data.firstName}{'`s'} view permission for the selected Staff.
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
                <p>Remove <b><em>{`${props.data.firstName.charAt(0).toUpperCase()}${props.data.firstName.slice(1).toLowerCase()} ${props.data.lastName.charAt(0).toUpperCase()}${props.data.lastName.slice(1).toLowerCase()}`}</em></b> permission to view selected employee location.</p>
            </div>
            <Formik
                initialValues={{
                    idToRemove: ``,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    // console.log('values:', values)
                    if (props.disableSubmit) {
                        removeManagerPermit(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 mt-4">

                            <FormItem
                                label="Select Employee"
                                invalid={Boolean(
                                    errors.idToRemove && touched.idToRemove
                                )}
                                errorMessage={errors.idToRemove as string}
                            >
                                <Field name="idToRemove">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<UpdateManagerFormSchema>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={staffOptions}
                                            value={staffOptions?.filter(
                                                (option) =>
                                                    option.value === values.idToRemove
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
                            {/* </div> */}

                            <div className="col-span-2 text-right mt-6">
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
                                    color='red'
                                    type="submit"
                                    // size="sm"
                                    onClick={() => {
                                        console.log(errors)
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Unauthorizing...'
                                        : 'Unauthorize'}
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

export default RemovePermission