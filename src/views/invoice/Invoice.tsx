// import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import { TiRefresh } from 'react-icons/ti'
import InvoiceDisplay from './Invoice-display'
import { Button } from '@/components/ui'
import { useAppDispatch } from '../account/ActivityLog/store'
import { fetchEntriesData } from '@/store/slices/entries/entriesSlice'

const Invoice = () => {
  const dispatch = useAppDispatch()
  // const breadcrumbs = [
  //   { label: 'Invoice', path: '/invoice' },

  // ]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-5">Invoice</h2>
        <Button
          icon={<TiRefresh />}
          variant="solid"
          size='sm'
          onClick={() => dispatch(fetchEntriesData())}
        />
      </div>

      {/* <Breadcrumb crumbs={breadcrumbs} /> */}
      <InvoiceDisplay />
    </div>
  )
}

export default Invoice