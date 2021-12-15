import React, { createContext, useState } from "react";
import { removeToken, saveToken } from "../localStorage";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    isLogin: false,
    username: null,
    address: null,
    avatar: null,
    balance: 0
  });
  const login = (data) => {
    setUser({
      isLogin: true,
      username: data.username,
      address: data.address,
      avatar: data.avatar,
      banner: data.banner,
      balance: data.balance
    });
    saveToken({address: data.address});
  };

  const logout = () => {
    setUser((user) => ({ ...user, isLogin: false }));
    removeToken();
  };

  return (
    <AppContext.Provider value={{ user, setUser, login, logout }}>{children}</AppContext.Provider>
  );
}
