import { useAppDispatch } from '@/store'
import { fetchCheckinData } from '@/store/slices/check-report/checkreportSlice'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const AllTimeCheckin = () => {

    const { staffId } = useParams()
    const dispatch = useAppDispatch()

    useEffect(() => {
        try {
            if (staffId) {
                dispatch(fetchCheckinData({ staffId }))
            }
        } catch (error) {
            console.log(error as TypeError)
        }
    }, [dispatch, staffId])

    return (
        <div className='h-10'></div>
    )
}

export default AllTimeCheckin