import Breadcrumb from '@/views/components/Breadcrumb/Breadcrumb'

import { useParams } from 'react-router-dom'
import InvoiceEntryDetail from '../invoice-details/components/InvoiceEntryDetail'
import InvoiceActivityLog from '../invoice-details/components/InvoiceActivityLog'
import DeletedVinsLog from '../invoice-details/components/DeletedVinsLog'

const ManageSentInvoiceDetails = () => {
    const { invoiceIdParams } = useParams()
    const breadcrumbs = [
        { label: 'Sent Invoice', path: '/sent-out-invoice' },
        { label: 'Sent Invoice Details', path: `/sent-out-invoice/invoice/${invoiceIdParams}`, },

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

export default ManageSentInvoiceDetails