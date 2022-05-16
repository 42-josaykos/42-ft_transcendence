import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/models/user.model";
import type { Socket } from "socket.io-client";
import { computed } from "vue";

// Tracks users database
export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const usersOnline = ref<Number[]>([]);
  const loggedUser = ref<User | undefined>();
  const gameSocket = ref<Socket>();
  const isAuthenticated = ref(false);
  const socketChat = ref<Socket>();
  const statusSocket = ref<Socket>();
  const usersBlocked = ref<User[]>([]);
  const usersFriends = ref<User[]>([]);
  const isTwoFactorAuth = ref<boolean>(false);
  const userClick = ref<User>();
  const setting_open = ref<boolean>(false);
  const playersDuo = ref<User[]>([]);
  const modalFriends = ref<boolean>(false);
  const leaderboard = ref<any>([]);

  const modaleOpenInviteGame = ref<boolean>(false);

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

  const isBlocked = (user: User | undefined) => {
    if (
      user != undefined &&
      usersBlocked.value.findIndex((el) => el.id === user.id) != -1
    ) {
      return true;
    }
    return false;
  };

  const addUserBlocked = (newUser: User) => {
    usersBlocked.value.push(newUser);
  };

  const removeUserBlocked = (userID: number) => {
    const index = usersBlocked.value.findIndex((el: User) => el.id === userID);
    usersBlocked.value.splice(index, 1);
  };

  const isFriend = (user: User | undefined) => {
    if (
      user != undefined &&
      usersFriends.value.findIndex((el) => el.id === user.id) != -1
    ) {
      return true;
    }
    return false;
  };

  const addUserFriend = (newUser: User) => {
    usersFriends.value.push(newUser);
  };

  const removeUserFriend = (userID: number) => {
    const index = usersFriends.value.findIndex((el: User) => el.id === userID);
    usersFriends.value.splice(index, 1);
  };

  const initUserClick = () => {
    userClick.value = undefined;
  };

  const isMyProfile = computed(() => {
    if (loggedUser.value && userClick.value) {
      if (loggedUser.value.id !== userClick.value.id) {
        return false;
      }
    }
    return true;
  });

  return {
    users,
    loggedUser,
    usersOnline,
    isAuthenticated,
    socketChat,
    statusSocket,
    usersBlocked,
    usersFriends,
    gameSocket,
    isTwoFactorAuth,
    userClick,
    setting_open,
    modalFriends,
    modaleOpenInviteGame,
    leaderboard,
    createUser,
    deleteUser,
    updateUser,
    isBlocked,
    addUserBlocked,
    removeUserBlocked,
    isFriend,
    addUserFriend,
    removeUserFriend,
    initUserClick,
    isMyProfile,
    playersDuo
  };
});
