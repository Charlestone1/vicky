import { useAppDispatch } from '@/store'
import { apiEarningsRepCurrent } from '@/store/slices/earnings-report/earningsReportSlice'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const CurrentEarnings = () => {

    const { staffId } = useParams()
    const dispatch = useAppDispatch()

    useEffect(() => {
        try {
            if (staffId) {
                dispatch(apiEarningsRepCurrent({ staffId }))
            }
        } catch (error) {
            console.log(error as TypeError)
        }
    }, [staffId])

    return (
        <div className='h-10'></div>
    )
}

export default CurrentEarnings