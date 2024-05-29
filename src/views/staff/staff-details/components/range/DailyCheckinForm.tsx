import { useState } from 'react'
import { useAppDispatch } from '@/store'
import { Button, DatePicker } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { useParams } from 'react-router-dom'
import type { CommonProps } from '@/@types/common'
import { apiCheckInDaily } from '@/store/slices/check-report/checkreportSlice'
import { HiOutlineFilter } from 'react-icons/hi'

interface CheckinreportProps extends CommonProps {
    disableSubmit?: boolean
}

type YearFormSchema = {
    staffId: string | undefined
    day: string
}

const validationSchema = Yup.object().shape({
    staffId: Yup.string(),
    day: Yup.string()
        .required('Select Date')
        .test('futureDate', 'Future dates are not allowed', function (value) {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
            if (selectedDate.getTime() > currentDate.getTime()) {
                return false; // Reject if selected date is in the future
            }
            return true; // Passes the validation
        }),
})

const DailyCheckinForm = (props: CheckinreportProps) => {
    const { disableSubmit = false } = props
    const [submitting, setSubmitting] = useState(false)
    const { staffId } = useParams()
    const dispatch = useAppDispatch()


    const checkWeeklyOpenReport = async (
        values: YearFormSchema
    ) => {
        const {
            staffId,
            day,
        } = values
        setSubmitting(true)

        try {
            await dispatch(apiCheckInDaily({ staffId, day }))
        } catch (error) {
            console.log(error);
        }
        setSubmitting(false)
    }


    return (
        <div className='h-10'>
            <Formik
                initialValues={{
                    staffId: staffId,
                    day: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        checkWeeklyOpenReport(values)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors }) => (
                    <Form>
                        <FormContainer className="flex gap-x-3">

                            <FormItem
                                invalid={errors.day && touched.day}
                                errorMessage={errors.day}
                            >
                                <Field name="day">
                                    {({ field, form }: FieldProps) => (
                                        <DatePicker
                                            inputFormat="MMM, DD YYYY"
                                            size='sm'
                                            field={field}
                                            form={form}
                                            value={field.value}
                                            placeholder="Select Date"
                                            onChange={(day) => {
                                                form.setFieldValue(field.name, day)
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <div className="col-span-2">
                                <Button
                                    icon={<HiOutlineFilter />}
                                    loading={submitting}
                                    variant="solid"
                                    type="submit"
                                    size='sm'
                                >
                                    {submitting
                                        ? 'Filtering...'
                                        : 'Filter'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default DailyCheckinForm