import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";
import ProfilePicture from "./ProfilePicture";

export default function SettingsScreen({ navigation }) {
  const { session, setSession } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [about_me, setAboutMe] = useState(null);
  const [profile_tag, setPorifleTag] = useState(null);
  const [id, setId] = useState(null);
  const user = supabase.auth.user();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    if (!session) return;
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url, about_me, profile_tag`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setAboutMe(data.about_me);
        setPorifleTag(data.profile_tag);
        setId(data.id);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url, about_me }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
        about_me,
        profile_tag: username.replace(/ /g, ""),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      setPorifleTag(username.replace(/ /g, ""));
      window.location.reload();
    }
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ProfilePicture
        url={avatar_url}
        size={"7rem"}
        height={"7rem"}
        width={"7rem"}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <Text style={{ fontSize: "0.6rem" }}>@{profile_tag}</Text>
      <View
        style={{
          width: "22rem",
          height: "5rem",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <label htmlFor="username">Name</label>
        <input
          style={{
            height: "1.5rem",
            width: "90%",
            margin: "0.5rem",
            borderWidth: 1,
            padding: 10,
            fontSize: "1rem",
            borderRadius: "16px",
            border: "1px solid gray",
          }}
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </View>
      <View
        style={{
          width: "22rem",
          height: "5rem",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <label htmlFor="website">Website</label>
        <input
          style={{
            height: "1.5rem",
            width: "90%",
            margin: "0.5rem",
            borderWidth: 1,
            padding: 10,
            fontSize: "1rem",
            borderRadius: "16px",
            border: "1px solid gray",
          }}
          id="website"
          type="website"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </View>
      <View
        style={{
          width: "22rem",
          height: "5rem",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <label htmlFor="about_me">About me</label>
        <div>
          <textarea
            style={{
              height: "8rem",
              width: "20rem",
              margin: "0.5rem",
              borderWidth: 1,
              padding: 10,
              fontSize: "1rem",
              borderRadius: "16px",
              border: "1px solid gray",
            }}
            id="about_me"
            type="text"
            value={about_me || ""}
            onChange={(e) => setAboutMe(e.target.value)}
          />
        </div>
      </View>
      <View
        style={{
          flex: 1,
          width: "20rem",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button
          onPress={() =>
            updateProfile({ username, website, avatar_url, about_me })
          }
          style={{ fontSize: 26, fontWeight: "bold", margin: 12 }}
          title="Update Profile!"
          color="#841584"
          margin="12px"
        />
        <Button
          onPress={() => {
            supabase.auth.signOut();
            setSession(null);
          }}
          style={{ fontSize: 26, fontWeight: "bold", margin: 12 }}
          title="Sign out"
          color="#841584"
          accessibilityLabel="Sign in"
        />
      </View>
    </View>
  );
}
