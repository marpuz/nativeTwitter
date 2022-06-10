import { View, Text, TextInput, Button } from "react-native";
import { supabase } from "../supabaseClient";
import * as React from "react";
import { AuthContext } from "./Context";

const CreateAccount = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user, setUser] = React.useState(null);
  const { setSession } = React.useContext(AuthContext);
  const username = Math.random() * 9999999999;
  const website = "www.example.com";
  const avatar_url = "0.8063897619680429.jpg";
  const about_me = "Example";
  const profile_tag = username;

  React.useEffect(() => {
    if (user !== null) {
      updateProfile({
        user,
        username,
        website,
        avatar_url,
        about_me,
        profile_tag,
      });
    }
  }, [user]);

  async function follow(user) {
    try {
      const { data, error } = await supabase
        .from("Followers")
        .insert([{ followedBy: user.id, followedUser: user.id }]);

      if (error) {
        throw error;
      }

      if (data) {
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateProfile({
    user,
    username,
    website,
    avatar_url,
    about_me,
  }) {
    try {
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
        about_me,
        profile_tag,
      };
      setSession(supabase.auth.session());
      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      follow(user);
    }
  }

  const handleRegister = async () => {
    try {
      let { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      setUser(user);
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 48 }}>Sign up</Text>
      <TextInput
        style={{
          borderColor: "#841584",
          borderStyle: "solid",
          borderLeftWidth: 4,
          borderRightWidth: 4,
          padding: 8,
          borderRadius: 16,
          textAlign: "center",
          fontSize: 16,
          height: 32,
          width: "40%",
          margin: 8,
        }}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder={"Email"}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        style={{
          borderColor: "#841584",
          borderStyle: "solid",
          borderLeftWidth: 4,
          borderRightWidth: 4,
          padding: 8,
          borderRadius: 16,
          textAlign: "center",
          fontSize: 16,
          height: 32,
          width: "40%",
          margin: 8,
        }}
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={(pswrd) => setPassword(pswrd)}
        secureTextEntry={true}
        value={password}
        placeholder={"Password"}
      />
      <Button
        onPress={(e) => {
          e.preventDefault();
          handleRegister(email, password);
        }}
        title="Register"
        color="#841584"
        accessibilityLabel="Register"
      />
    </View>
  );
};

export default CreateAccount;
