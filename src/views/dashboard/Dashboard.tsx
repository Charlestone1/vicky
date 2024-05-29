import React from 'react'
import DashboardHeader from './components/DashboardHeader'
import DashboardBody from './components/DashboardBody'

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <DashboardHeader />
            <DashboardBody />
        </div>
    )
}

export default Dashboard
