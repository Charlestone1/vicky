export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    unAuthenticatedOtp: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    unAuthenticatedOtp: '/otp',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
    apiPrefix: 'https://api.naijacake.com/',

}

export default appConfig
