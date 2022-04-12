import { defineStore } from "pinia";
import type { User } from "@/models/user.model";

export const useStatusStore = defineStore("status", {
  state: () => ({
    /** @type {User, undefined} */
    loggedUser: undefined,
    /** @type {boolean} */
    isAuthenticated: false,
    /** @type {{ number }[]} */
    usersOnline: [],
  }),
});
