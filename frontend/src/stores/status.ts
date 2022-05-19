import { defineStore } from "pinia";
import type { User } from "@/models/user.model";
import { io, type Socket } from "socket.io-client";

export const useStatusStore = defineStore("status", {
  state: () => ({
    /** @type {User, undefined} */
    loggedUser: undefined,
    /** @type {boolean} */
    isAuthenticated: false,
    /** @type {{ number }[]} */
    usersOnline: [],
    // /** @type { Socket } */
    // socket: io("ws://localhost:6060/game", {
    //   withCredentials: true,
    // }),
  }),
});
