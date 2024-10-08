import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  setAuth: (authUser: any) => {},
  setUserData: (userdata: any) => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  const setAuth = (authUser: any) => {
    setUser(authUser);
  };

  const setUserData = (userdata: any) => {
    setUser({ ...userdata });
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
