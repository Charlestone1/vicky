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
        firstName: string
        lastName: string
        role: string
        departments: string[]
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
    firstName: string
    lastName: string
    role: string
    departments: string[]
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter a first name'),

    role: Yup.string().required('Please select role'),
    departments: Yup.array()
        .min(1, 'Select at least one Department')
        .test(
            'check-departments',
            'Please select a department',
            function (value) {
                if (value && value[0] && value[0].length < 1) {
                    return this.createError({
                        path: 'departments',
                        message: 'select a department',
                    })
                }
                return true
            }
        ),
})

const DeleteStaff = (props: UpdatedStaffFormProps) => {
    const [success, setSuccess] = useState(false)
    const { deleteOneStaff } = useAuth()
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
        } catch (error: any) {
            console.log('Error: ', error)
            if (error.message === "Request failed with status code 401") {
                window.location.href = "/logoutt";
            }
        }
    }

    const departmentOptions = deptmentData?.map(
        (department: DepartmentData) => ({
            value: department._id,
            label: department.description,
        })
    )

    const deleteThisUser = async (
        values: UpdateStaffFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { firstName, lastName, role, departments } = values
        setSubmitting(true)

        const employeeId = `${props?.data?.id}`


        const result = await deleteOneStaff(employeeId, {
            firstName,
            lastName,
            role,
            departments,
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
                    Successfully Deleted {firstName} from the user list.
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
                    firstName: `${props?.data?.firstName}`,
                    lastName: `${props?.data?.lastName}`,
                    role: `${props?.data?.role}`,
                    departments: props?.data?.departments.map((item) => item),
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
                                invalid={errors.firstName && touched.firstName}
                                errorMessage={errors.firstName}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="firstName"
                                    placeholder="Enter First Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Last Name"
                                invalid={errors.lastName && touched.lastName}
                                errorMessage={errors.lastName}
                            >
                                <Field
                                    disabled
                                    type="text"
                                    // size="sm"
                                    autoComplete="off"
                                    name="lastName"
                                    placeholder="Enter Last Name"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="Select Staff Role"
                                invalid={errors.role && touched.role}
                                errorMessage={errors.role}
                            >
                                <Field name="role">
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
                                                    option.value === values.role
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

                            <FormItem
                                label="Select Department"
                                invalid={Boolean(
                                    errors.departments && touched.departments
                                )}
                                errorMessage={errors.departments as string}
                            >
                                <Field name="departments">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<UpdateStaffFormSchema>) => (
                                        <Select<Option, true>
                                            isMulti
                                            componentAs={CreatableSelect}
                                            field={field}
                                            // size="sm"
                                            isDisabled={true}
                                            form={form}
                                            options={departmentOptions}
                                            value={departmentOptions.filter(
                                                (option) =>
                                                    values.departments.includes(
                                                        option.value
                                                    )
                                            )}
                                            onChange={(selectedOptions) => {
                                                const selectedValues =
                                                    selectedOptions.map(
                                                        (option) => option.value
                                                    )
                                                form.setFieldValue(
                                                    field.name,
                                                    selectedValues
                                                )
                                            }}
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
