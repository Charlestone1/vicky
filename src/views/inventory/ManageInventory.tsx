import { Button } from '@/components/ui'
import React from 'react'
import { TiRefresh } from 'react-icons/ti'
import Categories from './components/Categories'

const ManageInventory = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="mb-5">Inventory Categories</h2>
                <Button
                    icon={<TiRefresh />}
                    variant="solid"
                    size='sm'
                // onClick={() => dispatch(fetchEntriesData())}
                />
            </div>

            {/* <Breadcrumb crumbs={breadcrumbs} /> */}
            <Categories />
        </div>
    )
}

export default ManageInventory