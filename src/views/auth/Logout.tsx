import { useEffect } from 'react'
import useAuth from '@/utils/hooks/useAuth'
import { Spinner } from '@/components/ui';

const Logout = () => {
    const { logOut } = useAuth();

    useEffect(() => {
        logOut()
    }, [])

    return (
        <div className="flex justify-center items-center min-h-[25rem]">
            <Spinner size="40px" />
        </div>
    )
}

export default Logout