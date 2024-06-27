"use server"

import { cookies } from 'next/headers'

export const getApiKey = async () => {
    const cookieApi = cookies()
    const apiKey = cookieApi.get('apiKey')?.value || ''

    return apiKey
}