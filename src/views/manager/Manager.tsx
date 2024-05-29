import { Button, Card } from '@/components/ui'
import { TiRefresh } from 'react-icons/ti'
import ManagerTableDisplay from './components/ManagerTableDisplay'
import { useAppDispatch } from '../account/ActivityLog/store'
import { fetchManagerData } from '@/store/slices/manager/managerSlice'

const Manager = () => {
    const dispatch = useAppDispatch()
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2>Mangers</h2>
                <Button
                    icon={<TiRefresh />}
                    variant="solid"
                    size='sm'
                    onClick={() => dispatch(fetchManagerData())}
                />
            </div>
            <ManagerTableDisplay />
        </Card>
    )
}

export default Manager
