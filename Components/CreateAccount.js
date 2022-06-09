import { View, Text, TextInput, Button } from "react-native";
import { supabase } from "../supabaseClient";
import * as React from "react";
import { AuthContext } from "./Context";

const CreateAccount = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user, setUser] = React.useState(null);
  const { session, setSession } = React.useContext(AuthContext);
  const username = Math.random() * 9999999999;
  const website = "www.example.com";
  const avatar_url = "0.8063897619680429.jpg";
  const about_me = "Example";
  const profile_tag = username;

  React.useEffect(() => {
    if (user !== null)
      updateProfile({
        user,
        username,
        website,
        avatar_url,
        about_me,
        profile_tag,
      });
  }, [user]);

  async function updateProfile({
    user,
    username,
    website,
    avatar_url,
    about_me,
  }) {
    try {
      setLoading(true);

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
      setLoading(false);
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
      <Text style={{ fontSize: "3rem" }}>Sign up</Text>
      <TextInput
        style={{
          border: "1px solid gray",
          padding: "0.5rem",
          borderRadius: "16px",
          textAlign: "center",
          fontSize: "1rem",
          height: "2rem",
          width: "40%",
          margin: "0.5rem",
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
          border: "1px solid gray",
          padding: "0.5rem",
          borderRadius: "16px",
          textAlign: "center",
          fontSize: "1rem",
          height: "2rem",
          width: "40%",
          margin: "0.5rem",
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
