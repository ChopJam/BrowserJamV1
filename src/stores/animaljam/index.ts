import { type AuthenticatorResponse, type FlashvarsResponse } from './animaljam.types';
import { useCookie } from '#app';

export const useAnimalJamStore = defineStore('animaljam', () => {
  const { $toast } = useNuxtApp();

  /**
   * The username of the user.
   * @type {string}
   */
  const username = useCookie<string>('aj-username', {
    default: () => '',
    sameSite: 'lax',
  })

  /**
   * Authentication token for the user.
   */
  const token = useCookie<string>('aj-token', {
    default: () => '',
    sameSite: 'lax',
    secure: true,
  })

  /**
   * Authenticates the user with the Animal Jam API.
   * @param screen_name - The screen name of the user.
   * @param password - The password of the user.
   * @returns {Promise<void>}
   */
  const authtenticate = async (screen_name: string, password: string): Promise<void> => {
    try {
      const data: AuthenticatorResponse = await $fetch('/api/authtenticate', {
        method: 'POST',
        body: {
          screen_name,
          password
        }
      });

      const { auth_token } = data;

      if (!auth_token) {
        $toast.error("Invalid username or password");
        return;
      }

      username.value = screen_name;
      token.value = auth_token;

      navigateTo('/play');

      $toast.success("Logged in successfully");
    } catch (error) {
      console.error("Error authenticating:", error);
      $toast.error("An error occurred while logging in");
    }
  }

  /**
   * Fetches the flash variables from the Animal Jam API.
   */
  const flashVars = async (): Promise<any> => {
    try {
      const data: FlashvarsResponse = await $fetch('/api/flashvars', {
        method: 'POST',
        body: {
          screen_name: username.value,
          token: token.value
        }
      });

      if (!data) {
        $toast.error("Failed to fetch flash variables");
        return;
      }

      return data
    } catch (error) {
      console.error("Error fetching flashvars:", error);
    }
  }

  const logout = () => {
    username.value = ''
    token.value = ''
  }

  return {
    authtenticate,
    flashVars,
    logout,
    username,
    token,
  }
});