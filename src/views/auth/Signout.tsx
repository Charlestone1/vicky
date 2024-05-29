import { Spinner } from '@/components/ui';
import useAuth from '@/utils/hooks/useAuth';
import React, { useEffect, useState } from 'react'

const Signout = () => {
    const { signOut } = useAuth();
    const [hasReloaded, setHasReloaded] = useState(false);

    useEffect(() => {
        signOut()
    }, [])

    useEffect(() => {
        if (!hasReloaded) {
            window.location.reload();
            setHasReloaded(true);
        }
        // console.log("reloading again");
    }, [hasReloaded]);

    return (
        <div className="flex justify-center items-center min-h-[25rem]">
            <Spinner size="40px" />
        </div>
    )
}

export default Signout