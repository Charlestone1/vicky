import { useAppDispatch } from '@/store'
import { fetchEarningsRepData } from '@/store/slices/earnings-report/earningsReportSlice'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const AllTimeEarningsRep = () => {

    const { staffId } = useParams()
    const dispatch = useAppDispatch()

    useEffect(() => {
        try {
            if (staffId) {
                dispatch(fetchEarningsRepData({ staffId }))
            }
        } catch (error) {
            console.log(error as TypeError)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffId])

    return (
        <div className='h-10'></div>
    )
}

export default AllTimeEarningsRep