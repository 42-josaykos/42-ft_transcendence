import { defineStore } from "pinia";
import type { User } from "@/models/user.model";
import type { Socket } from "socket.io-client";

export const useGameStore = defineStore("game", {
  state: () => {
    return {
      /** @type { Socket } */
      gameSocket: undefined,

      /** @type {{ any }[]} */
      gameInvites: [],
      /** @type {{ any }[]} */
      liveGames: [],

      /** @type {{ User }[]} */
      usersInQueue: [],
      /** @type {{ User }[]} */
      usersInGame: [],

      /** @type { boolean } */
      inQueue: false,
      /** @type { boolean } */
      inGame: false,
      // /** @type { Socket } */
      // socket: io("ws://localhost:6060/game", {
      //   withCredentials: true,
      // }),
    };
  },
});
