import * as React from "react";
import { View, Text, Button } from "react-native";
import ProfilePicture from "./ProfilePicture";
import { formatDistanceToNow } from "date-fns";

export default function Post({ post, navigation }) {
  return (
    <View
      style={{
        alignItems: "flex-start",
        flexDirection: "row",
        margin: "0.5rem",
        border: "1px solid black",
        borderRadius: "16px",
        padding: "0.5rem",
        flexShrink: 1,
      }}
    >
      <ProfilePicture
        url={post.profiles.avatar_url}
        height={"3rem"}
        width={"3rem"}
        isReadOnly={true}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "0.5rem",
          flex: 1,
          flexShrink: 1,
        }}
      >
        <Text style={{ fontSize: "0.8rem" }}>
          {post.profiles.username} @{post.profiles.profile_tag}
        </Text>
        <Text style={{ fontSize: "1rem" }}>{post.content}</Text>
        <Text style={{ fontSize: "0.7rem" }}>
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
