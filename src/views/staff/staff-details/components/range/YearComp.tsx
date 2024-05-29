import { useState } from 'react'
import { useAppDispatch } from '@/store'
import { Button, Select } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { useParams } from 'react-router-dom'
import type { CommonProps } from '@/@types/common'
import { apiCheckInYearly } from '@/store/slices/check-report/checkreportSlice'
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

type YearFormSchema = {
    staffId: string | undefined
    year: string
}

const validationSchema = Yup.object().shape({
    staffId: Yup.string(),
    year: Yup.string().required('Select Year'),
})

const YearComp = (props: CheckinreportProps) => {
    const { disableSubmit = false } = props
    const [submitting, setSubmitting] = useState(false)
    const { staffId } = useParams()
    const dispatch = useAppDispatch()

    const checkYearlyOpenReport = async (
        values: YearFormSchema
    ) => {
        const {
            staffId,
            year,
        } = values
        setSubmitting(true)

        try {
            await dispatch(apiCheckInYearly({ staffId, year }))
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
                    year: '2024',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        checkYearlyOpenReport(values)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer className="flex gap-x-3">
                            {/* <div className='hidden'>
                                <FormItem
                                    // label="First Name"
                                    invalid={errors.staffId && touched.staffId}
                                    errorMessage={errors.staffId}
                                >
                                    <Field
                                        type="text"
                                        size="sm"
                                        autoComplete="off"
                                        name="staffId"
                                        placeholder="Enter First Name"
                                        component={Input}
                                    />
                                </FormItem>

                            </div> */}
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

                            {/* <div className="mt-4 text-center"></div> */}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default YearComp