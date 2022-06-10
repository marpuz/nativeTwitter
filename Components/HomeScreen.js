import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import Post from "./Post";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";

export default function HomeScreen({ navigation }) {
  const session = supabase.auth.session();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const user = supabase.auth.user();
  const [allPosts, setAllPosts] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { followers } = React.useContext(AuthContext);

  useEffect(() => {
    getPosts(allPosts);
  }, [session, allPosts, followers, refresh]);

  async function getPosts(allPosts) {
    allPosts ? getAllPosts() : getFollowersPosts();
  }

  async function getAllPosts() {
    if (!session) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(`*, profiles:user_id (username, avatar_url, profile_tag)`);

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(
          data.flatMap((data) => data).sort((a, b) => b.post_id - a.post_id)
        );
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getFollowersPosts() {
    if (!session) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Followers")
        .select(
          "*, profiles!inner(*, posts!inner(*, profiles:user_id (username, avatar_url, profile_tag)))"
        )
        .eq("followedBy", user.id);

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(
          data
            .flatMap((data) => data.profiles.posts)
            .sort((a, b) => b.post_id - a.post_id)
        );
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPost = async (content) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .insert([{ content: content, user_id: user.id }]);
      setPostContent("");
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={{}}>
        <Button
          onPress={() => setAllPosts(!allPosts)}
          style={{ fontSize: 26, fontWeight: "bold", margin: 12 }}
          title={
            allPosts
              ? "Display: all posts, click to change"
              : "Display: following users, click to change"
          }
          color="#841584"
          margin="12px"
        />
        <View style={{ width: "100%" }}>
          <TextInput
            style={{
              height: 64,
              width: "96%",
              margin: 8,
              borderWidth: 1,
              padding: 10,
              fontSize: 16,
              borderRadius: 16,
              borderColor: "#841584",
              borderStyle: "solid",
              borderLeftWidth: 4,
              borderRightWidth: 4,
            }}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={"Write your post!"}
            value={postContent || ""}
            onChangeText={(e) => setPostContent(e)}
          />
          <Button
            onPress={() => {
              handleAddPost(postContent);
              setRefresh(refresh + 1);
            }}
            style={{ fontSize: 16, fontWeight: "bold", margin: 12 }}
            title={"POST!"}
            color="#841584"
            width="48px"
            margin="12px"
          />
        </View>
      </View>
      {posts &&
        posts.map((post, index) => (
          <View key={index} style={{ width: "100%" }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileView", { profile: post })
              }
            >
              <Post post={post} key={index} />
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
}
