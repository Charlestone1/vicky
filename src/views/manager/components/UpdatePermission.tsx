/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormItem, FormContainer } from '@/components/ui/Form'

import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import store, { useAppDispatch } from '@/store'
import appConfig from '@/configs/app.config'
import axios from 'axios'
import deepParseJson from '@/utils/deepParseJson'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import { fetchManagerData } from '@/store/slices/manager/managerSlice'

interface UpdateManagerPermissionProps extends CommonProps {
    data: {
        id: string
        firstName: string
        lastName: string
    }

    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type UpdateManagerFormSchema = {
    idToAdd: string
}

interface SignInLocation {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    timestamp: string;
    description: string;
    _id: string;
}

interface StaffDetails {
    currentSignInLocation: {
        coordinates: {
            latitude: number;
            longitude: number;
        };
        timestamp: string;
        description: string;
    };
    earningRate: number;
    totalEarning: number;
    signInLocations: SignInLocation[];
    isLoggedIn: boolean;
    currentTrips: any[];
    isAvailableForAppointments: boolean;
    _id: string;
}

interface Staff {
    _id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: string;
    departments: string[];
    staffDetails: StaffDetails;
    signInLocations: SignInLocation[];
    avatarUrl: string;
    avatarImgTag: string;
    __v: number;
    id: string;
}



const validationSchema = Yup.object().shape({
    idToAdd: Yup.string().required('Please select a Staff'),
})
const UpdatePermission = (props: UpdateManagerPermissionProps) => {
    // const { disableSubmit = false, className, setIsOpen } = props
    const [success, setSuccess] = useState(false)
    const [staffData, setStaffData] = useState<Staff[]>([])
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useTimeOutMessage()
    const { updateThisManagerPermission } = useAuth()
    const dispatch = useAppDispatch()


    const managerId = props.data.id


    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)

    const apiPrefix = appConfig.apiPrefix

    useEffect(() => {
        checkPermitted()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkPermitted = async () => {
        setLoading(true);
        let accessToken = (persistData as any).auth.session.token

        function getToken(): string {
            if (!accessToken) {
                const { auth } = store.getState()
                accessToken = auth.session.token
                return accessToken
            }
            return accessToken
        }
        try {
            const response = await axios.get<{ data: Staff[] }>(
                `${apiPrefix}/users/staffs-not-added-for-manager/${managerId}`,
                {
                    headers: {
                        'x-auth-token': getToken(),
                        'Content-Type': 'application/json',
                    },
                }
            )
            // console.log(response.data);
            setStaffData(response.data.data)
            setLoading(false);
            return response.data.data
        } catch (error: any) {
            setLoading(false);
            // setMessage(error.message);
            if (error.message === "Request failed with status code 401") {
                window.location.href = "/logout";
            }
            setMessage(error.response.data.message || 'Server error')
            throw error.message
        }
    }

    const staffOptions = staffData?.map(
        (staff: Staff) => ({
            value: staff._id,
            label: `${staff.firstName} ${staff.lastName} - ${staff.role}`
        })
    )

    const updateManPermission = async (
        values: UpdateManagerFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { idToAdd } = values
        setSubmitting(true)

        // const managerId = `${props?.data?.id}`

        const result = await updateThisManagerPermission(managerId, {
            idToAdd
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchManagerData())
            checkPermitted()
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Permission Granted`} type="success">
                    Successfully granted {props.data.firstName} View Location permission for Staff.
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
                <p>Grant <b><em>{`${props.data.firstName.charAt(0).toUpperCase()}${props.data.firstName.slice(1).toLowerCase()} ${props.data.lastName.charAt(0).toUpperCase()}${props.data.lastName.slice(1).toLowerCase()}`}</em></b> permission to view selected employee location.</p>
            </div>
            <Formik
                initialValues={{
                    idToAdd: ``,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        updateManPermission(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3 mt-4">

                            <FormItem
                                label="Select Employee"
                                invalid={Boolean(
                                    errors.idToAdd && touched.idToAdd
                                )}
                                errorMessage={errors.idToAdd as string}
                            >
                                <Field name="idToAdd">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<UpdateManagerFormSchema>) => (
                                        <Select
                                            isLoading={loading}
                                            field={field}
                                            form={form}
                                            options={staffOptions}
                                            value={staffOptions.filter(
                                                (option) =>
                                                    option.value === values.idToAdd
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
                                    type="submit"
                                // size="sm"
                                // onClick={() => {
                                //     console.log(errors)
                                // }}
                                >
                                    {isSubmitting
                                        ? 'Permitting...'
                                        : 'Permit'}
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

export default UpdatePermission