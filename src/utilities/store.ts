import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserState {
  name: string;
  token: string;
  email: string;
  id: string;
}

export interface GlobalState {
  user: UserState | null;
  
  login: (newUser: UserState) => void
  logout: () => void
}

export const State = create<GlobalState>()(
  persist(
    (set) => ({
      user: null,

      login: (newUser: UserState) => set(_ => ({user: newUser})),
      logout: () => set(_ => ({user: null}))
    }),
    {
      name: "app-storage"
    }
  )
)