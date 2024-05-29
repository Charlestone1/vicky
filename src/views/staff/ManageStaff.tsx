import { useState, Suspense, lazy, useEffect } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useLocation, useNavigate } from 'react-router-dom'
// import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
// import isEmpty from 'lodash/isEmpty'
// import AllStaffTable from './AllStaffTable'
// import IncentiveCampaign from './incentive-campaign/IncentiveCampaign'



const AllStaffTable = lazy(() => import('./AllStaffTable'))
const IncentiveCampaign = lazy(() => import('./incentive-campaign/IncentiveCampaign'))
const WeeklyEarnings = lazy(() => import('./staff-details/components/WeeklyEarnings'))

const { TabNav, TabList } = Tabs

const staffMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    all_staff: { label: 'Staff', path: 'all_staff' },
    incentive: { label: 'Incentive', path: 'incentive' },
    earnings: { label: 'Earnings', path: 'earnings' },
}

const ManageStaff = () => {
    const [currentTab, setCurrentTab] = useState('all_staff');

    const navigate = useNavigate()

    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    useEffect(() => {
        setCurrentTab(path)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/staff/${val}`)
    }

    // const breadcrumbs = [
    //     { label: 'Staff', path: '/staff/all_staff' },

    // ]

    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <h2 className="mb-4">All Staff</h2>
                    {/* <Breadcrumb crumbs={breadcrumbs} /> */}
                    <TabList>
                        {Object.keys(staffMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {staffMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'all_staff' && (
                            <AllStaffTable />
                        )}
                        {currentTab === 'incentive' && (
                            <IncentiveCampaign />
                        )}
                        {currentTab === 'earnings' && (
                            <WeeklyEarnings />
                        )}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default ManageStaff
