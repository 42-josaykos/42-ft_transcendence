import { defineStore } from 'pinia';
import { ref, computed } from '@vue/reactivity';
import type { User } from '@/models/user.model';
import { io, type Socket } from 'socket.io-client';

// Tracks users database
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const usersOnline = ref<Number[]>([]);
  const loggedUser = ref<User | undefined>();
  const gameSocket = ref<Socket>(
    io('ws://localhost:6060/game', {
      withCredentials: true
    })
  );
  const isAuthenticated = ref(false);
  const socketChat = ref<Socket>();
  const usersBlocked = ref<User[]>([]);
  const usersFriends = ref<User[]>([]);
  const isTwoFactorAuth = ref<boolean>(false);
  const userClick = ref<User>();
  const setting_open = ref<boolean>(false);

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
      usersBlocked.value.findIndex(el => el.id === user.id) != -1
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
      usersFriends.value.findIndex(el => el.id === user.id) != -1
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
    usersBlocked,
    usersFriends,
    gameSocket,
    isTwoFactorAuth,
    userClick,
    setting_open,
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
    isMyProfile
  };
});
