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
      updates.playerOne.username = input.update_p1;
    }
    if (input.update_p2) {
      updates.playerTwo.username = input.update_p1;
    }
    if (input.update_s1) {
      updates.scorePlayerOne = +input.update_s1;
    }
    if (input.update_s2) {
      updates.scorePlayerTwo = +input.update_s2;
    }
    console.log(updates);

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
