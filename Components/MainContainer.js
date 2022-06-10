import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";

// Screens
import HomeScreen from "./HomeScreen";
import FollowersScreen from "./FollowersScreen";
import SettingsScreen from "./SettingsScreen";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import ProfileView from "./ProfileView";
import ProfileVieww from "./ProfileVieww";

//Screen names
const homeName = "Home";
const followersName = "Followers";
const settingsName = "Settings";
const profileName = "ProfileView";
const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  //screenOptions={{ headerShown: false }}
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="ProfileView" component={ProfileView} />
  </HomeStack.Navigator>
);

const FollowersStack = createStackNavigator();
const FollowersStackScreen = () => (
  //screenOptions={{ headerShown: false }}
  <FollowersStack.Navigator>
    <FollowersStack.Screen name="Followers" component={FollowersScreen} />
    <FollowersStack.Screen name="ProfileView" component={ProfileVieww} />
  </FollowersStack.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);

const MainAppScreen = () => (
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === homeName) {
          iconName = focused ? "home" : "home-outline";
        } else if (rn === followersName) {
          iconName = focused ? "list" : "list-outline";
        } else if (rn === settingsName) {
          iconName = focused ? "settings" : "settings-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name={homeName}
      component={HomeStackScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name={followersName}
      component={FollowersStackScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen name={settingsName} component={SettingsScreen} />
  </Tab.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    {userToken ? (
      <RootStack.Screen
        name="Main"
        component={MainAppScreen}
        screenOptions={{ headerShown: false }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        screenOptions={{ headerShown: false }}
      />
    )}
  </RootStack.Navigator>
);

export default function MainContainer() {
  const [userToken, setUserToken] = React.useState(null);
  const { session, setSession } = React.useContext(AuthContext);

  React.useEffect(() => {
    setUserToken(supabase.auth.user());
  }, [session]);

  return (
    <NavigationContainer>
      <RootStackScreen userToken={userToken} />
    </NavigationContainer>
  );
}
