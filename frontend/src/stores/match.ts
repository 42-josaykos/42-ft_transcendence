import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Match } from '@/models/match.model';

// Tracks matches database
export const useMatchStore = defineStore('match', () => {
  const matches = ref<Match[]>([]);

  const createMatch = (newMatch: Match) => {
    matches.value.push(newMatch);
  };

  const deleteMatch = (id: number) => {
    const index = matches.value.findIndex((el: any) => el.id === id);
    matches.value.splice(index, 1);
  };

  const getMatchUpdates = (id: number, input: any): Match | null => {
    const index = matches.value.findIndex((el: any) => el.id === id);
    if (index == -1) {
      return null;
    }
    let updates: Match = { ...matches.value[index] };
    if (input.update_p1) {
      updates['player1'] = input.update_p1;
    }
    if (input.update_p2) {
      updates['player2'] = input.update_p1;
    }
    if (input.update_s1) {
      updates['score'][0] = +input.update_s1;
    }
    if (input.update_s2) {
      updates['score'][1] = +input.update_s2;
    }
    updates['winner'] =
      updates['score'][0] > updates['score'][1]
        ? updates['player1']
        : updates['player2'];
    return updates;
  };

  const updateMatch = (id: number, updatedData: any) => {
    const index = matches.value.findIndex((el: any) => el.id === id);
    matches.value.splice(index, 1, { ...matches.value[index], ...updatedData });
  };

  return {
    matches,
    createMatch,
    deleteMatch,
    getMatchUpdates,
    updateMatch
  };
});
