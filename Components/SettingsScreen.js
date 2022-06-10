import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";
import ProfilePicture from "./ProfilePicture";

export default function SettingsScreen({ navigation }) {
  const { session, setSession } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [about_me, setAboutMe] = useState("");
  const [profile_tag, setPorifleTag] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [id, setId] = useState("");
  const user = supabase.auth.user();

  useEffect(() => {
    getProfile();
  }, [refresh]);

  async function getProfile() {
    // if (!session) return;
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
    }
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ProfilePicture
        url={avatar_url}
        height={128}
        width={128}
        onUpload={(url) => {
          setAvatarUrl(url);
        }}
        isReadOnly={false}
      />
      <Text style={{ fontSize: 14 }}>@{profile_tag}</Text>
      <View
        style={{
          width: 356,
          height: 80,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <Text>Name</Text>
        <TextInput
          style={{
            height: 48,
            width: "90%",
            margin: 8,
            borderWidth: 1,
            padding: 10,
            fontSize: 16,
            borderRadius: 16,
            borderColor: "#841584",
            borderStyle: "solid",
            borderLeftWidth: 4,
            borderRightWidth: 4,
          }}
          id="username"
          type="text"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View
        style={{
          width: 356,
          height: 80,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <Text>Website</Text>
        <TextInput
          style={{
            height: 48,
            width: "90%",
            margin: 8,
            borderWidth: 1,
            padding: 10,
            fontSize: 16,
            borderRadius: 16,
            borderColor: "#841584",
            borderStyle: "solid",
            borderLeftWidth: 4,
            borderRightWidth: 4,
          }}
          id="website"
          type="website"
          value={website || ""}
          onChangeText={(text) => setWebsite(text)}
        />
      </View>
      <View
        style={{
          width: 356,
          height: 80,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <Text>About me</Text>
        <View>
          <TextInput
            style={{
              height: 128,
              width: 320,
              margin: 8,
              borderWidth: 1,
              padding: 10,
              fontSize: 16,
              borderRadius: 16,
              borderColor: "#841584",
              borderStyle: "solid",
              borderLeftWidth: 4,
              borderRightWidth: 4,
            }}
            multiline={true}
            numberOfLines={5}
            id="about_me"
            type="text"
            value={about_me || ""}
            onChangeText={(text) => setAboutMe(text)}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: 320,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button
          onPress={() => {
            updateProfile({ username, website, avatar_url, about_me });
            setRefresh(refresh + 1);
          }}
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
