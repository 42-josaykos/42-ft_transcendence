import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/models/user.model";
import { io, type Socket } from "socket.io-client";

// Tracks users database
export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const usersOnline = ref<Number[]>([]);
  const loggedUser = ref<User | null>(null);
  const statusSocket = ref<Socket>();
  const gameSocket = ref<Socket>(
    io("ws://localhost:6060/game", {
      withCredentials: true,
    })
  );
  const isAuthenticated = ref(false);
  const isTwoFactorAuth = ref<boolean>(false);

  const createUser = (newUser: User) => {
    users.value.push(newUser);
  };

  const deleteUser = (id: number) => {
    const index = users.value.findIndex((el: User) => el.id === id);
    users.value.splice(index, 1);
  };
  const updateUser = (id: number, updatedData: User) => {
    const index = users.value.findIndex((el: User) => el.id === id);
    users.value.splice(index, 1, { ...users.value[index], ...updatedData });
  };

  return {
    users,
    loggedUser,
    usersOnline,
    isAuthenticated,
    gameSocket,
    statusSocket,
    isTwoFactorAuth,
    createUser,
    deleteUser,
    updateUser,
  };
});
