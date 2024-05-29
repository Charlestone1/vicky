import { useState } from 'react'
import { useAppDispatch } from '@/store'
import { Button, Select } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

// import type { InputHTMLAttributes } from 'react'
import { useParams } from 'react-router-dom'
import type { CommonProps } from '@/@types/common'
import { fetchMonthlyCheckinData } from '@/store/slices/check-report/checkreportSlice'
import { HiOutlineFilter } from 'react-icons/hi'

interface CheckinreportProps extends CommonProps {
    disableSubmit?: boolean
}

// type Option = {
//     value: string
//     label: string
// }

// const yearOptions: Option[] = [
//     { value: '2023', label: '2023' },
//     { value: '2024', label: '2024' },
// ]

const currentYear = new Date().getFullYear(); // Get current year dynamically
const yearOptions = Array.from({ length: currentYear - 2022 }, (_, i) => ({
    value: `${2023 + i}`,
    label: `${2023 + i}`,
}));

const monthOptions = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'June', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
];

type YearFormSchema = {
    staffId: string | undefined
    monthName: string
    year: string
}

// const validationSchema = Yup.object().shape({
//     staffId: Yup.string(),
//     monthName: Yup.string().required('Select Month'),
//     year: Yup.string().required('Select Year'),
// })

const validationSchema = Yup.object().shape({
    staffId: Yup.string(),
    monthName: Yup.string().required('Select Month'),
    year: Yup.string()
        .required('Select Year')
        .test('futureDate', 'Past Based', function (value) {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth(); // Note: Month is zero-based index
            const selectedYear = parseInt(value, 10);
            const selectedMonth = monthOptions.findIndex(option => option.value === this.parent.monthName);

            if (selectedYear > currentYear) {
                return false; // Reject if selected year is in the future
            } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
                return false; // Reject if selected month is in the future of the current year
            }

            return true; // Passes the validation
        })
});

const MonthlyCheckinForm = (props: CheckinreportProps) => {
    const { disableSubmit = false } = props
    const [submitting, setSubmitting] = useState(false)
    const { staffId } = useParams()
    const dispatch = useAppDispatch()

    const checkMonthlyOpenReport = async (
        values: YearFormSchema
    ) => {
        const {
            staffId,
            monthName,
            year,
        } = values
        setSubmitting(true)

        try {
            await dispatch(fetchMonthlyCheckinData({ staffId, monthName, year }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error);

            toast.push(
                <Notification title={`Failed to Fetch Report`} type="danger">
                    {error.message}
                </Notification>
            );
        }
        setSubmitting(false)
    }
    return (
        <div className='h-10'>
            <Formik
                initialValues={{
                    staffId: staffId,
                    monthName: 'February',
                    year: '2024',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        checkMonthlyOpenReport(values)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer className="flex gap-x-1 xxs:gap-x-2">
                            <div className='flex gap-x-1 xxs:gap-x-2'>
                                <FormItem
                                    invalid={errors.monthName && touched.monthName}
                                    errorMessage={errors.monthName}
                                >
                                    <Field name="monthName">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<YearFormSchema>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                size='sm'
                                                className='w-[7.3rem]'
                                                // menuPlacement='top'
                                                // maxMenuHeight={6}
                                                options={monthOptions}
                                                value={monthOptions.filter(
                                                    (option) =>
                                                        option.value ===
                                                        values.monthName
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
                                    // label="Select Year"
                                    invalid={errors.year && touched.year}
                                    errorMessage={errors.year}
                                >
                                    <Field name="year">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<YearFormSchema>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                size='sm'
                                                className='w-24'
                                                options={yearOptions}
                                                value={yearOptions.filter(
                                                    (option) =>
                                                        option.value ===
                                                        values.year
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
                            </div>

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

export default MonthlyCheckinForm