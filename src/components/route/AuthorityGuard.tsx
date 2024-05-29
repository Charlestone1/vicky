import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthority from '@/utils/hooks/useAuthority'

type AuthorityGuardProps = PropsWithChildren<{
    userRole?: string[]
    role?: string[]
}>

const AuthorityGuard = (props: AuthorityGuardProps) => {
    const { userRole = [], role = [], children } = props

    const roleMatched = useAuthority(userRole, role)

    return <>{roleMatched ? children : <Navigate to="/access-denied" />}</>
}

export default AuthorityGuard

// type AuthorityGuardProps = PropsWithChildren<{
//     userAuthority?: string[]
//     authority?: string[]
// }>

// const AuthorityGuard = (props: AuthorityGuardProps) => {
//     const { userAuthority = [], authority = [], children } = props

//     const roleMatched = useAuthority(userAuthority, authority)

//     return <>{roleMatched ? children : <Navigate to="/access-denied" />}</>
// }

// export default AuthorityGuard
