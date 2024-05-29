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
export type AssignmentDetails = {
    timestamp: string;
    latestAssignmentTimestamp: string;
    originallyAssignedStaffId: string;
    currentlyAssignedStaffId: string;
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
    filmQuality: string;
    serviceName: string;
    serviceType: string;
    price: number;
    serviceId: string;
    dealership: boolean;
    isDeleted?: boolean;
    lineId: string;
    qbId: string;
    _id: string;
    stafName?: string;
    stafEmail?: string;
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
    assignmentDetails: AssignmentDetails;
    isOnPremise: boolean;
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
    // serviceNames: string[];
    serviceDetails?: ServiceDetail[];
    staffName: string | null;
    isCompleted?: boolean;
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
    data: EntryData
}

export type EntryState = {
    data: EntryData
    loading: boolean
    error: any
}

export const fetchEntryData = createAsyncThunk<EntryData, string | undefined>(
    'entry/fetchData',
    async (entyId: string | undefined) => {

        try {
            const response = await ApiService.fetchData<any>({
                url: `/entries/${entyId}`,
                method: 'get',
            })

            // console.log(response.data)
            return response.data.data
        } catch (error: any) {
            throw error.message
        }
    }
)

const initialState: EntryState = {
    data: {} as EntryData,
    loading: false,
    error: null,
}

const entrySlice = createSlice({
    name: 'entry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEntryData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEntryData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchEntryData.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export default entrySlice.reducer
