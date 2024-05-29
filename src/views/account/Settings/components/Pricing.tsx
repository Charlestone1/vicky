import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {Button} from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
// import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { Select } from '@/components/ui'
import CreatableSelect from 'react-select/creatable'

interface RegisterUserFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean)=> void
}

type Option = {
    value: string
    label: string
}

const roleOptions: Option[] = [
    { value: "tinter", label: "Tinter" },
    { value: "manager", label: "Manager"}
]

const departmentOptions: Option[] = [
    { value: '64dcb2798091cabc0a794885', label: 'Tester' },
    { value: 'TINTING', label: 'Tinting' },
    { value: 'DEPT B', label: 'DeptB' },
    { value: 'DEPT C', label: 'DeptC' },
    { value: 'DEPT D', label: 'DeptD' },
]


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
    role: Yup.string().required('Please select role'),
    departments: Yup.array()
      .min(1, 'Select at least one Department')
      .test('check-departments', 'Please select a department', function (
        value
      ) {
        if (value && value[0] && value[0].length < 1) {
            console.log(value[0].length)
          return this.createError({
            path: 'departments',
            message: 'select a department',
          });
        }
        return true;
      }),
  });



const Pricing = (props: RegisterUserFormProps) => {
    const {disableSubmit = false, className } = props

    const { registerStaff } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    const createUser = async (
        values: RegisterStaffFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { firstName, lastName, email, password, role, departments } = values
        setSubmitting(true)
        const result = await registerStaff({ firstName, lastName, email, password, role, departments })

        if (result?.status === 'failed') {
            setMessage(result.message)
            console.log("failed");
        }else if(result?.status === 'success'){
            setMessage(result.message)
            console.log("success");
            
        }
        

        setSubmitting(false)
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
                    firstName: '',
                    lastName: '',
                    password: '',
                    email: '',
                    role: '',
                    departments: ['64dcb2798091cabc0a794885'],
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log('values:', values);
                    if (!disableSubmit) {
                        createUser(values, setSubmitting)
                        console.log("before else create User");
                    } else {
                        setSubmitting(false)
                        console.log("after else create User");
                    }
                }}
            >
                {({values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className='grid grid-cols-2 gap-x-3'>
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
                            <FormItem
                                
                                label="Select Staff Role"
                                invalid={errors.role && touched.role}
                                errorMessage={errors.role}
                            >
                                <Field name="role">
                                    {({ field, form }: FieldProps<RegisterStaffFormSchema>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={roleOptions}
                                            value={roleOptions.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.role
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
                                
                                label="Select Staff Department"
                                invalid={Boolean(
                                    errors.departments &&
                                        touched.departments
                                )}
                                errorMessage={errors.departments as string}
                            >
                                <Field name="departments">
                                    {({ field, form }: FieldProps<RegisterStaffFormSchema>) => (
                                        <Select<Option, true>
                                            isMulti
                                            componentAs={CreatableSelect}
                                            field={field}
                                            form={form}
                                            options={departmentOptions}
                                            value={departmentOptions.filter((option) =>
                                                values.departments.includes(option.value)
                                              )}
                                            onChange={(selectedOptions) => {
                                                const selectedValues = selectedOptions.map((option) => option.value);
                                                form.setFieldValue(field.name, selectedValues);
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
                                >
                                    Cancel
                                </Button>
                                <Button
                                    
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    onClick={()=> 
                                        console.log(errors)
                                    }
                                >
                                    {isSubmitting
                                        ? 'Saving Account...'
                                        : 'Save'}
                                </Button>
                            </div>
                            
                            <div className="mt-4 text-center">
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
            
        </div>
  )
}

export default Pricing