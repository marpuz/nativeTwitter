import { View, Text, ScrollView, Button } from "react-native";
import { useEffect, useState, useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import { supabase } from "../supabaseClient";
import Post from "./Post";
import { AuthContext } from "./Context";

export default function ProfileView({ route, navigation }) {
  const user = supabase.auth.user();
  const id = route.params.profiles.id;
  const [website, setWebsite] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [about_me, setAboutMe] = useState("");
  const [username, setUserName] = useState("");
  const [usersProfile, setUserProfile] = useState(false);
  const [followers, setFollowers] = useState(false);
  const [posts, setPosts] = useState(null);
  const { getFollowers } = useContext(AuthContext);

  useEffect(async () => {
    await getProfile();
  }, [id]);

  useEffect(() => {
    isFollowers();
    if (user.id === id) {
      setUserProfile(true);
    }
  }, [id, followers]);

  useEffect(() => {
    getPosts();
  }, [id]);

  async function getProfile() {
    try {
      const name = route.params.profiles.profile_tag;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, website, avatar_url, about_me, username`)
        .eq("profile_tag", name)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setAboutMe(data.about_me);
        setUserName(data.username);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function isFollowers() {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("Followers")
        .select("*")
        .eq("followedBy", user.id)
        .eq("followedUser", id);

      if (error) {
        throw error;
      }

      if (data.length !== 0) {
        setFollowers(true);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function getPosts() {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`*, profiles:user_id (username, avatar_url, profile_tag)`)
        .eq(`user_id`, id);

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(data.sort((a, b) => a - b));
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function follow() {
    try {
      const { data, error } = await supabase
        .from("Followers")
        .insert([{ followedBy: user.id, followedUser: id }]);

      if (error) {
        throw error;
      }

      if (data) {
        setFollowers(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getFollowers();
    }
  }

  async function unfollow() {
    try {
      const { data, error } = await supabase
        .from("Followers")
        .delete()
        .eq("followedBy", user.id)
        .eq("followedUser", id);
      if (error) {
        throw error;
      }

      if (data) {
        setFollowers(false);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      getFollowers();
    }
  }
  return (
    <ScrollView>
      <ProfilePicture
        url={avatar_url}
        height={"10rem"}
        width={"10rem"}
        isReadOnly={true}
      />
      <Text style={{ textAlign: "center" }}>
        <span style={{ fontSize: "1rem" }}>{username}</span>
      </Text>
      <Text style={{ textAlign: "center" }}>
        <span style={{ fontSize: "0.8rem" }}>
          {" "}
          @{route.params.profiles.profile_tag}
        </span>
      </Text>
      <Text style={{ textAlign: "center" }}>
        <span style={{ fontSize: "1rem" }}>{website}</span>
      </Text>
      <Text style={{ textAlign: "center" }}>
        <span style={{ fontSize: "1rem" }}>{about_me}</span>
      </Text>
      {!usersProfile ? (
        !followers ? (
          <Button
            onPress={follow}
            style={{ fontSize: 26, fontWeight: "bold", margin: 12 }}
            title="Follow!"
            color="#841584"
            margin="12px"
          />
        ) : (
          <Button
            onPress={unfollow}
            style={{ fontSize: 26, fontWeight: "bold", margin: 12 }}
            title="Unfollow!"
            color="#841584"
            margin="12px"
          />
        )
      ) : (
        <></>
      )}
      {posts &&
        posts.map((post, index) => (
          <div key={index} style={{ width: "100vw", display: "block" }}>
            <Post post={post} key={index} />
          </div>
        ))}
    </ScrollView>
  );
}
