import { QueryClient } from "@tanstack/react-query";
import { FlowbiteColors } from "flowbite-react";
import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  query: string[];
  finalQuery: [tagAND: string[], tagOR: string[]],
  finalizeQuery: () => void,
  appendQuery: (input: string) => void,
  removeQuery: (input: string) => void,
  popQuery: () => void,
  initQueryFromURL: (q: string) => void
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
        query: [],
        finalQuery: [[], []],
        appendQuery: (input) => set(produce<GlobalState>((d) => {
          if (d.search.query.indexOf(input) === -1) d.search.query.push(input);
        })),
        removeQuery: (input) => set(produce<GlobalState>((d) => {
          d.search.query = d.search.query.filter(x => x !== input);
        })),
        popQuery: () => set(produce<GlobalState>((d) => {
          d.search.query.pop();
        })),
        finalizeQuery: () => set(produce<GlobalState>(d => {
          d.search.finalQuery = [d.search.query.filter(x => !x.startsWith("+")), d.search.query.filter(x => x.startsWith("+")).map(x => x.slice(1))];
        })),
        initQueryFromURL: (q: string) => set(produce<GlobalState>((d) => {
          let queries = q.split(" ");
          d.search.query = queries;
          d.search.finalQuery = [queries.filter(x => !x.startsWith("+")), queries.filter(x => x.startsWith("+")).map(x => x.slice(1))];
        }))
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