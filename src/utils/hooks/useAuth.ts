/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiSignIn,
    // apiSignUp,
    apiCreateUser,
    apiCreateManager,
    apiGetAllUsers,
    apiChangePassword,
    apiUpdateStaff,
    apiDeleteStaff,
    apiDeleteVin,
    apiCheckinStaff,
    apiSignOut,
    apiDeleteCategory,
    apiOtp,
} from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type {
    SignInCredential,
    // SignUpCredential,
    CreateStaffCredentials,
    CreateManagerCredentials,

    ChangePassword,
    UpdateStaffCredentials,
    DeleteVinDetails,
    CheckInDetails,
    DeleteCategory,
    SignInOtpCred,
} from '@/@types/auth'

type Status = true | false

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector(
        (state: any) => state.auth.session
    )

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
            status: Status,
            code: number,
            message: string,

        }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            // console.log(resp)
            if (resp.data.code === 200) {
                console.log(resp.data.message);

                // const { token } = resp.data
                // console.log(token);

                // dispatch(signInSuccess(token))
                // if (resp.data.user) {
                //     dispatch(setUser(resp.data.user))
                // }
                // const redirectUrl = query.get(REDIRECT_URL_KEY)
                // navigate(
                //     redirectUrl ? redirectUrl : appConfig.unAuthenticatedOtp
                // )
                navigate('/otp')
                return {
                    status: true,
                    message: '',
                    code: 200
                }
            }
            return {
                status: false,
                message: 'Access denied',
                code: 401
            }
        } catch (errors: any) {
            return {
                status: false,
                message: errors?.response?.data?.message || errors.toString(),
                code: 404
            }
        }
    }
    const signInOtp = async (
        values: SignInOtpCred
    ): Promise<
        | {
            status: Status,
            code: number,
            message: string
        }
        | undefined
    > => {
        try {
            const resp = await apiOtp(values)
            console.log(resp)
            if (resp.data.data.user.type === "ADMIN" || resp.data.data.user.type === "MANAGER") {
                const { access_token } = resp.data.data.token
                // console.log(token);

                dispatch(signInSuccess(access_token))
                if (resp.data.data.user) {
                    dispatch(setUser(resp.data.data))
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                // navigate('/home');
                return {
                    status: true,
                    message: resp.data.message,
                    code: resp.data.code,
                }
            }
            return {
                status: false,
                message: 'Access denied',
                code: resp.data.code,
            }
        } catch (errors: any) {
            return {
                status: false,
                code: 404,
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    // const signUp = async (values: SignUpCredential) => {
    //     try {
    //         const resp = await apiSignUp(values)
    //         if (resp.data) {
    //             const { token } = resp.data
    //             dispatch(signInSuccess(token))
    //             if (resp.data.user) {
    //                 dispatch(setUser(resp.data.user))
    //             }
    //             const redirectUrl = query.get(REDIRECT_URL_KEY)
    //             navigate(
    //                 redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
    //             )
    //             return {
    //                 status: 'success',
    //                 message: '',
    //             }
    //         }
    //     } catch (errors: any) {
    //         return {
    //             status: 'failed',
    //             message: errors?.response?.data?.message || errors.toString(),
    //         }
    //     }
    // }

    const registerStaff = async (values: CreateStaffCredentials) => {
        try {
            const resp = await apiCreateUser(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Account creation successful',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const updateStaff = async (
        employeeId: string,
        values: UpdateStaffCredentials
    ) => {
        try {
            const resp = await apiUpdateStaff(employeeId, values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Staff details updated successfully',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const deleteOneStaff = async (
        employeeId: string,
        values: UpdateStaffCredentials
    ) => {
        try {
            const resp = await apiDeleteStaff(employeeId, values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'User Deleted Successfully',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    const deleteOneVin = async (
        values: DeleteVinDetails
    ) => {
        try {
            const resp = await apiDeleteVin(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Vin Deleted Successfully',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    const deleteCategory = async (
        values: DeleteCategory
    ) => {
        try {
            const resp = await apiDeleteCategory(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Category Deleted Successfully',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const checkInStaff = async (
        checkInType: string,
        staffId: string,
        values: CheckInDetails
    ) => {
        try {
            const resp = await apiCheckinStaff(checkInType, staffId, values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Changed Staff Status Successfully',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const registerManager = async (values: CreateManagerCredentials) => {
        try {
            const resp = await apiCreateManager(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Account creation successful',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }



    const changePasswordasnyc = async (values: ChangePassword) => {
        try {
            const resp = await apiChangePassword(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: 'Successfully Changed Password',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const getAllUsers = async () => {
        try {
            const resp = await apiGetAllUsers()
            // console.log(resp)

            if (resp.data) {
                return {
                    status: 'success',
                    message: 'All Users successfully fetched',
                }
            }
            return {
                status: 'failed',
                message: 'error occured',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                user: {
                    id: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    username: '',
                    email_verified_at: '',
                    type: "",
                    status: "",
                    created_at: '',
                    updated_at: '',
                },
                token: {
                    access_token: '',
                    token_type: '',
                    // expires_in: number;
                }
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath);
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }
    const logOut = async () => {
        handleSignOut()
    }

    // Update and delete features

    return {
        authenticated: token && signedIn,
        signIn,
        signInOtp,
        registerStaff,
        updateStaff,
        deleteOneStaff,
        deleteOneVin,
        checkInStaff,
        registerManager,
        changePasswordasnyc,
        getAllUsers,
        // signUp,
        signOut,
        logOut,
        deleteCategory,
    }
}

export default useAuth
