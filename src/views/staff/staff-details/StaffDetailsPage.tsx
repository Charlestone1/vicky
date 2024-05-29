import { useEffect, useState, useRef } from 'react'
import StaffDetails from './StaffDetails'
import StaffEarnings from './components/StaffEarnings'
import AvailabilityLog from './components/AvailabilityLog'
import { useLocation, useParams } from 'react-router-dom'
import Breadcrumb from '@/views/components/Breadcrumb/Breadcrumb'
import { User, fetchUsersData } from '@/store/slices/users/userSlice'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import ManageEarnings from './components/ManageEarnings'
import StaffJobsTable from './components/StaffJobsTable'
// import StaffJobs from './components/StaffJobs'
// import StaffJob from './components/StaffJob'
// import SearcherStaffJobs from './components/SearcherStaffJobs'

const StaffDetailsPage = () => {
    const { staffId } = useParams()
    const { data } = useAppSelector((state) => state.user)
    const [oneUser, setOneUser] = useState<User[]>()
    const manageEarningsRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchUsersData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        try {
            if (data) {
                const singleStaff = data.filter((item) => {
                    return item.id === staffId
                })
                setOneUser(singleStaff)
            }
        } catch (error) {
            console.log(error as TypeError)
        }
    }, [data, staffId])

    // // Scroll to ManageEarnings component when the component mounts
    // useEffect(() => {
    //     if (oneUser && manageEarningsRef.current) {
    //         manageEarningsRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [oneUser]);
    // Scroll to ManageEarnings component only if the URL contains #manage-earnings

    useEffect(() => {
        const shouldScrollToManageEarnings = location.hash === '#manage-earnings';
        if (oneUser && shouldScrollToManageEarnings && manageEarningsRef.current) {
            manageEarningsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [oneUser, location.hash]);

    const breadcrumbs = [
        { label: 'Staff', path: '/staff/all_staff' },
        { label: 'Staff Info', path: `/staff/${staffId}/staff-info` },
    ]


    return (
        <div>
            <h2 className="mb-5">Staff Info</h2>
            <Breadcrumb crumbs={breadcrumbs} />
            <StaffDetails />
            {oneUser && oneUser[0]?.role === "staff" ? <>
                <h4 className="capitalize mb-3 mt-6 text-gray-500">
                    On-Premise Report
                </h4>
                <AvailabilityLog />
                <div ref={manageEarningsRef}>
                    <h4 className="capitalize mb-3 mt-7 text-gray-500">
                        Earnings Tracking
                    </h4>
                    <ManageEarnings />
                </div>
                <div>
                    <h4 className="capitalize mb-3 mt-6 text-gray-500">
                        Jobs by Staff
                    </h4>
                    <StaffJobsTable />
                </div>
                <h4 className="capitalize mb-3 mt-6 text-gray-500">
                    Earnings Rate
                </h4>
                <StaffEarnings />
            </>
                :
                <></>}

        </div>
    )
}

export default StaffDetailsPage