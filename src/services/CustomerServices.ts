import ApiService from './ApiService'

export async function apiGetCustomer<T>() {
    return ApiService.fetchData<T>({
        url: 'user/role/customer',
        method: 'get',
    })
}



export async function apiGetAccountInvoiceData<
    T,
    U extends Record<string, unknown>
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/customer/',
        method: 'get',
        params,
    })
}

export async function apiGetAccountLogData<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/customer/log',
        method: 'post',
        data,
    })
}

