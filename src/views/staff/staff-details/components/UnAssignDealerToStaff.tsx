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
import { fetchStaffData } from '@/store/slices/staff/staffSlice'
import store, { useAppDispatch } from '@/store'
import appConfig from '@/configs/app.config'
import axios from 'axios'
import deepParseJson from '@/utils/deepParseJson'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'


interface UnAssignDealerToStaffProps extends CommonProps {
    data: {
        id: string
        firstName: string
        lastName: string
        customer: Customer[]
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}
type UnAssignDealerFormSchema = {
    customerId: string
    remove: boolean
}

interface Option {
    value: string
    label: string
}

interface Customer {
    id: string;
    name: string;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface SignInLocation {
    coordinates: Coordinates;
    timestamp: string;
    description: string;
    _id: string;
}

interface EarningRate {
    earningRate: number;
    serviceId: {
        _id: string;
        type: string;
        name: string;
        id: string;
    };
    _id: string;
}

interface EarningHistory {
    timestamp: string;
    amountEarned: number;
    _id: string;
}

interface StaffDetails {
    currentSignInLocation: {
        coordinates: Coordinates;
        timestamp: string;
        description: string;
    };
    isAvailableForAppointments: boolean;
    earningRates: EarningRate[];
    totalEarning: number;
    _id: string;
    signInLocations: SignInLocation[];
    earningHistory: EarningHistory[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentTrips: any[];
    isLoggedIn: boolean;
    mostRecentScannedTime: string;
    assignedDealerships: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        id: string;
    }[];
}

interface Staff {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    departments: string[];
    staffDetails: StaffDetails;
    avatarUrl: string;
    avatarImgTag: string;
    __v: number;
    id: string;
};




const validationSchema = Yup.object().shape({
    customerId: Yup.string().required('Please select a Staff'),
    remove: Yup.boolean().required('select status')
})

const UnAssignDealerToStaff = (props: UnAssignDealerToStaffProps) => {
    const [success, setSuccess] = useState(false)
    const [staffData, setStaffData] = useState<Staff>()
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useTimeOutMessage()
    const { assignDealershipToStaff } = useAuth()


    const staffId = props.data.id


    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)

    const apiPrefix = appConfig.apiPrefix

    useEffect(() => {
        checkAssigned()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkAssigned = async () => {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            const response = await axios.get<{ data: Staff }>(
                `${apiPrefix}/users/${staffId}`,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setLoading(false);
            // setMessage(error.message);
            setMessage(error.response.data.message || 'Server error')
            if (error.message === "Request failed with status code 401") {
                window.location.href = "/logout";
            }
            throw error.message
        }
    }

    const dispatch = useAppDispatch()
    // const { data } = useAppSelector((state) => state.quickbookscustomer)

    const staffOptions: Option[] = staffData?.staffDetails?.assignedDealerships?.map(
        (customer) => ({
            value: `${customer.id}`,
            label: `${customer.firstName} ${customer.lastName}`
        })
    ) ?? [];

    const updateManPermission = async (
        values: UnAssignDealerFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { customerId, remove } = values
        setSubmitting(true)

        // const managerId = `${props?.data?.id}`

        const result = await assignDealershipToStaff(staffId, {
            customerId,
            remove
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else if (result?.status === 'success') {
            dispatch(fetchStaffData())
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Dealer Unassigned`} type="success">
                    Successfully Unassigned Dealer to {props.data.firstName}.
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
            <div>
                <p>Unassign a dealer to  <b><em>{`${props.data.firstName.charAt(0).toUpperCase()}${props.data.firstName.slice(1).toLowerCase()} ${props.data.lastName.charAt(0).toUpperCase()}${props.data.lastName.slice(1).toLowerCase()}`}</em></b>.</p>
            </div>
            <Formik
                initialValues={{
                    customerId: ``,
                    remove: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.remove = true

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
                                label="Select Dealer"
                                invalid={Boolean(
                                    errors.customerId && touched.customerId
                                )}
                                errorMessage={errors.customerId as string}
                            >
                                <Field name="customerId">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<UnAssignDealerFormSchema>) => (
                                        <Select
                                            isLoading={loading}
                                            field={field}
                                            form={form}
                                            options={staffOptions}
                                            value={staffOptions.filter(
                                                (option) =>
                                                    option.value === values.customerId
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

                            <div className="col-span-2 text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    // size="sm"
                                    onClick={closeDialogBox}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    disabled={isSubmitting}
                                    // size="sm"
                                    onClick={() => {
                                        console.log(errors)
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Unassigning...'
                                        : 'Unassign'}
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

export default UnAssignDealerToStaff