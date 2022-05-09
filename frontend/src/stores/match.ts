import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Match } from '@/models/match.model';
import type { Input } from './input';

// Tracks matches database
export const useMatchStore = defineStore('match', () => {
  const matches = ref<Match[]>([]);

  const createMatch = (newMatch: Match) => {
    matches.value.push(newMatch);
  };

  const deleteMatch = (id: number) => {
    const index = matches.value.findIndex((el: Match) => el.id === id);
    matches.value.splice(index, 1);
  };

  const getMatchUpdates = (input: Input): Match | null => {
    const index = matches.value.findIndex(
      (el: Match) => el.id === +input.update_match_id
    );
    if (index == -1) {
      return null;
    }
    let updates: Match | any = { ...matches.value[index] };
    if (input.update_p1) {
      updates.players[0] = { id: +input.update_p1 };
    }
    if (input.update_p2) {
      updates.players[1] = { id: +input.update_p2 };
    }
    if (input.update_s1) {
      updates.score[0] = +input.update_s1;
    }
    if (input.update_s2) {
      updates.score[1] = +input.update_s2;
    }
    return updates;
  };

  const updateMatch = (id: number, updatedData: Match) => {
    const index = matches.value.findIndex((el: Match) => el.id === id);
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
