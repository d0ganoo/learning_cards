import React, { useEffect } from "react";
import { AuthStatus, ClientContextType, TokenStoreType } from "./types";

const defaultContext: ClientContextType = {
  status: "anonymous",
  login: async () => Promise.resolve({} as any),
  get: async () => Promise.resolve({} as any),
  post: async () => Promise.resolve({} as any),
  put: async () => Promise.resolve({} as any),
  patch: async () => Promise.resolve({} as any),
  deletion: async () => Promise.resolve(),
  setStatus: () => { },
  refreshTokenStore: { get: () => "", set: () => { }, clear: () => { } },
};

export const ClientContext = React.createContext<ClientContextType>(defaultContext);

export const makeClientProvider =
  (refreshTokenStore: TokenStoreType): React.FC<any> =>
    ({ children }) => {
      const [status, setStatus] = React.useState<AuthStatus>("anonymous");

      const headers = () => ({
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshTokenStore.get()}`,
      });

      // Login function
      const login = async (path: string, body: { username: string; password: string }) => {
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data?.token) {
          refreshTokenStore.set(data.token);
          setStatus("authenticated");
          return data;
        } else {
          setStatus("anonymous");
          throw new Error(data.errors?.[0]?.message || "Login failed");
        }
      };

      // Generic GET function
      const get = async <R = any>(path: string, toJson = true): Promise<R> => {
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
          method: "GET",
          headers: headers(),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return toJson ? response.json() : (response.blob() as unknown as R);
      };

      // Generic POST function
      const post = async <R = any>(path: string, data: any): Promise<R> => {
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(data),
        });
    
        if (!response.ok) {
            throw new Error("Failed to post data");
        }
    
        // Tente de parser la réponse JSON si elle existe, sinon retourne un objet vide
        try {
            return await response.json();
        } catch (error) {
            console.warn("La réponse ne contient pas de JSON valide.");
            return {} as R; // Renvoie un objet vide si le parsing échoue
        }
    };
    
      

      // Generic PUT function
      const put = async <R = any>(path: string, data: any): Promise<R> => {
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
          method: "PUT",
          headers: headers(),
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Failed to update data");
        }
        return response.json();
      };

      // Generic PATCH function
      const patch = async <R = any>(path: string, data: any): Promise<R> => {
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
          method: "PATCH",
          headers: headers(),
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Failed to patch data");
        }
        return response.json();
      };

      // Generic DELETE function
      const deletion = async (path: string): Promise<void> => {
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
          method: "DELETE",
          headers: headers(),
        });
        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
      };

      useEffect(() => {
        const token = refreshTokenStore.get();
        if (token)
          setStatus("authenticated")
        else
          setStatus("anonymous")

      }, []);

      return (
        <ClientContext.Provider
          value={{ status, setStatus, login, get, post, put, patch, deletion, refreshTokenStore }}
        >
          {children}
        </ClientContext.Provider>
      );
    };

const AUTH_STORAGE_KEY = "auth";
const refreshTokenStore: TokenStoreType = {
  get: () => localStorage.getItem(AUTH_STORAGE_KEY),
  set: (val) => localStorage.setItem(AUTH_STORAGE_KEY, val),
  clear: () => localStorage.removeItem(AUTH_STORAGE_KEY),
};

export const ClientProvider = makeClientProvider(refreshTokenStore);
ClientProvider.displayName = "ClientProvider";

export const useClient = () => React.useContext(ClientContext);
