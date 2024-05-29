/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from '@/services/ApiService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export type UserData = {
    _id: string;
    timestamp: string;
    userId: string;
    operation: string;
    collectionName: string;
    collectionId: string;
    __v: number;
    user: {
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    };
    document: {
        description: string;
        staffId: string;
        checkingType: string;
        staff: {
            firstName: string;
            lastName: string;
            role: string;
            email: string;
        };
    };
}

export type EntryResponseData = {
    message: string
    success: boolean
    data: UserData[]
}

export type AvailabilityState = {
    data: UserData[]
    loading: boolean
    error: any
}

export const fetchstaffAvailabilityData = createAsyncThunk<UserData[], string | undefined>(
    'staffavailability/fetchData',
    async (staffId: string | undefined) => {

        try {
            const response = await ApiService.fetchData<any>({
                url: `/users//check-in-and-checkout-logs/${staffId}`,
                method: 'get',
            })
            // console.log(response.data)
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: AvailabilityState = {
    data: [],
    loading: false,
    error: null,
}

const staffAvailabilitySlice = createSlice({
    name: 'staffavailability',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchstaffAvailabilityData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchstaffAvailabilityData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchstaffAvailabilityData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export default staffAvailabilitySlice.reducer
