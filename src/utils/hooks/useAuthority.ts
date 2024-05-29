import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useAuthority(
    userRole: string[] = [],
    role: string[] = [],
    emptyCheck = false
) {
    const roleMatched = useMemo(() => {
        return role.some((role) => userRole.includes(role))
    }, [role, userRole])

    if (
        isEmpty(role) ||
        isEmpty(userRole) ||
        typeof role === 'undefined'
    ) {
        return !emptyCheck
    }

    return roleMatched
}
// function useAuthority(
//     userAuthority: string[] = [],
//     authority: string[] = [],
//     emptyCheck = false
// ) {
//     const roleMatched = useMemo(() => {
//         return authority.some((role) => userAuthority.includes(role))
//     }, [authority, userAuthority])

//     if (
//         isEmpty(authority) ||
//         isEmpty(userAuthority) ||
//         typeof authority === 'undefined'
//     ) {
//         return !emptyCheck
//     }

//     return roleMatched
// }

export default useAuthority
