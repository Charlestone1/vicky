/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { Card, Spinner, Tag } from '@/components/ui'
import {
    fetchLoggedInStaffData,
} from '@/store/slices/loggInStaff/loggedInStaffSlice'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'

const LoggedInUsers = () => {
    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector(
        (state) => state.loggedinstaff
    )
    useEffect(() => {
        dispatch(fetchLoggedInStaffData())
    }, [dispatch])

    if (loading) {
        return (
            <Card className="flex justify-center items-center min-h-[10rem]">
                <Spinner size="40px" />
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="flex items-center justify-center min-h-[10rem]">
                <p>Error occured loading Logged In Users data</p>
            </Card>
        )
    }

    if (data.length === 0) {
        return (
            <Card className="flex items-center justify-center min-h-[10rem]">
                <p>No Staff is Logged In</p>
            </Card>
        )
    }
    return (
        <div>
            <ul className="grid gap-1">
                {data?.map((item, index) => (
                    <li key={index} className="border p-2 rounded shadow">
                        <div>
                            {/* <strong>Staff:</strong>{' '} */}
                            <Tag prefix prefixClass="bg-emerald-500">
                                {`${item.firstName} ${item.lastName}`}
                            </Tag>
                        </div>
                        <p>
                            <strong>Location: </strong>{' '}
                            {
                                item.staffDetails.currentSignInLocation
                                    .description
                            }
                        </p>
                        <p>
                            <strong>Time: </strong>{' '}
                            {formatDateToMMMDDYYYY(item.staffDetails.currentSignInLocation.timestamp)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LoggedInUsers
