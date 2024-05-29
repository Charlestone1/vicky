/* eslint-disable react-hooks/exhaustive-deps */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
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

interface RegisterUserFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type Option = {
    value: string
    label: string
}

// const roleOptions: Option[] = [
//     { value: 'staff', label: 'Staff' },
//     { value: 'manager', label: 'Manager' },
// ]

type RegisterStaffFormSchema = {
    firstName: string
    lastName: string
    password: string
    email: string
    role: string
    departments: string[]
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter a first name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please enter an email'),
    password: Yup.string().required('Please enter password'),
    // role: Yup.string().required('Please select role'),
    departments: Yup.array()
        .min(1, 'Select at least one Department')
        .test(
            'check-departments',
            'Please select a department',
            function (value) {
                if (value && value[0] && value[0].length < 1) {
                    // console.log(value[0].length)
                    return this.createError({
                        path: 'departments',
                        message: 'select a department',
                    })
                }
                return true
            }
        ),
})

const RegisterManager = (props: RegisterUserFormProps) => {
    const { disableSubmit = false, className, setIsOpen } = props
    const [success, setSuccess] = useState(false)
    // const [departmentsOp, setDepartmentsOp] = useState<DepartmentState>()
    const { registerManager } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()
    const [deptmentData, setDeptmentData] = useState<DepartmentData[]>([])

    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)
    const baseUrl = appConfig.apiPrefix

    // useEffect(() => {
    //   dispatch(fetchStaffData())
    // }, [])

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
            //   console.log(responseData)
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

    const createUser = async (
        values: RegisterStaffFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { firstName, lastName, email, password, role, departments } =
            values
        setSubmitting(true)
        const result = await registerManager({
            firstName,
            lastName,
            email,
            password,
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
            setIsOpen(false)
            toast.push(
                <Notification
                    title={`Successfully Added Manager`}
                    type="success"
                >
                    Successfully Added {firstName} to as a Manger.
                </Notification>
            )
            // console.log('success')
        }

        setSubmitting(false)
    }

    function closeDialogBox() {
        setIsOpen(false)
    }

    return (
        <div className={className}>
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
                    firstName: '',
                    lastName: '',
                    password: '',
                    email: '',
                    role: '',
                    departments: ['64fe27f8fc7bf540b156ee67'],
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.role = 'manager'
                    console.log('values:', values)
                    if (!disableSubmit) {
                        createUser(values, setSubmitting)
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
                                    type="text"
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
                                    type="text"
                                    autoComplete="off"
                                    name="lastName"
                                    placeholder="Enter Last Name"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            {/* <FormItem
                                label="Select Staff Role"
                                invalid={errors.role && touched.role}
                                errorMessage={errors.role}
                            >
                                <Field name="role">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<RegisterStaffFormSchema>) => (
                                        <Select
                                            field={field}
                                            form={form}
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
                            </FormItem> */}
                            <FormItem
                                label="Select Staff Department"
                                invalid={Boolean(
                                    errors.departments && touched.departments
                                )}
                                errorMessage={errors.departments as string}
                            >
                                <Field name="departments">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<RegisterStaffFormSchema>) => (
                                        <Select<Option, true>
                                            isMulti
                                            componentAs={CreatableSelect}
                                            field={field}
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
                                    type="submit"
                                    onClick={() => console.log(errors)}
                                >
                                    {isSubmitting
                                        ? 'Saving Manager...'
                                        : 'Save'}
                                </Button>
                            </div>

                            <div className="mt-4 text-center"></div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RegisterManager
