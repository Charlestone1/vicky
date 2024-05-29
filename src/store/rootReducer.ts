/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/named */
import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import RtkQueryService from '@/services/RtkQueryService'

import entries, { EntriesState } from './slices/entries/entriesSlice'
import staff, { StaffState } from './slices/staff/staffSlice'

import loggedinstaff, {
    LoggedInStaffState,
} from './slices/loggInStaff/loggedInStaffSlice'
import manager, { ManagerState } from './slices/manager/managerSlice'
import user, { UserState } from './slices/users/userSlice'
import entry, { EntryState } from './slices/entry/entrySlice'
import staffavailability, { AvailabilityState } from './slices/staff-availability/staffAvailabilitySlice'
import staffcheckin, { CheckinState } from './slices/staff-checkin/staffCheckinSlice'
import checkinout, { CheckInOutState } from './slices/check-report/checkreportSlice'
import earningsrep, { EarningsRepState } from './slices/earnings-report/earningsReportSlice'
import stafflog, { StaffLogState } from './slices/staff-logs/staffLogSlice'
import jobhistoryrep, { StaffJobsState } from './slices/staff-jobs/jobHistorySlice'


export type RootState = CombinedState<{
    auth: CombinedState<AuthState>
    base: CombinedState<BaseState>
    locale: LocaleState
    theme: ThemeState

    entries: EntriesState
    entry: EntryState
    staff: StaffState
    manager: ManagerState
    loggedinstaff: LoggedInStaffState
    user: UserState
    staffavailability: AvailabilityState
    staffcheckin: CheckinState
    checkinout: CheckInOutState
    earningsrep: EarningsRepState
    stafflog: StaffLogState
    jobhistoryrep: StaffJobsState
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth,
    base,
    locale,
    theme,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
    entries,
    entry,
    staff,
    manager,
    loggedinstaff,
    user,
    staffavailability,
    staffcheckin,
    checkinout,
    earningsrep,
    stafflog,
    jobhistoryrep,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
        (state: RootState, action: AnyAction) => {
            const combinedReducer = combineReducers({
                ...staticReducers,
                ...asyncReducers,
            })
            return combinedReducer(state, action)
        }

export default rootReducer
