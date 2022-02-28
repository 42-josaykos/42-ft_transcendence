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
    create() {},
    delete(id: number) {
      this.users = this.users.filter((t: any) => t.id !== id);
    }
  }
});
