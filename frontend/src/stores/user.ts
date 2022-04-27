import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/models/user.model";
import type { Socket } from "socket.io-client";
// Tracks users database
export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const usersOnline = ref<Number[]>([]);
  const loggedUser = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const socketChat = ref<Socket>();
  const usersBlocked = ref<User[]>([]);

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

   const isBlocked = (user: User) => {
    if (usersBlocked.value.findIndex(el => el.id === user.id) != -1) {
      return true
    }
    return false
   }

   const addUserBlocked = (newUser: User) => {
    usersBlocked.value.push(newUser);
  };

  const removeUserBlocked = (userID: number) => {
    const index = usersBlocked.value.findIndex((el: User) => el.id === userID);
    usersBlocked.value.splice(index, 1);
  };

  return {
    users,
    loggedUser,
    usersOnline,
    isAuthenticated,
    socketChat,
    usersBlocked,
    createUser,
    deleteUser,
    updateUser,
    isBlocked,
    addUserBlocked,
    removeUserBlocked
  };
});
