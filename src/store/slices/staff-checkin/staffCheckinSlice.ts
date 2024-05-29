/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from '@/services/ApiService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'




export type UserDataz = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isStaffCheckedInForTheDay: boolean;
    latestCheckinTime: string;
}

export type EntryResponseData = {
    message: string
    success: boolean
    data: UserDataz
}

export type CheckinState = {
    data: UserDataz
    loading: boolean
    error: any
}

export const fetchstaffCheckinData = createAsyncThunk<UserDataz, string | undefined>(
    'staffcheckin/fetchData',
    async (staffId: string | undefined) => {

        try {
            const response = await ApiService.fetchData<any>({
                url: `/users/check-if-staff-is-checked-in-for-the-day/${staffId}`,
                method: 'get',
            })

            // console.log(response.data)
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: CheckinState = {
    data: {} as UserDataz,
    loading: false,
    error: null,
}

const staffCheckinSlice = createSlice({
    name: 'staffcheckin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchstaffCheckinData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchstaffCheckinData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchstaffCheckinData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export default staffCheckinSlice.reducer
