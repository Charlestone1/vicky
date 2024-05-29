import { Button, Card } from '@/components/ui'
import { TiRefresh } from 'react-icons/ti'
import { useAppDispatch } from '../account/ActivityLog/store'
import Entries from './Entries'
import { fetchEntriesData } from '@/store/slices/entries/entriesSlice'

const ManageEntry = () => {
    const dispatch = useAppDispatch()
    return (
        <div>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h4>Entries</h4>
                    <Button
                        icon={<TiRefresh />}
                        variant="solid"
                        size='sm'
                        onClick={() => dispatch(fetchEntriesData())}
                    />
                </div>
                <Entries />
            </Card>
        </div>
    )
}

export default ManageEntry