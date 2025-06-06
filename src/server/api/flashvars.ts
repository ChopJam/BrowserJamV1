import { defineEventHandler, createError } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  try {
    const { screen_name, token } = await readBody(event)

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.animaljam.com/play'
    }

    const response = await $fetch('https://www.animaljam.com/flashvars', {
      headers,
      timeout: 10000,
      retry: 2
    })

    const vars = {
      ...response,
      auth_token: token,
      username: screen_name,
    }

    return vars
  } catch (error) {
    console.error('Error fetching flashvars:', error)

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Failed to fetch flashvars',
    })
  }
})