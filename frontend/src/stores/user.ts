import { defineStore } from 'pinia';
import type { User } from '@/models/user.model';

export type UserState = {
  users: User[];
};

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      users: []
    } as UserState),
  actions: {
    create(newUser: User) {
      this.users.push(newUser);
    },
    delete(id: number) {
      const index = this.users.findIndex((el: any) => el.id === id);
      this.users.splice(index, 1);
    },
    update(id: number, updatedData: any) {
      const index = this.users.findIndex((el: any) => el.id === id);
      this.users.splice(index, 1, { ...this.users[index], ...updatedData });
    },
    setState(data: User[]) {
      this.users = data;
    }
  }
});
