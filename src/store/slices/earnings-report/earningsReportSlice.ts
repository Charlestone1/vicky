/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import ApiService from '@/services/ApiService'
import { EarningsRepBody, EarningsRepDailyBody, EarningsRepMonthlyBody, EarningsRepWeekyBody, EarningsRepYearlyBody } from '@/@types/auth'




export type EarningHistoryItem = {
    timestamp: string;
    amountEarned: number;
    _id: string;
    serviceId?: string;
    description?: string;
    serviceName?: string;
    serviceType?: string;
    pbId?: string;
    jobHistory?: JobHistory;
    canBeEdited: boolean;
}

interface CarDetails {
    vin: string;
    year: number;
    make: string;
    entryDate: string;
    model: string;
    colour: string;
    serviceIds: string[];
    servicesDone: {
        serviceId: string;
        staffId: string;
        _id: string;
    }[];
    serviceDetails: {
        serviceId: string;
        _id: string;
    }[];
    geoLocations: {
        locationType: string;
        description: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        _id: string;
    }[];
    category: string;
    staffId: string;
    porterId: string | null;
    _id: string;
    serviceName: string;
    serviceType: string;
}

interface PaymentDetails {
    paymentDate: string | null;
    amountPaid: number;
}

interface Invoice {
    paymentDetails: PaymentDetails;
    totalTaxApplied: number;
    totalPrice: number;
    sent: string | null;
    carDetails: CarDetails;
    name: string;
    invoiceNumber: string;
    createdBy: string;
}

interface JobHistory {
    _id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    entryDate: string;
    isActive: boolean;
    numberOfCarsAdded: number;
    numberOfVehicles: number;
    invoice: Invoice;
    __v: number;
}

export type EarningsReportData = {
    _id: string;
    firstName: string;
    lastName: string;
    earningHistory: EarningHistoryItem[];
    totalAmountEarned: number;
}

export type EarningsRepResponseData = {
    message: string
    success: boolean
    data: EarningsReportData[]
}

export type EarningsRepState = {
    data: EarningsReportData[]
    loading: boolean
    error: any
}

export const apiEarningsRepYearly = createAsyncThunk(
    'earningsrep/apiEarningsRepYearly',
    async (data: EarningsRepYearlyBody) => {

        return ApiService.fetchData<{ data: { data: EarningsReportData[] } }>({
            url: `/users/staff-total-earning-per-date/earning-report/year/${data.year}/${data.staffId}`,
            method: 'get',
            // data,
        })
    }
)

export const apiEarningsRepWeekly = createAsyncThunk(
    'earningsrep/apiEarningsRepWeekly',
    async (data: EarningsRepWeekyBody) => {
        const momentDate = moment(data.date);
        const formattedDate = momentDate.format('YYYY-MM-DD');

        return ApiService.fetchData<{ data: { data: EarningsReportData[] } }>({
            url: `/users/staff-total-earning-per-date/earning-report/week/${formattedDate}/${data.staffId}`,
            method: 'get',
            // data,
        })
    }
)
export const apiEarningsRepCurrent = createAsyncThunk(
    'earningsrep/apiEarningsRepcurrent',
    async (data: EarningsRepBody) => {
        const today = moment();


        // const lastThursday = today.clone().subtract(7, 'days').isoWeekday(4);

        const todayDay = today.isoWeekday();

        // const daysToSubtract = (todayDay === 4) ? 0 : (7 - todayDay + 4);
        // const lastThursday = today.clone().subtract(daysToSubtract, 'days');

        const daysToSubtract = (todayDay >= 4) ? (todayDay - 4) : (todayDay + 3);
        const lastThursday = today.clone().subtract(daysToSubtract, 'days');

        const momentStartDate = moment(lastThursday);
        const formattedLastThursday = momentStartDate.format('YYYY-MM-DD');

        return ApiService.fetchData<{ data: { data: EarningsReportData[] } }>({
            url: `/users/staff-total-earning-per-date/earning-report/week/${formattedLastThursday}/${data.staffId}`,
            method: 'get',
            // data,
        })
    }
)
export const apiEarningsRepDaily = createAsyncThunk(
    'earningsrep/apiEarningsRepDaily',
    async (data: EarningsRepDailyBody) => {
        const momentDate = moment(data.day);
        const formattedDay = momentDate.format('YYYY-MM-DD');

        return ApiService.fetchData<{ data: { data: EarningsReportData[] } }>({
            url: `/users/staff-total-earning-per-date/earning-report/day/${formattedDay}/${data.staffId}`,
            method: 'get',
            // data,
        })
    }
)
export const fetchMonthlyEarningsRepData = createAsyncThunk(
    'earningsrep/fetchMonthly',
    async (data: EarningsRepMonthlyBody) => {

        return ApiService.fetchData<{ data: { data: EarningsReportData[] } }>({
            url: `/users/staff-total-earning-per-date/earning-report/month/${data.monthName}/${data.year}/${data.staffId}`,
            method: 'get',
            // data,
        })
    }
)

export const fetchEarningsRepData = createAsyncThunk<EarningsReportData[], EarningsRepBody>(
    'earningsrep/fetchData',
    async (data: EarningsRepBody) => {
        try {

            const response = await ApiService.fetchData<any>({
                url: `/users/staff-total-earnings/${data.staffId}`,
                method: 'get',
            })

            const responseData = response.data.data as EarningsReportData[];
            // console.log(responseData);
            return responseData;
        } catch (error: any) {
            // console.log("ErrorMonthly: ", error.response.data.message);
            throw error.message
        }
    }
)


const initialState: EarningsRepState = {
    data: [],
    loading: false,
    error: null,
}

const checkinoutSlice = createSlice({
    name: 'earningsrep',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEarningsRepData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEarningsRepData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchEarningsRepData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiEarningsRepYearly.pending, (state) => {
                state.loading = true
            })
            .addCase(apiEarningsRepYearly.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiEarningsRepYearly.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchMonthlyEarningsRepData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMonthlyEarningsRepData.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(fetchMonthlyEarningsRepData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiEarningsRepWeekly.pending, (state) => {
                state.loading = true
            })
            .addCase(apiEarningsRepWeekly.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiEarningsRepWeekly.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiEarningsRepCurrent.pending, (state) => {
                state.loading = true
            })
            .addCase(apiEarningsRepCurrent.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiEarningsRepCurrent.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(apiEarningsRepDaily.pending, (state) => {
                state.loading = true
            })
            .addCase(apiEarningsRepDaily.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(apiEarningsRepDaily.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },

})

export default checkinoutSlice.reducer



