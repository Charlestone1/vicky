/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import ApiService from '@/services/ApiService'
import { CheckinBody, CheckinDailyBody, CheckinMonthlyBody, CheckinWeekyBody, CheckinYearlyBody } from '@/@types/auth'


interface Coordinates {
    latitude: number;
    longitude: number;
}

export type CheckDetails = {
    timestamp: string;
    description: string;
    coordinates: Coordinates;
    checkInType: "checkIn" | "checkOut";
    _id: string;
    index: number;
    id: string;
}

export type CheckHistory = {
    checkInDetails: CheckDetails;
    checkOutDetails: CheckDetails;
}

export type CheckinOutData = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    checkInHistory: CheckHistory[];
}

export type EntryResponseData = {
    message: string
    success: boolean
    data: CheckinOutData
}

export type CheckInOutState = {
    data: CheckinOutData
    loading: boolean
    error: any
}

export const apiCheckInYearly = createAsyncThunk(
    'checkinout/apiCheckInYearly',
    async (data: CheckinYearlyBody) => {

        return ApiService.fetchData<{ data: { data: CheckinOutData } }>({
            url: `/users/check-in-reports/${data.staffId}/year/${data.year}`,
            method: 'get',
            // data,
        })
    }
)

export const apiCheckInWeekly = createAsyncThunk(
    'checkinout/apiCheckInWeekly',
    async (data: CheckinWeekyBody) => {
        const momentDate = moment(data.date);
        const formattedDate = momentDate.format('YYYY-MM-DD');

        return ApiService.fetchData<{ data: { data: CheckinOutData } }>({
            url: `/users/check-in-reports/${data.staffId}/week/${formattedDate}`,
            method: 'get',
            // data,
        })
    }
)
export const apiCheckInDaily = createAsyncThunk(
    'checkinout/apiCheckInDaily',
    async (data: CheckinDailyBody) => {
        const momentDate = moment(data.day);
        const formattedDay = momentDate.format('YYYY-MM-DD');

        return ApiService.fetchData<{ data: { data: CheckinOutData } }>({
            url: `/users/check-in-reports/${data.staffId}/${formattedDay}`,
            method: 'get',
            // data,
        })
    }
)
export const fetchMonthlyCheckinData = createAsyncThunk(
    'checkinout/fetchMonthly',
    async (data: CheckinMonthlyBody) => {

        return ApiService.fetchData<{ data: { data: CheckinOutData } }>({
            url: `/users/check-in-reports/${data.staffId}/month/${data.monthName}/year/${data.year}`,
            method: 'get',
            // data,
        })
    }
)
// export const fetchMonthlyCheckinData = createAsyncThunk<CheckinOutData, CheckinMonthlyBody>(
//     'checkinout/fetchMonthly',
//     async (data: CheckinMonthlyBody) => {
//         try {

//             const response = await ApiService.fetchData<any>({
//                 url: `/users/check-in-reports/${data.staffId}/month/${data.monthName}/year/${data.year}`,
//                 method: 'get',
//             })

//             const responseData = response.data.data as CheckinOutData;
//             // console.log(responseData);
//             return responseData;
//         } catch (error: any) {
//             // console.log("ErrorMonthly: ", error.response.data.message);
//             throw error.message
//         }
//     }
// )
export const fetchCheckinData = createAsyncThunk<CheckinOutData, CheckinBody>(
    'checkinout/fetchData',
    async (data: CheckinBody) => {
        try {

            const response = await ApiService.fetchData<any>({
                url: `/users/check-in-reports/${data.staffId}`,
                method: 'get',
            })

            const responseData = response.data.data as CheckinOutData;
            // console.log(responseData);
            return responseData;
        } catch (error: any) {
            // console.log("ErrorMonthly: ", error.response.data.message);
            throw error.message
        }
    }
)


const initialState: CheckInOutState = {
    data: {} as CheckinOutData,
    loading: false,
    error: null,
}

const checkinoutSlice = createSlice({
    name: 'checkinout',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCheckinData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCheckinData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchCheckinData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiCheckInYearly.pending, (state) => {
                state.loading = true
            })
            .addCase(apiCheckInYearly.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiCheckInYearly.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchMonthlyCheckinData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMonthlyCheckinData.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(fetchMonthlyCheckinData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiCheckInWeekly.pending, (state) => {
                state.loading = true
            })
            .addCase(apiCheckInWeekly.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiCheckInWeekly.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiCheckInDaily.pending, (state) => {
                state.loading = true
            })
            .addCase(apiCheckInDaily.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiCheckInDaily.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },

})

export default checkinoutSlice.reducer



