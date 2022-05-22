import * as React from "react";

export const AuthContext = React.createContext();

export const AuthContextProvider = (props) => {
  const [session, setSession] = React.useState(null);
  return <AuthContext.Provider value={{ session, setSession }} {...props} />;
};
