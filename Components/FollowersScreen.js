import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../supabaseClient";
import ProfilePicture from "./ProfilePicture";
import { AuthContext } from "./Context";
import debounce from "lodash.debounce";

const FollowersPanel = ({ follower }) => {
  return (
    <View
      style={{
        alignItems: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        margin: 8,
        borderRadius: 16,
        borderColor: "#841584",
        borderStyle: "solid",
        borderLeftWidth: 4,
        borderRightWidth: 4,
        padding: 8,
        flexShrink: 1,
      }}
    >
      {/* <View>
        <ProfilePicture
          url={follower.avatar_url}
          isReadOnly={true}
          height={"40px"}
          width={"40px"}
        />
      </View> */}
      <View>
        <Text style={{ marginLeft: 16 }}>{follower.username}</Text>
      </View>
    </View>
  );
};

export default function FollowersScreen({ navigation }) {
  const { followers, getFollowers } = React.useContext(AuthContext);
  // const [followers, setFollowers] = useState(null);
  const [searchProfiles, setSearchProfiles] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    getFollowers();
  }, []);

  useEffect(async () => {
    await getFilteredProfiles();
  }, [searchProfiles]);
  const updateSearch = (e) => setSearchProfiles(e?.target?.value);
  const debouncedOnChange = debounce(updateSearch, 180);

  async function getFilteredProfiles() {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url, about_me, profile_tag`)
        .textSearch("username", searchProfiles);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFilteredProfiles(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView>
      <View className="search-bar">
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Search profile..."
          onChangeText={debouncedOnChange}
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
          id="search-input"
        />
        <View
          style={{
            borderColor: "#841584",
            borderStyle: "solid",
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderRadius: 16,
            margin: 6,
          }}
        >
          {filteredProfiles.length !== 0 &&
            filteredProfiles.map((filteredProfile, index) => (
              <View
                key={index}
                onClick={() =>
                  navigation.navigate("ProfileView", {
                    profiles: filteredProfile,
                  })
                }
              >
                <FollowersPanel follower={filteredProfile} />
              </View>
            ))}
        </View>
      </View>
      {followers &&
        followers.map((follower, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileView", {
                  profiles: follower.profiles,
                })
              }
            >
              <FollowersPanel follower={follower.profiles} />
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
}
