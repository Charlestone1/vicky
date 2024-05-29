import { Button, Card } from '@/components/ui'
import { TiRefresh } from 'react-icons/ti'
import { useAppDispatch } from '@/store'
import AllStaffTable from './AllStaffTable'
import { fetchStaffData } from '@/store/slices/staff/staffSlice'

const ManageStaffTableDisplay = () => {
    const dispatch = useAppDispatch()
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-600">Sales Staff</h4>
                <Button
                    icon={<TiRefresh />}
                    variant="solid"
                    size='sm'
                    onClick={() => dispatch(fetchStaffData())}
                />
            </div>
            <AllStaffTable />
        </Card>
    )
}


export default ManageStaffTableDisplay