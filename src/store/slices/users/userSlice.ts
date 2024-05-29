/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from '@/services/ApiService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



export type Department = {
    _id: string
    name: string
    description: string
    __v: number
    id: string
}

export type Coordinates = {
    latitude: number;
    longitude: number;
}

type SignInLocation = {
    coordinates: Coordinates;
    timestamp: string;
    description: string;
    _id?: string;
};

type EarningRate = {
    earningRate: number;
    serviceId: string;
    _id?: string;
};

type EarningHistory = {
    timestamp: string;
    amountEarned: number;
    _id?: string;
};

export type CheckInHistoryItem = {
    coordinates: Coordinates;
    timestamp: string;
    description: string;
    checkInType: string;
    _id: string;
}

export type StaffDetails = {
    checkInDetails: {
        checkInHistory: CheckInHistoryItem[];
        isCheckedIn: boolean;
        latestCheckinTime: string;
    };
    currentSignInLocation: SignInLocation;
    isAvailableForAppointments: boolean;
    earningRates: EarningRate[];
    totalEarning: number;
    _id: string;
    signInLocations: SignInLocation[];
    earningHistory: EarningHistory[];
    currentTrips: any[]; // Add the appropriate type when available
    isLoggedIn: boolean;
    mostRecentScannedTime: string;
    assignedDealerships?: string[]
    permittedCustomers?: string[]
};

type CustomerDetails = {
    companyName: string;
    qbId: string;
    alterNativeEmails: string[];
    accountNumber: string;
    canCreate: boolean;
    _id: string;
};

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl: string;
    avatarImgTag: string;
    __v: number;
    isAdmin?: boolean;
    signInLocations?: SignInLocation[];
    staffDetails?: StaffDetails; // Present for staff and manager roles
    customerDetails?: CustomerDetails; // Present for customer role
    departments?: Department[]; // Present for staff and manager roles
    id: string;
}

export type UserState = {
    data: User[]
    loading: boolean
    error: string | null
}

export const fetchUsersData = createAsyncThunk<User[]>(
    'user/fetchData',
    async () => {

        try {
            const response = await ApiService.fetchData<{ data: User[] }>({
                url: '/users',
                method: 'get',
            })

            // console.log(response.data);
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: UserState = {
    data: [],
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUsersData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchUsersData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
            })
    },
})

export default userSlice.reducer
