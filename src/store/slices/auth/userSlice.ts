import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'


export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    email_verified_at: string | null;
    type: string;
    // type: "ADMIN" | "USER" | "GUEST";
    status: string;
    // status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    created_at: string;
    updated_at: string;
}

interface Token {
    access_token: string;
    token_type: string;
    // expires_in: number;
}

// interface Data {
//     user: User;
//     token: Token;
// }

export type UserState = {
    user: User;
    token: Token;
    // loading: boolean
    // error: string | null
}

// export type UserState = {
//     _id: string
//     firstName?: string
//     lastName?: string
//     email?: string
//     avatarUrl?: string
//     avatarImgTag?: string
//     role?: string[]
//     departments?: string[]
// }
// export type UserState = {
//     avatar?: string
//     userName?: string
//     email?: string
//     authority?: string[]
// }

const initialState: UserState = {
    // data: {
    user: {
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        email_verified_at: '',
        type: "",
        status: "",
        created_at: '',
        updated_at: '',
    },
    token: {
        access_token: '',
        token_type: '',
        // expires_in: number;
    }
    // },
    // loading: false,
    // error: null
}
// const initialState: UserState = {
//     avatar: '',
//     userName: '',
//     email: '',
//     authority: [],
// }

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.user.id = action.payload?.user.id
            state.user.first_name = action.payload?.user.first_name
            state.user.last_name = action.payload?.user.last_name
            state.user.email = action.payload?.user.email
            state.user.username = action.payload?.user.username
            state.user.email_verified_at = action.payload?.user.email_verified_at
            state.user.type = action.payload?.user.type
            state.user.status = action.payload?.user.status
            state.user.created_at = action.payload?.user.created_at
            state.user.updated_at = action.payload?.user.updated_at
            state.token.access_token = action.payload?.token.access_token
            state.token.token_type = action.payload?.token.token_type
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
