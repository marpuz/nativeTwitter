import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { supabase } from "../supabaseClient";
import * as React from "react";

const CreateAccount = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleRegister = async () => {
    try {
      let { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setPassword("");
      setEmail("");
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
