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

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Sign in</Text>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={(pswrd) => setPassword(pswrd)}
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
      <Text>{email}</Text>
      <Text>{password}</Text>
      <Text>{session !== null ? "asd" : "asdfe"}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 160,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
