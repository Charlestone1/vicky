import axios from 'axios'
import appConfig from '@/configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY, REQUEST_HEADER_CONTENT_TYPE, REQUEST_HEADER_ACCEPT } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store, { signOutSuccess } from '../store'

const unauthorizedCode = [401]

const BaseService = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

BaseService.interceptors.request.use(
    (config) => {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
        const persistData = deepParseJson(rawPersistData)

        if (!rawPersistData) {
            persistData
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let accessToken = (persistData as any).auth.session.token

        if (!accessToken) {
            const { auth } = store.getState()
            accessToken = auth.session.token

            // config.headers[
            //     REQUEST_HEADER_ACCEPT
            // ] = `application/json`

            // config.headers[
            //     REQUEST_HEADER_CONTENT_TYPE
            // ] = `application/json`

        }


        if (accessToken) {

            config.headers[
                REQUEST_HEADER_CONTENT_TYPE
            ] = `application/json`

            config.headers[
                REQUEST_HEADER_AUTH_KEY
            ] = `${TOKEN_TYPE} ${accessToken}`


            config.headers[
                REQUEST_HEADER_ACCEPT
            ] = `application/json`

        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// config.headers[
//     REQUEST_HEADER_AUTH_TOKEN
// ] = `${accessToken}`

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error
        // console.log("Got to BaseService");

        if (response && unauthorizedCode.includes(response.status)) {
            store.dispatch(signOutSuccess())
        }
        if (response && response.status == "502" || response.status == "503") {
            throw "Server Error"
        }
        if (response && response.status == "401" || unauthorizedCode.includes(response.status)) {
            // console.log("Look here");
            window.location.href = "/logout";
            throw "Invalid Web Token";
        }
        return Promise.reject(error)
    }
)

export default BaseService
