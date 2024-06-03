import { produce } from "immer";
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
  search: string;
  
  login: (newUser: UserState) => void
  logout: () => void,
  setSearch: (input: string) => void
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      user: null,
      search: "",

      login: (newUser: UserState) => set(produce(s => {s.user = newUser})),
      logout: () => set(produce<GlobalState>(s => {s.user = null})),
      setSearch: (input) => set(produce<GlobalState>((s) => { s.search = input }))
    }),
    {
      name: "app-storage",
      partialize: state => {
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['search', 'setSearch'].includes(key))
        )
      }
    }
  )
)