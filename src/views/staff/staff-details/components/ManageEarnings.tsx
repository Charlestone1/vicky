import Tabs from '@/components/ui/Tabs'
import EarningsReport from './EarningsReport'
import EarningsEditLog from './EarningsEditLog'

const { TabNav, TabList, TabContent } = Tabs

const ManageEarnings = () => {
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">History</TabNav>
                    <TabNav value="tab2">Edit Log</TabNav>
                </TabList>
                <div className="p-4">
                    <TabContent value="tab1">
                        <EarningsReport />
                    </TabContent>
                    <TabContent value="tab2">
                        <EarningsEditLog />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default ManageEarnings