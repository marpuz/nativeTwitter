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
        margin: 8,
        borderRadius: 16,
        borderColor: "#841584",
        borderStyle: "solid",
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderRadius: 16,
        padding: 8,
        flexShrink: 1,
      }}
    >
      <ProfilePicture
        url={post.profiles.avatar_url}
        height={48}
        width={48}
        isReadOnly={true}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 8,
          flex: 1,
          flexShrink: 1,
        }}
      >
        <Text style={{ fontSize: 14 }}>
          {post.profiles.username} @{post.profiles.profile_tag}
        </Text>
        <Text style={{ fontSize: 16 }}>{post.content}</Text>
        <Text style={{ fontSize: 12 }}>
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
