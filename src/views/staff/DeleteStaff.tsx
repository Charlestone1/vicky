/* eslint-disable react-hooks/exhaustive-deps */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
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
import CreatableSelect from 'react-select/creatable'
import { useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import store, { useAppDispatch } from '@/store'
import { fetchStaffData } from '@/store/slices/staff/staffSlice'
import { DepartmentData } from '@/@types/auth'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import appConfig from '@/configs/app.config'
import axios from 'axios'

interface UpdatedStaffFormProps extends CommonProps {
    data: {
        id: string
        first_name: string
        last_name: string
        type: string
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type Option = {
    value: string
    label: string
}

const roleOptions: Option[] = [
    { value: 'staff', label: 'Staff' },
    { value: 'porter', label: 'Porter' },
]

type UpdateStaffFormSchema = {
    first_name: string
    last_name: string
    type: string
}

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Enter first name'),
    last_name: Yup.string().required('Enter a last name'),
    type: Yup.string().required('Please select type'),
})

const DeleteStaff = (props: UpdatedStaffFormProps) => {
    const [success, setSuccess] = useState(false)
    const { deleteOneStaff } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()


    const deleteThisUser = async (
        values: UpdateStaffFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { first_name, last_name, type } = values
        setSubmitting(true)

        const employeeId = `${props?.data?.id}`


        const result = await deleteOneStaff(employeeId, {
            first_name,
            last_name,
            type,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchStaffData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Deleted Staff`} type="success">
                    Successfully Deleted {first_name} from the Staff list.
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
            <Formik
                initialValues={{
                    first_name: `${props?.data?.first_name}`,
                    last_name: `${props?.data?.last_name}`,
                    type: `${props?.data?.type}`
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        deleteThisUser(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">
                            <FormItem
                                label="First Name"
                                invalid={errors.first_name && touched.first_name}
                                errorMessage={errors.first_name}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Last Name"
                                invalid={errors.last_name && touched.last_name}
                                errorMessage={errors.last_name}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="Select Staff Role"
                                invalid={errors.type && touched.type}
                                errorMessage={errors.type}
                            >
                                <Field name="type">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<UpdateStaffFormSchema>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            isDisabled={true}
                                            options={roleOptions}
                                            value={roleOptions.filter(
                                                (option) =>
                                                    option.value === values.type
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
                                    // size="sm"
                                    onClick={closeDialogBox}
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
                                        ? 'Deleting User...'
                                        : 'Delete'}
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

export default DeleteStaff
