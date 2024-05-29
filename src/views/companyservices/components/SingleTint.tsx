import SingleTintInstal from './single-tint/SingleTintInstal'
import SingleTintRemoval from './single-tint/SingleTintRemoval'
import WindshieldInstall from './single-tint/WindshieldInstall'
// import WindshieldRemoval from './single-tint/WindshieldRemoval'

const SingleTint = () => {
    return (
        <div>
            <div>
                <h3 className="mb-4 text-gray-500 font-bold">Single Tint Installation Services</h3>
                <SingleTintInstal />
            </div>
            <div>
                <h3 className="mt-10 mb-4 text-gray-500 font-bold">Single Tint Removal Services</h3>
                <SingleTintRemoval />
            </div>
            <div>
                <h3 className="mt-10 mb-4 text-gray-500 font-bold">Windshield Installation Services</h3>
                <WindshieldInstall />
            </div>
            {/* <div>
                <h3 className="mt-10 mb-4 text-gray-500 font-bold">Windshield Removal Services</h3>
                <WindshieldRemoval />
            </div> */}
        </div>
    )
}

export default SingleTint