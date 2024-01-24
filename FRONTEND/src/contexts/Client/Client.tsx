import React, { useEffect } from "react";

import { ClientContextType, TokenStoreType, AuthStatus } from "./types";

const defaultContext: ClientContextType = {
  status: "anonymous",
  login: () => () => {},
  get: () => () => {},
  post: () => () => {},
  put: () => () => {},
  patch: () => () => {},
  deletion: () => () => {},
  setStatus: () => {},
  refreshTokenStore: {  get: () => "", set: () => {}, clear: () => {} }
};

export const ClientContext =
  React.createContext<ClientContextType>(defaultContext);

export const makeClientProvider =
  (refreshTokenStore: TokenStoreType): React.FC<any> =>
  ({ children }) => {
    const [status, setStatus] = React.useState<AuthStatus>("anonymous");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const login = (
      path: string,
      body: { username: string; password: string },
      successCallback: (ret: any) => void,
      failureCallback = () => {}
    ) => {
      let active = true;

      console.log("path", path)

      fetch(`${process.env.REACT_APP_URL_API}/${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((ret) => {
          console.log("ret", ret)
          if (active && ret) {
            if (ret.errors) 
            {
              setStatus("anonymous");
              failureCallback();
            }
            else {
              refreshTokenStore.set(ret.token);
              setStatus("authenticated");
              successCallback(ret);
            }
          }
        });
      return () => {
        active = false;
      };
    };

    const get = (
      path: string,
      successCallback: (ret: any) => void,
      toJson = true,
      failureCallback = () => {}
    ) => {
      let active = true;
      fetch(`${process.env.REACT_APP_URL_API}/${path}`, { method: "GET", headers })
        .then((res) => (toJson ? res.json() : res.blob()))
        .then((ret) => {
          if (active && ret)
            ret.errors ? failureCallback() : successCallback(ret);
        });
      return () => {
        active = false;
      };
    };

    const post = (
      path: string,
      data: any,
      successCallback: ((createdId: string) => void) | (() => void),
      failureCallback: () => void
    ) => {
      let active = true;
      fetch(`${process.env.REACT_APP_URL_API}/${path}`, { method: "POST", headers, body: JSON.stringify(data) }).then((res) => {
        if (
          active &&
          (res.status === 201 || res.status === 204 || res.status === 202)
        ) {
          /* Get ID of the created resource if it exists */
          const createdId = res.headers.get("Location")?.split("/")?.pop()!;
          return successCallback(createdId);
        } else {
          return failureCallback();
        }
      });
      return () => {
        active = false;
      };
    };

    const put = (
      path: string,
      data: any,
      successCallback: () => void,
      failureCallback: () => void
    ) => {
      let active = true;
      fetch(`${process.env.REACT_APP_URL_API}/${path}`, { method: "PUT", headers, body: data }).then((res) => {
        return active && res.status === 202
          ? successCallback()
          : failureCallback();
      });
      return () => {
        active = false;
      };
    };

    const patch = (
      path: string,
      data: any,
      successCallback: () => void,
      failureCallback: () => void
    ) => {
      let active = true;
      fetch(`${process.env.REACT_APP_URL_API}/${path}`, { method: "PATCH", headers, body: data }).then((res) => {
        return active && res.status === 202
          ? successCallback()
          : failureCallback();
      });
      return () => {
        active = false;
      };
    };

    const deletion = (
      path: string,
      data: any,
      successCallback: () => void,
      failureCallback: (errorMessage: string) => void
    ) => {
      let active = true;
      fetch(`${process.env.REACT_APP_URL_API}/${path}`, { method: "DELETE", headers, body: data })
        .then((res) => {
          if (res.status === 202) {
            return null;
          }
          return res.json();
        })
        .then((ret) => {
          if (active) {
            if (ret && ret.errors) failureCallback(ret.errors[0].message);
            else successCallback();
          }
        });
      return () => {
        active = false;
      };
    };

    useEffect(() => {
      const token = refreshTokenStore.get();

      if (token) setStatus("authenticated");


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
