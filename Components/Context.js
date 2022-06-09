import * as React from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = React.createContext();

export const AuthContextProvider = (props) => {
  const [session, setSession] = React.useState(null);
  const [followers, setFollowers] = React.useState(null);

  async function getFollowers() {
    const user = supabase.auth.user();
    const currentsession = supabase.auth.session();
    if (!currentsession) return;
    try {
      const { data, error } = await supabase
        .from("Followers")
        .select("*, profiles:followedUser (*)")
        .eq("followedBy", user.id);

      if (error) {
        throw error;
      }

      if (data.length !== 0) {
        setFollowers(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <AuthContext.Provider
      value={{ session, setSession, followers, setFollowers, getFollowers }}
      {...props}
    />
  );
};
