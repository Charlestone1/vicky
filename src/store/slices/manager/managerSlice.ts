/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from '@/services/ApiService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export type Department = {
    _id: string;
    name: string;
    description: string;
    __v: number;
    id: string;
}


export type LoggedStaffDetails = {
    _id: string;
    firstName: string;
    lastName: string;
    id: string;
}

export type Manager = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    departments: Department[];
    signInLocations: string[];
    avatarUrl: string;
    avatarImgTag: string;
    __v: number;
    managerDetails: {
        staffLocationsVisibleToManager: LoggedStaffDetails[];
        _id: string;
    };
    id: string;
}

export type ManagerState = {
    data: Manager[]
    loading: boolean
    error: string | null
}

export const fetchManagerData = createAsyncThunk<Manager[]>(
    'manager/fetchData',
    async () => {

        try {
            const response = await ApiService.fetchData<{ data: Manager[] }>({
                url: '/users/role/manager',
                method: 'get',
            })
            // console.log(response.data);
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: ManagerState = {
    data: [],
    loading: false,
    error: null,
}

const managerSlice = createSlice({
    name: 'manager',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagerData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchManagerData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchManagerData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
            })
    },
})

export default managerSlice.reducer
