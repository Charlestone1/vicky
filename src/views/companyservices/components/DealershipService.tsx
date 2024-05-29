import React from 'react'
import DealershipServiceTable from './dealership/DealershipServiceTable'

const DealershipService = () => {
    return (
        <div>
            <div>
                <h3 className="mb-4 text-gray-500 font-bold">Dealership Services</h3>
                <DealershipServiceTable />
            </div>
        </div>
    )
}

export default DealershipService