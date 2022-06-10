import * as React from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";

export default function SignIn({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const user = supabase.auth.user();
  const { session, setSession } = React.useContext(AuthContext);

  const handleSignIn = async (email, password) => {
    try {
      let { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });

      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
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
      <Text style={{ fontSize: 48 }}>Sign in</Text>
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
          width: "60%",
          margin: 8,
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
          borderColor: "#841584",
          borderStyle: "solid",
          borderLeftWidth: 4,
          borderRightWidth: 4,
          padding: 8,
          borderRadius: 16,
          textAlign: "center",
          fontSize: 16,
          height: 32,
          width: "60%",
          margin: 8,
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
