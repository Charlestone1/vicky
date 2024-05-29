import Breadcrumb from '@/views/components/Breadcrumb/Breadcrumb'
import { useParams } from 'react-router-dom'
import EntryDetail from './components/EntryDetail'

const ManageEntryDetails = () => {
    const { entryIdParams } = useParams()
    const breadcrumbs = [
        { label: 'Entries', path: '/jobs/entries' },
        { label: 'Entry Details', path: `/jobs/entries/${entryIdParams}`, },

    ]
    return (
        <>
            <div>
                <h2 className="mb-5">Entry Details</h2>
                <Breadcrumb crumbs={breadcrumbs} />
                <EntryDetail />
            </div>
        </>
    )
}

export default ManageEntryDetails