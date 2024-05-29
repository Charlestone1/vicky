import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
// import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, MANAGER } from '@/constants/roles.constant'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        role: [],
        authority: [ADMIN, MANAGER],
    },
    {
        key: 'otp',
        path: `/otp`,
        component: lazy(() => import('@/views/auth/Otp')),
        role: [],
        authority: [ADMIN, MANAGER],
    },
    {
        key: 'signOut',
        path: `/sign-out`,
        component: lazy(() => import('@/views/auth/Signout')),
        role: [],
        authority: [],
    },
    {
        key: 'logOut',
        path: `/logout`,
        component: lazy(() => import('@/views/auth/Logout')),
        role: [],
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        role: [],
        authority: [ADMIN, MANAGER],
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/views/auth/ResetPassword')),
        role: [],
        authority: [ADMIN, MANAGER],
    },

    // {
    //     key: 'requestDelete',
    //     path: `/request-delete`,
    //     component: lazy(() => import('@/views/auth/RequestDelete')),
    //     role: [],
    //     authority: [ADMIN, MANAGER],
    // },

]

export default authRoute
