import React from 'react'
// import Statistics from './Statistics'
// import TurnoverReport from './TurnoverReport'
// import TurnoverByCategories from './TurnoverByCategories'
import RecentEntries from './RecentEntries'
import LoggedInUsers from './LoggedInUsers'
import { Button, Card } from '@/components/ui'
import { fetchLoggedInStaffData } from '@/store/slices/loggInStaff/loggedInStaffSlice'
import { TiRefresh } from 'react-icons/ti'
import { useAppDispatch } from '@/store'
import { fetchEntriesData } from '@/store/slices/entries/entriesSlice'

const DashboardBody = () => {
    const dispatch = useAppDispatch()
    return (
        <div className="grid gap-y-4">
            {/* <Statistics /> */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <TurnoverReport className="col-span-2" />
                <TurnoverByCategories />
            </div> */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h4>Recent Entries</h4>
                            <Button
                                icon={<TiRefresh />}
                                variant="solid"
                                size='sm'
                                onClick={() => dispatch(fetchEntriesData())}
                            />
                        </div>
                        <RecentEntries />
                    </Card>
                </div>
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h4>Logged In Staff</h4>
                        <Button
                            icon={<TiRefresh />}
                            variant="solid"
                            size='sm'
                            onClick={() => dispatch(fetchLoggedInStaffData())}
                        />
                    </div>
                    <LoggedInUsers />
                </Card>
            </div>
        </div>
    )
}

export default DashboardBody
