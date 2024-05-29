import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useAppDispatch } from '@/store'
import { fetchUsersData } from '@/store/slices/users/userSlice'
// import { fetchEntryData } from '@/store/slices/entry/entrySlice'
// import { useParams } from 'react-router-dom'
// import { fetchstaffCheckinData } from '@/store/slices/staff-checkin/staffCheckinSlice'


interface CheckinFormProps extends CommonProps {
    data: {
        checkInType: string,
        staffId: string | undefined
    }
    disableSubmit?: boolean
    signInUrl?: string
    setIsOpen: (value: boolean) => void
}

type CheckinFormSchema = {
    description: string
    coordinates: {
        latitude: number,
        longitude: number
    }
}

const validationSchema = Yup.object().shape({
    description: Yup.string(),
    coordinates: Yup.object().shape({
        latitude: Yup.number(),
        longitude: Yup.number()
    })
})

const Checkin = (props: CheckinFormProps) => {
    const [success, setSuccess] = useState(false)
    const { checkInStaff } = useAuth()
    const dispatch = useAppDispatch()
    const [message, setMessage] = useTimeOutMessage()
    // const { invoiceIdParams } = useParams<{ invoiceIdParams: string }>()

    const descr = "7723 Maplewood Ave, North Richland Hills, TX 76180, USA"
    const lati = 32.839190
    const longi = -97.215150

    const checkInThisStaff = async (
        values: CheckinFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { description, coordinates } = values
        setSubmitting(true)

        const checkInType = `${props?.data?.checkInType}`
        const staffId = `${props?.data?.staffId}`


        const result = await checkInStaff(checkInType, staffId, {
            description,
            coordinates,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
            // console.log('failed')
        } else if (result?.status === 'success') {
            dispatch(fetchUsersData())
            // dispatch(fetchstaffCheckinData(staffId))
            setSuccess(true)
            setMessage(result.message)
            props?.setIsOpen(false)
            toast.push(
                <Notification title={`Successfully Checked In`} type="success">
                    Successfully Checked In this Staff.
                </Notification>
            )
        }
        setSubmitting(false)
    }

    function closeDialogBox() {
        props?.setIsOpen(false)
    }

    return (
        <div className='flex flex-col'>
            <h6 className='text-gray-500'>Are you sure you want to Check-In this Staff?</h6>
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
                    description: descr,
                    coordinates: {
                        latitude: lati,
                        longitude: longi,
                    }
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (props.disableSubmit) {
                        checkInThisStaff(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-x-3">

                            <div className='hidden'>
                                <FormItem
                                    label="Description"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                >
                                    <Field
                                        disabled
                                        type="text"
                                        // size="sm"
                                        autoComplete="off"
                                        name="description"
                                        placeholder="Description"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className='hidden'>
                                <FormItem
                                    label="Latitude"
                                    invalid={errors.coordinates?.latitude && touched.coordinates?.latitude}
                                    errorMessage={errors.coordinates?.latitude}
                                >
                                    <Field
                                        disabled
                                        type="text"
                                        // size="sm"
                                        autoComplete="off"
                                        name={`coordinates.latitude`}
                                        placeholder="Latitude"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className='hidden'>
                                <FormItem
                                    label="Latitude"
                                    invalid={errors.coordinates?.longitude && touched.coordinates?.longitude}
                                    errorMessage={errors.coordinates?.longitude}
                                >
                                    <Field
                                        disabled
                                        type="text"
                                        // size="sm"
                                        autoComplete="off"
                                        name={`coordinates.longitude`}
                                        placeholder="Longitude"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

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
                                        ? 'Checking In...'
                                        : 'CheckIn'}
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

export default Checkin