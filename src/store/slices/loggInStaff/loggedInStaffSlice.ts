/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from '@/services/ApiService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


interface Coordinates {
    latitude: number
    longitude: number
}

interface CurrentSignInLocation {
    coordinates: Coordinates
    timestamp: string
    description: string
}

export type StaffDetails = {
    currentSignInLocation: CurrentSignInLocation
    earningRate: number
    totalEarning: number
    isLoggedIn: boolean
}

export type LoggedInStaff = {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    departments: string[] // You can specify the actual type for department IDs if needed
    avatarUrl: string
    avatarImgTag: string
    __v: number
    id: string
    staffDetails: StaffDetails
}

//   interface StaffResponse {
//     message: string;
//     success: boolean;
//     data: Staff[];
//   }

export type LoggedInStaffState = {
    data: LoggedInStaff[]
    loading: boolean
    error: string | null
}

export const fetchLoggedInStaffData = createAsyncThunk<LoggedInStaff[]>(
    'loggedinstaff/fetchData',
    async () => {

        try {
            const response = await ApiService.fetchData<{ data: LoggedInStaff[] }>({
                url: 'users/logged-in-users',
                method: 'get',
            })

            // console.log(response.data)
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: LoggedInStaffState = {
    data: [],
    loading: false,
    error: null,
}

const loggedInSlice = createSlice({
    name: 'loggedinstaff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoggedInStaffData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchLoggedInStaffData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchLoggedInStaffData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
            })
    },
})

export default loggedInSlice.reducer
