import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { User, fetchUsersData } from '@/store/slices/users/userSlice'
import { useParams } from 'react-router-dom'
import { fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
import { Button, Card, Dialog, Spinner, Tag } from '@/components/ui'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import AddCustomerStaffCanSee from './components/AddCustomerStaffCanSee'


type CustomerInfoFieldProps = {
    title?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: string | any
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div className='max-w-[48]'>
            <span>{title}</span>
            <p className=" truncate text-gray-700 dark:text-gray-200 font-semibold ">
                {value}
            </p>
        </div>
    )
}

const StaffDetails = () => {
    const [oneUser, setOneUser] = useState<User[]>([])
    const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false)
    const [addCustomertoStaff, setAddCustomertoStaff] = useState<{
        staffId: string | undefined
        firstName: string
        lastName: string
        permittedCustomers: string[]
    }>()

    const dispatch = useAppDispatch()
    const { data, loading } = useAppSelector((state) => state.user)

    const { staffId } = useParams()

    useEffect(() => {
        dispatch(fetchServiceData())
        dispatch(fetchUsersData())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        try {
            if (data) {
                const singleStaff = data?.filter((item) => {
                    return item.id === staffId
                })

                setOneUser(singleStaff)
            }
        } catch (error) {
            console.log(error as TypeError)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const openUpdateDialog = () => {
        setUpdateDialogIsOpen(true)
    }

    const onUpdateDialogClose = () => {
        setUpdateDialogIsOpen(false)
    }

    return (
        <div>

            <div className="grid md:grid-cols-3 gap-3 min-h-[10rem] mb-8">
                <Card className="col-span-3 lg:col-span-1">
                    <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                        {
                            loading ? (<>
                                <div className="flex justify-center items-center h-[10rem]">
                                    <Spinner size="40px" />
                                </div>
                            </>) : (<>

                                <div className="grid grid-cols-1 gap-y-2 mt-1">
                                    <h4 className="mb-2 text-[#4F46E5]">
                                        {loading ? (
                                            ''
                                        ) : (
                                            <span className="capitalize ">
                                                {oneUser && loading ? "" : `${oneUser[0]?.firstName} ${oneUser[0]?.lastName}`}
                                            </span>
                                        )}
                                    </h4>
                                    {/* <CustomerInfoField
                                        title="Staff ID"
                                        value={loading ? '' : oneUser && oneUser[0]?._id}
                                    /> */}
                                    <div className='flex justify-between'>
                                        <CustomerInfoField
                                            title="Role"
                                            value={
                                                loading ? '' : oneUser && oneUser[0]?.role
                                            }
                                        />
                                        {
                                            oneUser[0]?.role === "staff" &&
                                            <Button
                                                icon={<HiOutlineUserPlus />}
                                                className=""
                                                size="xs"
                                                variant='twoTone'
                                                onClick={() => {
                                                    setAddCustomertoStaff({
                                                        staffId: staffId,
                                                        firstName: oneUser[0]?.firstName,
                                                        lastName: oneUser[0]?.lastName,
                                                        permittedCustomers: oneUser[0]?.staffDetails?.permittedCustomers || []
                                                    })
                                                    openUpdateDialog()
                                                }} >Assign Customer</Button>
                                        }
                                    </div>
                                    <CustomerInfoField
                                        title="Email"
                                        value={
                                            loading ? '' : oneUser && oneUser[0]?.email
                                        }
                                    />
                                    {oneUser && oneUser[0]?.staffDetails?.isLoggedIn &&
                                        <CustomerInfoField
                                            title="Current Work Location"
                                            value={
                                                loading ? '' : oneUser && oneUser[0]?.staffDetails?.isLoggedIn && oneUser[0]?.staffDetails.currentSignInLocation.description
                                            }
                                        />
                                    }
                                    {oneUser[0]?.staffDetails?.isLoggedIn ?
                                        <>
                                            <span className="mr-2 rtl:ml-2 ">
                                                <Tag prefix prefixClass="bg-green-500">
                                                    Logged In
                                                </Tag>
                                            </span>
                                        </> : <>
                                            <span className="mr-2 rtl:ml-2 ">
                                                <Tag prefix prefixClass="bg-gray-500">
                                                    Logged Out
                                                </Tag>
                                            </span>
                                        </>}
                                </div>
                            </>)
                        }
                    </div>
                </Card>
                <div className="col-span-3 lg:col-span-2 ">
                    {/* <p>Stat Data</p> */}
                </div>
            </div>

            <Dialog
                isOpen={updateDialogIsOpen}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                width={700}
                onClose={onUpdateDialogClose}
                onRequestClose={onUpdateDialogClose}
            >
                <h5 className="mb-4">Customer to staff Assignment</h5>
                <AddCustomerStaffCanSee
                    disableSubmit
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    data={addCustomertoStaff!}
                    setIsOpen={setUpdateDialogIsOpen}
                />
            </Dialog>
        </div>
    )
}

export default StaffDetails