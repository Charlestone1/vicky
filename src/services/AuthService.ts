import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    CreateStaffCredentials,
    CreateStaffResponse,
    GetStaffResponse,
    CreateDepartmentBody,
    CreateDepartmentResponse,
    GetDepartmentResponse,
    AddDealershipBody,
    AddDealershipBodyResponse,
    ChangePasswordResponse,
    ChangePassword,
    CreateManagerCredentials,
    updateDealershipBody,
    UpdateStaffCredentials,
    UpdateMangerPermissionCred,
    RemoveMangerPermissionCred,
    CreateGenManagerCredetials,
    UpdateGenManCredentials,
    UpdateInvoiceServiceCredentials,
    AddStaffEarningsRateBody,
    updateStaffEarnRate,
    deleteStaffEarnRate,
    AssignDealerToSTaffCred,
    DeleteManagerDets,
    RequestDeleteStaff,
    UpdateInvoiceServiceNameCredentials,
    DeleteVinDetails,
    CheckInDetails,
    UpdateEarningHistoyPriceCredentials,
    AssignCustomersToStaffCredentials,
    ReassignOnPremisSTaffCred,
    DeleteEntryDetails,
    DeleteCategory,
    SignInOtpCred,
    SignInOtpResponse,

} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    return await ApiService.fetchData<SignInResponse>({
        url: 'auth/admin/login',
        method: 'post',
        data,
    })
}
export async function apiOtp(data: SignInOtpCred) {
    return await ApiService.fetchData<SignInOtpResponse>({
        url: 'auth/admin/verify-login-otp',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/sign-up',
        method: 'post',
        data,
    })
}
export async function apiChangePassword(data: ChangePassword) {
    return ApiService.fetchData<ChangePasswordResponse>({
        url: '/users/update-password',
        method: 'put',
        data,
    })
}

export async function apiCreateUser(data: CreateStaffCredentials) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: '/users',
        method: 'post',
        data,
    })
}
export async function apiAssignCustomerToStaff(
    staffId: string | undefined,
    data: AssignCustomersToStaffCredentials) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/add-customers-that-a-staff-can-view/${staffId}`,
        method: 'put',
        data,
    })
}

export async function apiUpdateStaff(
    employeeId: string,
    data: UpdateStaffCredentials
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/${employeeId}`,
        method: 'put',
        data,
    })
}
export async function apiUpdateInvoiceServicePrice(
    entryId: string,
    data: UpdateInvoiceServiceCredentials
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/entries/modify-price/${entryId}`,
        method: 'put',
        data,
    })
}
export async function apiUpdateEarningsHistoryPrice(
    staffId: string,
    earningHistoryId: string,
    data: UpdateEarningHistoyPriceCredentials
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/update-staff-earning-history/${staffId}/${earningHistoryId}`,
        method: 'put',
        data,
    })
}

export async function apiUpdateInvoiceService(
    carId: string,
    oldServiceId: string,
    data: UpdateInvoiceServiceNameCredentials
) {
    const newServiceId = data.serviceId
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/entries/change-service-name/vehicle/${carId}/old-service-id/${oldServiceId}/new-service-id/${newServiceId}`,
        method: 'put',
        // data,
    })
}
export async function apiUpdateGenMan(
    employeeId: string,
    data: UpdateGenManCredentials
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/${employeeId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteStaff(
    employeeId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: UpdateStaffCredentials
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/${employeeId}`,
        method: 'delete',
        // data,
    })
}

export async function apiDeleteEntry(
    data: DeleteEntryDetails
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/entries/${data.entryId}`,
        method: 'delete',
        // data,
    })
}

export async function apiDeleteVin(
    data: DeleteVinDetails
) {
    const carId = data.carId
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/entries/vehicle/${carId}`,
        method: 'delete',
        // data,
    })
}
export async function apiDeleteCategory(
    data: DeleteCategory
) {
    // const carId = data.carId
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/entries/vehicle/${data.id}`,
        method: 'delete',
        // data,
    })
}
export async function apiCheckinStaff(

    checkInType: string,
    staffId: string,
    data: CheckInDetails
) {

    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/check-in-or-checkout-staff/${checkInType}/staff/${staffId}`,
        method: 'put',
        data,
    })
}
export async function apiDeleteGenManager(
    employeeId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: DeleteManagerDets
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/${employeeId}`,
        method: 'delete',
        // data,
    })
}

export async function apiGranManagerPermission(managerId: string, data: UpdateMangerPermissionCred) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/update-staff-permission-for-manager/${managerId}`,
        method: 'put',
        data,
    })
}
export async function apiRemoveManPermission(managerId: string, data: RemoveMangerPermissionCred) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/update-staff-permission-for-manager/${managerId}`,
        method: 'put',
        data,
    })
}
export async function apiAssignDealershipToStaff(staffId: string, data: AssignDealerToSTaffCred) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `/users/update-staff-dealership/${staffId}`,
        method: 'put',
        data,
    })
}
export async function apiReassignOnpremiseStaff(vehicleId: string, data: ReassignOnPremisSTaffCred) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `entries/re-assign-vehicle-to-another-staff/${vehicleId}/${data.staffId}`,
        method: 'put',
        // data,
    })
}

export async function apiCreateManager(data: CreateManagerCredentials) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: '/users',
        method: 'post',
        data,
    })
}
export async function apiCreateGeneralManager(data: CreateGenManagerCredetials) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: '/users',
        method: 'post',
        data,
    })
}

export async function apiCreateDepartment(data: CreateDepartmentBody) {
    return ApiService.fetchData<CreateDepartmentResponse>({
        url: '/departments',
        method: 'post',
        data,
    })
}


export async function apiAddDealership(
    dealershipServiceId: string,
    data: AddDealershipBody
) {
    return ApiService.fetchData<AddDealershipBodyResponse>({
        url: `services/add-dealership-price/${dealershipServiceId}`,
        method: 'put',
        data,
    })
}

export async function apiAddStaffEarningsRate(
    staff: string,
    data: AddStaffEarningsRateBody
) {

    return ApiService.fetchData<CreateStaffResponse>({
        url: `users/update-staff-earning-rates/${staff}`,
        method: 'put',
        data,
    })
}

export async function apiUpdateDealershipPrice(
    dealershipServiceId: string,
    customerId: string,
    data: updateDealershipBody
) {
    return ApiService.fetchData<AddDealershipBodyResponse>({
        url: `services/update-dealership-price/service/${dealershipServiceId}/customer/${customerId}`,
        method: 'put',
        data,
    })
}

export async function apiUpdateEarningRate(
    staffId: string,
    data: updateStaffEarnRate
) {

    return ApiService.fetchData<CreateStaffResponse>({
        url: `users/modify-earning-rate/${staffId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteDealershipPrice(
    dealershipServiceId: string,
    customerId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: updateDealershipBody
) {
    // console.log(`ServiceId: ${dealershipServiceId}, customerId: ${customerId}`)

    return ApiService.fetchData<AddDealershipBodyResponse>({
        url: `services/delete-dealership-price/service/${dealershipServiceId}/customer/${customerId}`,
        method: 'put',
    })
}
export async function apiDeleteEarningsRate(
    staffId: string,
    serviceId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: deleteStaffEarnRate
) {
    return ApiService.fetchData<CreateStaffResponse>({
        url: `users/delete-earning-rate/${staffId}/${serviceId}`,
        method: 'put',
    })
}

export async function apiGetAllDepartments() {
    return ApiService.fetchData<GetDepartmentResponse>({
        url: '/departments',
        method: 'get',
    })
}


export async function apiGetAllUsers() {
    return ApiService.fetchData<GetStaffResponse>({
        url: '/users',
        method: 'get',
        // data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/logout',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/users/request-reset',
        method: 'post',
        data,
    })
}
export async function apiRequestStaffAccountDelete(data: RequestDeleteStaff) {
    return ApiService.fetchData({
        url: '/users/request-for-account-deletion',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    const queryString = window.location.search
    const urlSearchParams = new URLSearchParams(queryString)

    const token = urlSearchParams.get('token')

    return ApiService.fetchData({
        url: `/users/reset-password/${token}`,
        method: 'post',
        data,
    })
}
