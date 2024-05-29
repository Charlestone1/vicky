import Breadcrumb from '@/views/components/Breadcrumb/Breadcrumb'
import DeletedVinsLog from './components/DeletedVinsLog'
import InvoiceActivityLog from './components/InvoiceActivityLog'
import InvoiceEntryDetail from './components/InvoiceEntryDetail'
import { useParams } from 'react-router-dom'

const InvoiceDetails = () => {
    const { invoiceIdParams } = useParams()
    const breadcrumbs = [
        { label: 'Invoice', path: '/invoice' },
        { label: 'Invoice Details', path: `/invoice/${invoiceIdParams}`, },

    ]
    return (
        <>
            <div>
                <h2 className="mb-5">Invoice Details</h2>
                <Breadcrumb crumbs={breadcrumbs} />
                <InvoiceEntryDetail />
                <h3 className="mb-5 mt-8">Invoice Activity Log</h3>
                <InvoiceActivityLog />
                <h3 className="mb-5 mt-8">Deleted Vehicles Log</h3>
                <DeletedVinsLog />
            </div>
        </>
    )
}

export default InvoiceDetails
