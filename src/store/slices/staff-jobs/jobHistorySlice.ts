/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
// import moment from 'moment'
import ApiService from '@/services/ApiService'
import { JobHistoryBody } from '@/@types/auth'

type GeoLocation = {
    locationType: string;
    description: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    _id: string;
};

type PriceBreakdown = {
    serviceName: string;
    serviceType: string;
    price: number;
    serviceId: string;
    dealership: boolean;
    qbId: string;
    lineId: string;
    staffId: string;
    _id: string;
    stafName: string;
    stafEmail: string;
};

type ServiceDetail = {
    serviceId: string;
    _id: string;
    serviceName: string;
    serviceType: string;
};

type ServiceDone = {
    serviceId: string;
    staffId: string;
    _id: string;
    staffName: string;
    serviceName: string;
};

export type Invoice = {
    paymentDetails: {
        paymentDate: string | null;
        amountPaid: number;
    };
    sent: boolean;
    invoiceNumber: string;
    createdBy: string;
    qbId: string;
    name: string;
    createdByDetails: {
        id: string;
        name: string;
    };
    carDetails: {
        vin: string;
        year: number;
        make: string;
        entryDate: string;
        model: string;
        colour: string;
        warrantyServiceIds: string[];
        warrantyHistory: any[];
        serviceIds: string[];
        servicesDone: ServiceDone[];
        serviceDetails: ServiceDetail[];
        geoLocations: GeoLocation[];
        price: number;
        category: string;
        staffId: string;
        porterId: string | null;
        priceBreakdown: PriceBreakdown[];
        _id: string;
        serviceNames: string[];
        hasWorkStarted: boolean;
        areAllServicesDone: boolean;
        perCentageOfServicesDone: number;
        servicesDoneFraction: string;
        staffName: string;
        latestWorkDate: string;
    }[];
    totalPrice: number;
};

export type JobData = {
    _id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    entryDate: string;
    isFromAppointment: boolean | null;
    isFromDealership: boolean | null;
    isActive: boolean;
    numberOfCarsAdded: number;
    numberOfVehicles: number;
    isDeleted: boolean | null;
    invoice: Invoice;
    carsDone: number;
    id: string;
};

export type StaffJobsState = {
    data: JobData[]
    loading: boolean
    error: string | null
}

// export const fetchJobHistory = createAsyncThunk(
//     'jobhistoryrep/apiEarningsRepYearly',
//     async (data: JobHistoryBody) => {

//         return ApiService.fetchData<{ data: { data: JobHistoryBody } }>({
//             url: `/entries/staff/${data.staffId}`,
//             method: 'get',
//             // data,
//         })
//     }
// )

export const fetchStaffJobsData = createAsyncThunk<JobData[], string | undefined>(
    'staffjobs/fetchData',
    async (staffId: string | undefined) => {

        try {
            const response = await ApiService.fetchData<{ data: JobData[] }>({
                url: `/entries/staff/${staffId}`,
                method: 'post',
            })
            // console.log(response.data);
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

export const fetchJobHistoryfiltered = createAsyncThunk(
    'jobhistoryrep/apiEarningsRepWeekly',
    async (data: JobHistoryBody) => {

        function filterChioice() {
            if (data.customerId.length > 0 && data.serviceId.length > 0) {
                return { customerId: data.customerId, serviceId: data.serviceId }
            } else if (data.customerId.length > 0 && data.serviceId.length < 1) {
                return { customerId: data.customerId }
            } else if (data.customerId.length < 1 && data.serviceId.length > 0) {
                return { serviceId: data.serviceId }
            }
        }
        const myBody = filterChioice()
        return ApiService.fetchData<{ data: { data: JobData[] } }>({
            url: `/entries/staff/${data.staffId}`,
            method: 'post',
            data: myBody,
        })
    }
)

const initialState: StaffJobsState = {
    data: [],
    loading: false,
    error: null,
}

const jobHistorySlice = createSlice({
    name: 'jobhistoryrep',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffJobsData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchStaffJobsData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchStaffJobsData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
                // state.error = action.error.message 
            })
            .addCase(fetchJobHistoryfiltered.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchJobHistoryfiltered.fulfilled, (state, { payload }: PayloadAction<{ data: { data: any } }>) => {
                state.loading = false
                state.data = payload.data.data as any
                state.error = null
            })
            .addCase(fetchJobHistoryfiltered.rejected, (state, action) => {
                state.loading = false
                state.error = action.error?.message || 'An error occurred'
                // state.error = action.error.message
            })
    },

})

export default jobHistorySlice.reducer
