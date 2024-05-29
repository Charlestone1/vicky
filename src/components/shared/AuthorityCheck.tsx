import useAuthority from '@/utils/hooks/useAuthority'
import type { CommonProps } from '@/@types/common'

interface AuthorityCheckProps extends CommonProps {
    userRole: string[]
    role: string[]
    // authority: string[]
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
    const { userRole = [], role = [], children } = props

    const roleMatched = useAuthority(userRole, role)

    return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
