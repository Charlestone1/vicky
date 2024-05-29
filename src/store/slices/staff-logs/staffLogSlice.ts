/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiService from '@/services/ApiService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export type UserLogData = {
    _id: string;
    timestamp: string;
    userId: string;
    operation: string;
    collectionName: string;
    collectionId: string;
    document: {
        description: string;
        staffId: string;
        checkingType?: string;
        oldAmount?: number;
        newAmount?: number;
        earningHistoryId?: string;
        staff?: {
            firstName: string;
            lastName: string;
            role: string;
            email: string;
        };
        earningDetails?: {
            timestamp: string;
            amountEarned: number;
            serviceId: string;
            pbId: string;
            description: string;
            _id: string;
            serviceName: string;
            serviceType: string;
        };
    };
    __v: number;
    user: {
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    };
};

export type StaffLogState = {
    data: UserLogData[]
    loading: boolean
    error: string | null
}

export const fetchStaffLogData = createAsyncThunk<UserLogData[], string | undefined>(
    'stafflog/fetchData',
    async (staffId: string | undefined) => {

        try {
            const response = await ApiService.fetchData<{ data: UserLogData[] }>({
                url: `users/all-staff-logs/${staffId}`,
                method: 'get',
            })
            // console.log(response.data);
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: StaffLogState = {
    data: [],
    loading: false,
    error: null,
}

const staffSlice = createSlice({
    name: 'stafflog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffLogData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchStaffLogData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchStaffLogData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
            })
    },
})

export default staffSlice.reducer
