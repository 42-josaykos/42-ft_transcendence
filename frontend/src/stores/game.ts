import { defineStore } from "pinia";
import type { User } from "@/models/user.model";
import type { Socket } from "socket.io-client";
import { ref } from "vue";

export const useGameStore = defineStore("game", () => {
  const gameSocket = ref<Socket>();

  const gameInvites = ref<any>();
  const liveGames = ref<any>();

  const usersInQueue = ref<User[]>([]);
  const usersInGame = ref<User[]>([]);

  const inQueue = ref<boolean>(false);
  const inGame = ref<boolean>(false);

  const players = ref<User[]>([]);
  const matchFound = ref<boolean>(false);
  const matchInvite = ref<boolean>(false);

  return {
    gameSocket,
    gameInvites,
    liveGames,
    usersInQueue,
    usersInGame,
    inQueue,
    inGame,
    players,
    matchFound,
    matchInvite,
  };
});
