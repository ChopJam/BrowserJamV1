export const useStatsStore = defineStore('stats', () => {
  const stats = ref<{
    masterpieceCount: number;
    masterpieceEncodeCount: number;
  }>({
    masterpieceCount: 0,
    masterpieceEncodeCount: 0,
  });

  const fetchStats = async () => {
    const response = await fetch('https://api.jam.exposed/v1/stats', {
      method: 'GET',
    })

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    stats.value = data;
  }

  return {
    stats,
    fetchStats
  }
});