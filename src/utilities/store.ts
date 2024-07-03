import { QueryClient } from "@tanstack/react-query";
import { FlowbiteColors } from "flowbite-react";
import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type showKeys<T extends keyof any> = T extends any ? T : never;

export interface QueryState {
  queryClient: QueryClient,
  setQueryClient: (q: QueryClient) => void
}

export interface UserState {
  name: string;
  token: string;
  email: string;
  id: string;
}

export interface AlertState {
  text: string | string[];
  type: keyof FlowbiteColors;
  setAlert: (text: string | string[], type: keyof FlowbiteColors) => void;
  closeAlert: () => void;
}

export interface SearchState {
  /** Untuk searchbar saja */
  text: string;
  setText: (input: string) => void

  /** Untuk pencarian dan lempar ke aplikasi */
  query: string;
  setQuery: (input: string) => void
}

export interface GlobalState {
  user: UserState | null;
  search: SearchState;
  alert: AlertState;
  query: QueryState;
  
  login: (newUser: UserState) => void
  logout: () => void,
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      user: null,
      search: {
        text: "",
        query: "",
        setQuery: (input) => set(produce<GlobalState>((s) => { s.search.query = input })),
        setText: (input) => set(produce<GlobalState>((s) => { s.search.text = input })),
      },
      alert: {
        text: "",
        type: '',
        setAlert(text, type) {
          set(produce<GlobalState>((s) => {
            s.alert.text = text;
            s.alert.type = type;
          }))
        },
        closeAlert() {
          set(produce<GlobalState>((s) => {
            s.alert.text = "";
            s.alert.type = "";
          }))
        },
      },
      query: {
        queryClient: new QueryClient({
          defaultOptions: {
            queries: {
              // With SSR, we usually want to set some default staleTime
              // above 0 to avoid refetching immediately on the client
              staleTime: 60 * 1000,
            },
          },
        }),
        setQueryClient: (q: QueryClient) => set(produce<GlobalState>(s => { s.query.queryClient = q }))
      },

      login: (newUser: UserState) => set(produce(s => {s.user = newUser})),
      logout: () => set(produce<GlobalState>(s => {s.user = null})),
    }),
    {
      name: "app-storage",
      partialize: state => [state.user, state.login, state.logout]
    }
  )
)