/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from '@/services/ApiService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



export type LocationCoordinates = {
    latitude: number;
    longitude: number;
}

export type GeoLocation = {
    locationType: string;
    description: string;
    coordinates?: LocationCoordinates;
    timestamp?: string;
    _id: string;
}

export type PaymentDetails = {
    paymentDate: string | null;
    amountPaid: number;
    currency?: string;
    amountDue?: number;
}

export type CreatedByDetails = {
    id: string;
    name: string;
}

export type PriceBreakdown = {
    serviceName: string;
    serviceType: string;
    price: number;
    serviceId: string;
    dealership: boolean;
    isDeleted?: boolean;
    lineId: string;
    qbId: string;
    _id: string;
}

export type ServicesDone = {
    serviceId: string;
    staffId: string;
    _id: string;
}

export type ServiceDetail = {
    serviceId: string;
    filmQualityId: string;
    _id: string;
}

export type CarDetail = {
    waitingList?: boolean;
    vin?: string;
    year?: number;
    make?: string;
    entryDate: string;
    model: string;
    colour: string;
    serviceIds: string[];
    servicesDone: ServicesDone[] | null;
    // servicesDone: ServicesDone[];
    geoLocations: GeoLocation[];
    note: string;
    price: number;
    category: string;
    staffId: string | null;
    porterId: string | null;
    priceBreakdown: PriceBreakdown[] | null;
    // priceBreakdown: PriceBreakdown[];
    _id: string;
    serviceNames: string[] | null;
    // serviceNames: (string | null)[];
    // serviceNames: string[];
    serviceDetails?: ServiceDetail[];
    staffName: string | null;
    isCompleted?: boolean;
    areAllServicesDone?: boolean;
}

export type Invoice = {
    paymentDetails: PaymentDetails;
    createdBy?: string;
    sent: boolean | null;
    qbId?: string;
    invoiceNumber?: string;
    name: string;
    createdByDetails?: CreatedByDetails;
    carDetails: CarDetail[];
    totalPrice: number;
    totalTaxApplied?: number;
    qbSyncToken?: string;
}

export type EntryData = {
    _id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    entryDate: string;
    isActive: boolean;
    numberOfCarsAdded: number;
    numberOfVehicles: number;
    invoice: Invoice;
    isFromDealership?: boolean
    id: string;
}

export type EntryResponseData = {
    message: string
    success: boolean
    data: EntryData[]
}

export type EntriesState = {
    data: EntryData[]
    loading: boolean
    error: any
}

export const fetchEntriesData = createAsyncThunk<EntryData[]>(
    'entries/fetchData',
    async () => {

        try {
            const response = await ApiService.fetchData<any>({
                url: '/entries',
                method: 'get',
            })
            // console.log(response.data)
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: EntriesState = {
    data: [],
    loading: false,
    error: null,
}

const entriesSlice = createSlice({
    name: 'entries',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEntriesData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEntriesData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchEntriesData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export default entriesSlice.reducer
