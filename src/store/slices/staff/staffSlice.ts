/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiService from '@/services/ApiService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Pagination {
    prev: boolean;
    page: number;
    total: number;
    next: boolean;
}

export type Staff = {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string;
    type: string;
    username: string;
    status: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}
interface SatffData {
    users: Staff[];
    pagination: Pagination;
}

export type StaffState = {
    data: SatffData
    loading: boolean
    error: string | null
}

export const fetchStaffData = createAsyncThunk<SatffData>(
    'staff/fetchData',
    async () => {

        try {
            const response = await ApiService.fetchData<{ data: SatffData }>({
                url: '/user/?type=staff&status=active',
                // url: '/user/?type=staff&status=active&softDelete=true',
                method: 'get',
            })
            console.log(response.data);
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: StaffState = {
    data: {} as SatffData,
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
