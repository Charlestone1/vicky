// import { type } from "os"

export type SignInCredential = {
    email: string
    password: string
}
export type SignInOtpCred = {
    otp: string
}

export type SignInResponse = {
    status: boolean
    code: number
    message: string
    // data: null
}

export type SignInOtpResponse = {
    // token: string
    status: boolean
    code: number
    message: string
    data: {
        user: {
            id: string
            first_name: string
            last_name: string
            email: string
            username: string
            email_verified_at: string | null
            type: string;
            // type: "ADMIN" | "USER" | "GUEST";
            status: string;
            // status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
            created_at: string
            updated_at: string
        },
        token: {
            access_token: string
            token_type: string
        }
    }
}
// export type SignInResponse = {
//     token: string
//     success: boolean
//     message: string
//     user: {
//         _id: string
//         firstName: string
//         lastName: string
//         email: string
//         avatarUrl: string
//         avatarImgTag: string
//         role: string[]
//         departments: string[]
//     }
// }

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

// Change Password starts
export type ChangePassword = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}
export type ChangePasswordResponse = {
    message: string
    succes: boolean
}
// Change Password Ends

// Create/Register Manager and staff Starts

export type CreateStaffCredentials = {
    firstName: string
    lastName: string
    email: string
    role: string
    // staffDetails: {
    //     earningRate: number
    // }
    departments: string[]
    password: string
}
export type AssignCustomersToStaffCredentials = {
    customerQbIds: string[]
}
export type UpdateStaffCredentials = {
    firstName: string
    lastName: string
    role: string
    departments: string[]
}
export type DeleteManagerDets = {
    firstName: string
    lastName: string
}
export type DeleteVinDetails = {
    vin: string
    carId: string
}
export type DeleteCategory = {
    name: string
    id: string
}
export type DeleteEntryDetails = {
    entryId: string,
    customerName: string
}
export type CheckInDetails = {
    description: string,
    coordinates: {
        latitude: number,
        longitude: number
    }
}
export type UpdateInvoiceServiceCredentials = {
    serviceId: string
    carId: string
    price: number
}
export type UpdateEarningHistoyPriceCredentials = {
    newAmountEarned: number
}
export type UpdateInvoiceServiceNameCredentials = {
    serviceId: string
}
export type UpdateGenManCredentials = {
    firstName: string
    lastName: string
    role: string
}

export type UpdateMangerPermissionCred = {
    idToAdd: string
}
export type RemoveMangerPermissionCred = {
    idToRemove: string
}

export type AssignDealerToSTaffCred = {
    customerId: string
    remove: boolean
}
export type ReassignOnPremisSTaffCred = {
    staffId: string
}
export type UnAssignDealerToSTaffCred = {
    customerId: string
    remove: boolean
}

export type CreateManagerCredentials = {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    departments: string[]
}

export type CreateGenManagerCredetials = {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
}
// Create/Register Manager And Staff Ends

// Forgot Password Starts
export type ForgotPassword = {
    email: string
}
export type RequestDeleteStaff = {
    email: string
    password: string
}

export type ResetPassword = {
    newPassword: string
    confirmPassword: string
}

// SANITIZE types: SHOULD ALL BE MOVED into the another types file
export type CreateSingleInstallServicesBody = {
    type: string
    name: string
    // amount: number
    customerTime: number
    timeOfCompletion: number
    filmQualityOrVehicleCategoryAmount: {
        filmQualityId: string
        amount: number
    }[]
}
export type CreateWindshieldInstallServicesBody = {
    type: string
    name: string
    isWindshield: boolean
    customerTime: number
    timeOfCompletion: number
    filmQualityOrVehicleCategoryAmount: {
        filmQualityId: string
        amount: number
    }[]
}

export type CreateFullInstallServicesBody = {
    type: string
    name: string
    isFull: boolean
    customerTime: number
    timeOfCompletion: number
    filmQualityOrVehicleCategoryAmount: {
        filmQualityId: string
        amount: number
    }[]
}
export type CreateDealershipServicesBody = {
    name: string
    isForDealership: boolean
    customerTime: number
    timeOfCompletion: number
}

export type CreateSingleRemovalServicesBody = {
    type: string
    name: string
    amount: number
    customerTime: number
    timeOfCompletion: number
}
export type CreateWindshieldRemovalServicesBody = {
    type: string
    name: string
    isWindshield: boolean
    amount: number
    customerTime: number
    timeOfCompletion: number
}
export type UpdateSingleRemovalServicesBody = {
    // type: string
    // name: string
    amount: number
    customerTime: number
    timeOfCompletion: number
}
export type UpdateDealershipServicesBody = {
    // name: string
    // isForDealership: boolean
    customerTime: number
    timeOfCompletion: number
}
export type CreateFullRemovalServicesBody = {
    type: string
    name: string
    isFull: boolean
    amount: number
    customerTime: number
    timeOfCompletion: number
}
export type UpdateSingleTintServicesBody = {
    // type: string
    // name: string
    customerTime: number
    timeOfCompletion: number
    filmQualityOrVehicleCategoryAmount: {
        filmQualityId: string
        amount: number
    }[]
}
export type DeleteServicesBody = {
    type: string
    name: string
}

//  create staff response starts (New)
type EarningRate = {
    serviceId: string;
    earningRate: number;
};

interface StaffDetails {
    earningRates: EarningRate[];
    assignedDealerships?: string[];
    // totalEarning: number
}

interface Department {
    _id: string
    name: string
    description: string
    __v: number
    id: string
}

export type Staff = {
    staffDetails: StaffDetails
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    avatarUrl: string
    avatarImgTag: string
    __v: number
    isAdmin?: boolean // Optional field
    departments: Department[]
    id: string
    resetToken?: string // Optional field
}

export type CreateStaffResponse = {
    message: string
    success: boolean
    data: Staff[]
}

// Create Department Starts
export type CreateDepartmentBody = {
    name: string
    description: string
}

export type CreateDepartmentResponse = {
    message: string
    success: boolean
    data: {
        _id: string
        id: string
        name: string
        description: string
        __v: number
    }
}

// Create Department Ends

// dealership price types Starts

export type AddDealershipBody = {
    customerId: string
    price: number
}
// Staff earnings rate price types Starts

export type AddStaffEarningsRateBody = {
    serviceId: string
    earningRate: number
}

export type updateDealershipBody = {
    // customerId: string
    price: number
}
export type updateStaffEarnRate = {
    // staffId: string
    earningRate: number
    serviceId: string
}
export type deleteStaffEarnRate = {
    earningRate: number
}
type DefPrice = {
    category: string
    price: number
    _id: string
    id: string
}

export type DealershipPrice = {
    customerId: string
    price: number
    _id: string
    id: string
}

export type Service = {
    _id: string
    type: string
    name: string
    dealershipPrices: DealershipPrice[]
    __v: number
    defaultPrices: DefPrice[]
    id: string
}

export type AddDealershipBodyResponse = {
    message: string
    success: boolean
    data: Service
}

// dealership price types ends

// Get Employees(Manager & Staff) response (Old Check Later)

export type GetStaffRespons = {
    message: string
    success: boolean
    data: {
        _id: string
        firstName: string
        lastName: string
        email: string
        avatarUrl: string
        avatarImgTag: string
        role: string[]
        departments: string[]
    }
}

export type DepartmentData = {
    _id: string
    name: string
    description: string
    __v: number
    departmentId: string
    id: string
}

export type GetDepartmentResponse = {
    message: string
    success: boolean
    data: DepartmentData[]
}

export type GetStaffResponse = {
    message: string
    success: boolean
    data: GetAllStaffData[]
}

export type GetAllStaffData = {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    avatarUrl: string
    avatarImgTag: string
    departments: string[]
    __v: number
    isAdmin?: boolean
}

