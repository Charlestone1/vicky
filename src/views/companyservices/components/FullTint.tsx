import FullTintInstallTable from './full-tint/FullTintInstallTable'
import FullTintRemovalTable from './full-tint/FullTintRemovalTable'

const FullTint = () => {
    return (
        <div>
            <div>
                <h3 className="mb-4 text-gray-500 font-bold">Full Tint Installation Services</h3>
                <FullTintInstallTable />
            </div>
            <div>
                <h3 className="mt-10 mb-4 text-gray-500 font-bold">Full Tint Removal Services</h3>
                <FullTintRemovalTable />
            </div>
        </div>
    )
}

export default FullTint