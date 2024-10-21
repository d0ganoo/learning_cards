import React from "react";


import { useClient } from "../Client/Client";
import { UserContextType, UserDataContextType } from "./types";

export const UserContext = React.createContext<UserContextType>({
  user: undefined,
  refreshUser: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [me, setMe] = React.useState<UserDataContextType>(undefined);
  const { status, get } = useClient();
  React.useEffect(() => {
    if (status === "authenticated") {
      return get<{ data: UserDataContextType }>("me", ({ data }) =>
        setMe(data)
      );
    } else {
      setMe(undefined);
    }
  }, [status, get]);

  const refreshUser = () =>
    get<{ data: UserDataContextType }>("me", ({ data }) => setMe(data));

  return (
    <UserContext.Provider value={{ user: me, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);