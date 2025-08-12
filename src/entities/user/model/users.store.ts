import { create } from "zustand";
import type { IUserPublic } from "../types";

interface IUserStore {
  user: IUserPublic | null;
  setUser: (user: IUserPublic) => void;
  signoutUser: () => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  // описание слайса
  //   user: {
  // стартовые значения
  //     id: null,
  //     email: null,
  //   },
  user: null,
  setUser: (user) => set({ user: { id: user.id, email: user.email } }),
  signoutUser: () => set({ user: null }),
  // пример использования
  // load: false,
  // изменение
  // changeLoader: () => set((state) => ({ load: !state.load })),
}));
