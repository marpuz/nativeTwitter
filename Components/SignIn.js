import * as React from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { supabase } from "../supabaseClient";
import { useAuthContext } from "./context";
import { AuthContext } from "./Context";

export default function SignIn({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const user = supabase.auth.user();
  const { session, setSession } = React.useContext(AuthContext);

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      let { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });

      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
      setPassword("");
      setEmail("");
      setSession(supabase.auth.session());
    }
  };
  const goToRegister = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: "3rem" }}>Sign in</Text>
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
        placeholder={"Email"}
        keyboardType="email-address"
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
        placeholder={"Password"}
        value={password}
      />
      <Button
        onPress={(e) => {
          e.preventDefault();
          handleSignIn(email, password);
        }}
        title="Sign in"
        color="#841584"
        accessibilityLabel="Sign in"
      />
      <Button
        onPress={() => {
          goToRegister();
        }}
        title="Go to register page!"
        color="#841584"
        accessibilityLabel="Sign in"
      />
    </View>
  );
}
