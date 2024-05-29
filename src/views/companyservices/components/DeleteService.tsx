import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
// import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
// import { Select } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
import { useAppDispatch } from '../../account/ActivityLog/store'
import { useState } from 'react'

interface AddNewServicesFormProps extends CommonProps {
  data: {
    id: string
    name: string
    type: string
  }
  disableSubmit?: boolean
  setIsOpen: (value: boolean) => void
}

// type Option = {
//   value: string
//   label: string
// }

// const typeOptions: Option[] = [
//   { value: 'installation', label: 'Installation' },
//   { value: 'removal', label: 'Removal' },
// ]

type EditServicesFormSchema = {
  type: string
  name: string
}

const validationSchema = Yup.object().shape({
  type: Yup.string(),
  name: Yup.string()
})

const DeleteService = (props: AddNewServicesFormProps) => {
  const { deleteService } = useAuth()
  const [message, setMessage] = useTimeOutMessage()
  const [success, setSuccess] = useState(false)

  const dispatch = useAppDispatch()

  const deleteServices = async (
    values: EditServicesFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const { type, name } = values

    setSubmitting(true)
    const serviceId = `${props?.data?.id}`
    const result = await deleteService(serviceId, { type, name })

    if (result?.status === 'failed') {
      setMessage(result.message)
      toast.push(
        <Notification
          title={`Add Services Request Failed`}
          type="danger"
        >
          {message}
        </Notification>
      )
    } else if (result?.status === 'success') {
      setSuccess(true)
      setMessage(result.message)
      dispatch(fetchServiceData())
      props?.setIsOpen(false)
      toast.push(
        <Notification
          title={`Service Deleted Successfully`}
          type="success"
        >
          {name} removed from Services List
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
          type: `${props?.data?.type}`,
          name: `${props?.data?.name}`,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (props?.disableSubmit) {
            deleteServices(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormContainer className="grid grid-cols-2 gap-x-3">
              {/* <FormItem
                label="Service Category"
                invalid={errors.type && touched.type}
                errorMessage={errors.type}
              >
                <Field name="type">
                  {({
                    field,
                    form,
                  }: FieldProps<EditServicesFormSchema>) => (
                    <Select
                      field={field}
                      form={form}
                      options={typeOptions}
                      value={typeOptions.filter(
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
              </FormItem> */}
              <FormItem
                label="Service Name"
              >
                <Field
                  disabled
                  type="text"
                  value={`${props?.data?.name}`}
                  autoComplete="off"
                  name="name"
                  placeholder="Enter Service Name"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Service Category"
              >
                <Field
                  disabled
                  type="text"
                  value={`${props?.data?.type}`}
                  autoComplete="off"
                  name="type"
                  placeholder="Enter Type"
                  component={Input}
                />
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
                  color='red'
                  type="submit"
                  disabled={isSubmitting}
                // onClick={() => console.log(errors)}
                >
                  {isSubmitting
                    ? 'Deleting...'
                    : 'Delete'}
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

export default DeleteService