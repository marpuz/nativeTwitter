import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { supabase } from "../supabaseClient";
import ProfilePicture from "./ProfilePicture";
import debounce from "lodash.debounce";

const FollowersPanel = ({ follower }) => {
  return (
    <View
      style={{
        alignItems: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        margin: "0.5rem",
        border: "1px solid black",
        borderRadius: "16px",
        padding: "0.5rem",
        flexShrink: 1,
      }}
    >
      <div>
        <ProfilePicture
          url={follower.avatar_url}
          isReadOnly={true}
          height={"40px"}
          width={"40px"}
        />
      </div>
      <div>
        <Text style={{ marginLeft: "1rem" }}>{follower.username}</Text>
      </div>
    </View>
  );
};

export default function FollowersScreen({ navigation }) {
  const [followers, setFollowers] = useState(null);
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

  async function getFollowers() {
    const session = supabase.auth.session();
    if (!session) return;
    const user = supabase.auth.user();

    try {
      const { data, error } = await supabase
        .from("Followers")
        .select("*, profiles:followedUser (*)")
        .eq("followedBy", user.id);

      if (error) {
        throw error;
      }

      if (data.length !== 0) {
        setFollowers(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <ScrollView>
      <div className="search-bar">
        <input
          placeholder="Search profile..."
          onChange={debouncedOnChange}
          style={{
            border: "1px solid gray",
            padding: "0.5rem",
            borderRadius: "16px",
            height: "1.5rem",
            width: "90%",
            margin: "0.5rem",
          }}
          className="rounded-lg border-[1px] border-gray-600 w-full pl-2 ml-1 bg-gray-900 p-2 m-[.5em]"
          id="search-input"
        />
        <div
          style={{
            border: "2px solid silver",
            borderRadius: "16px",
            margin: "6px",
          }}
        >
          {filteredProfiles.length !== 0 &&
            filteredProfiles.map((filteredProfile, index) => (
              <div
                key={index}
                onClick={() =>
                  navigation.navigate("ProfileView", {
                    profiles: filteredProfile,
                  })
                }
              >
                <FollowersPanel follower={filteredProfile} />
              </div>
            ))}
        </div>
      </div>
      {followers &&
        followers.map((follower, index) => (
          <div
            key={index}
            onClick={() =>
              navigation.navigate("ProfileView", {
                profiles: follower.profiles,
              })
            }
          >
            <FollowersPanel follower={follower.profiles} />
          </div>
        ))}
    </ScrollView>
  );
}
