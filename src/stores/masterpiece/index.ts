import type { Masterpiece } from "./masterpiece.types";

export const useMasterpieceStore = defineStore("masterpiece", () => {
  const { $toast } = useNuxtApp();

  const masterpieces = ref<string[]>([]);
  const recentMasterpieces = ref<any[]>([]);

  /**
   * Fetches the masterpieces from the API.
   * @param username The username to fetch masterpieces for.
   * @param game The game to fetch masterpieces for.
   */
  const fetchMasterpieces = async ({ username, game }: { username: string, game: string }): Promise<void> => {
    const response = await fetch('https://api.jam.exposed/v1/masterpiece/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        game,
      }),
    })

    if (!response.ok) {
      $toast.error('No masterpieces found.', {
        toastStyle: {
          background: 'black',
          color: 'white',
        }
      });
      return;
    }

    const data = await response.json() as Masterpiece;
    if (data.masterpieces.length === 0) {
      $toast.error('No masterpieces found.', {
        toastStyle: {
          background: 'black',
          color: 'white',
        }
      });
      return;
    }

    masterpieces.value = data.masterpieces;
  }


  /**
   * Saves a masterpiece to the recent masterpieces array.
   * @param masterpiece The masterpiece to save.
   */
  const saveMasterpiece = (image: string) => {
    if (!recentMasterpieces.value.find(m => m.image === image)) {
      recentMasterpieces.value.push({
        image,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Clears the recent masterpieces array.
   */
  const clearRecentMasterpieces = () => {
    recentMasterpieces.value = [];
  }

  return {
    masterpieces,
    recentMasterpieces,
    fetchMasterpieces,
    saveMasterpiece,
    clearRecentMasterpieces
  }
}, {
  persist: {
    storage: localStorage,
    pick: ['recentMasterpieces'],
  }
});
