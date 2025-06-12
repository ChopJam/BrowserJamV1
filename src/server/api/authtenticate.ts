import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  try {
    const { screen_name, password } = await readBody(event);
    
    const response = await $fetch('https://authenticator.animaljam.com/authenticate', {
      method: 'POST',
      headers: {
        'host': 'authenticator.animaljam.com',
        'User-Agent': 'UnityPlayer/2020.3.40f1 (UnityWebRequest/1.0, libcurl/7.84.0-DEV)',
      },
      body: {
        username: screen_name,
        password,
        domain: "flash"
      },
    });
    
    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Authentication failed',
    });
  }
});