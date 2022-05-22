import * as React from "react";
import { View, Text, Button } from "react-native";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";

export default function SettingsScreen({ navigation }) {
  const { session, setSession } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => navigation.navigate("Home")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Settings Screen
      </Text>
      <Button
        onPress={() => {
          supabase.auth.signOut();
          setSession(null);
        }}
        title="Sign out"
        color="#841584"
        accessibilityLabel="Sign in"
      />
    </View>
  );
}
