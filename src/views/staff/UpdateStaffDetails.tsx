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
    { value: 'STAFF', label: 'STAFF' },
    { value: 'porter', label: 'Porter' },
]

type UpdateStaffFormSchema = {
    first_name: string
    last_name: string
    type: string
    // password: string
}

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Please enter your first name'),
    last_name: Yup.string().required('Please enter a first name'),
    type: Yup.string().required('Please select type'),
})

const UpdateStaffDetails = (props: UpdatedStaffFormProps) => {
    // const { disableSubmit = false, className, setIsOpen } = props
    const [success, setSuccess] = useState(false)
    const { updateStaff } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()
    const [deptmentData, setDeptmentData] = useState<DepartmentData[]>([])

    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)
    const baseUrl = appConfig.apiPrefix

    useEffect(() => {
        fetchAllDepartmentData()
    }, [])

    const fetchAllDepartmentData = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let accessToken = (persistData as any)?.auth?.session?.token

        function getToken() {
            if (!accessToken) {
                const { auth } = store.getState()
                accessToken = auth.session.token
                return accessToken
            }
            return accessToken
        }

        try {
            const response = await axios.get(`${baseUrl}/departments`, {
                headers: {
                    'x-auth-token': getToken(),
                    'Content-Type': 'application/json',
                },
            })

            const responseData = response.data.data
            setDeptmentData(responseData)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log('Error: ', error)
            if (error.message === "Request failed with status code 401") {
                window.location.href = "/logout";
            }
        }
    }

    const departmentOptions = deptmentData?.map(
        (department: DepartmentData) => ({
            value: department._id,
            label: department.description,
        })
    )

    const updateUserDets = async (
        values: UpdateStaffFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { first_name, last_name, type } = values
        setSubmitting(true)

        const employeeId = `${props?.data?.id}`


        const result = await updateStaff(employeeId, {
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
                <Notification title={`Successfully Added Staff`} type="success">
                    Successfully Updated staff details.
                </Notification>
            )
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
                    type: `${props?.data?.type}`,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        updateUserDets(values, setSubmitting)
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
                                >
                                    {isSubmitting
                                        ? 'Updating Details...'
                                        : 'Update Details'}
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

export default UpdateStaffDetails
