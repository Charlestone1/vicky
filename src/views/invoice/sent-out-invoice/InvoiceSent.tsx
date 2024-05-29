import React from 'react'
import SentOutInvoice from './SentOutInvoice'
import { Button } from '@/components/ui'
import { TiRefresh } from 'react-icons/ti'
import { useAppDispatch } from '@/store'
import { fetchSentInvoiceData } from '@/store/slices/invoicesentout/sentSlice'

const InvoiceSent = () => {
    const dispatch = useAppDispatch()
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2>Invoice Sent To Quickbooks</h2>
                <Button
                    icon={<TiRefresh />}
                    variant="solid"
                    size='sm'
                    onClick={() => dispatch(fetchSentInvoiceData())}
                />
            </div>
            <SentOutInvoice />
        </div>
    )
}

export default InvoiceSent