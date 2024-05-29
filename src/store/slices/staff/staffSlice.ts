/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiService from '@/services/ApiService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


// export type Staff = {
//     _id: string
//     firstName: string
//     lastName: string
//     email: string
//     role: string
//     avatarUrl: string
//     avatarImgTag: string
//     __v: number
//     // isAdmin?: boolean;
//     departments: {
//         _id: string
//         name: string
//         description: string
//         __v: number
//         id: string
//     }[]
// }

export type Department = {
    _id: string
    name: string
    description: string
    __v: number
    id: string
}

type Coordinates = {
    latitude: number
    longitude: number
}

export type SignInLocation = {
    coordinates: Coordinates
    timestamp: string
    description: string
    _id: string
}

interface CheckInHistory {
    coordinates: Coordinates;
    timestamp: string;
    description: string;
    checkInType: string;
    _id: string;
}

interface CheckInDetails {
    checkInHistory: CheckInHistory[];
    isCheckedIn: boolean;
    latestCheckinTime: string;
}

interface EarningRate {
    earningRate: number;
    serviceId: string;
    _id: string;
}

interface EarningHistory {
    timestamp: string;
    amountEarned: number;
    serviceId: string;
    pbId: string;
    description?: string;
    _id: string;
}

export type StaffDetails = {
    checkInDetails: CheckInDetails;
    currentSignInLocation?: SignInLocation;
    permittedCustomers: string[];
    isAvailableForAppointments?: boolean;
    earningRates: EarningRate[];
    totalEarning: number;
    signInLocations: SignInLocation[];
    earningHistory: EarningHistory[];
    currentTrips: any[];
    mostRecentScannedTime: string;
    isLoggedIn: boolean;

    earningRate?: number
    _id: string
}

export type Staff = {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    departments: Department[]
    signInLocations: SignInLocation[]
    avatarUrl: string
    avatarImgTag: string
    __v: number
    id: string
    staffDetails?: StaffDetails
}

export type StaffState = {
    data: Staff[]
    loading: boolean
    error: string | null
}

export const fetchStaffData = createAsyncThunk<Staff[]>(
    'staff/fetchData',
    async () => {

        try {
            const response = await ApiService.fetchData<{ data: Staff[] }>({
                url: '/users/employees',
                method: 'get',
            })
            // console.log(response.data);
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: StaffState = {
    data: [],
    loading: false,
    error: null,
}

const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchStaffData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchStaffData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
            })
    },
})

export default staffSlice.reducer
