import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { View, Image, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ProfilePicture({
  url,
  size,
  onUpload,
  isReadOnly,
  height,
  width,
}) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(data);
      fileReaderInstance.onload = () => {
        base64data = fileReaderInstance.result;
        setAvatarUrl(base64data);
      };
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(photo) {
    if (!photo.cancelled) {
      const ext = photo.uri.substring(photo.uri.lastIndexOf(".") + 1);
      const fileName = `${Math.random() * 10000000}.${ext}`;

      var formData = new FormData();
      formData.append("files", {
        uri: photo.uri,
        name: fileName,
        type: photo.type ? `image/${ext}` : `video/${ext}`,
      });

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, formData);
      onUpload(fileName);
      if (error) throw new Error(error.message);
      return { ...photo, imageData: data };
    } else {
      return photo;
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    try {
      return await uploadAvatar(result);
    } catch (e) {}
  };

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          alt="Avatar"
          style={{ width: width, height: height }}
        />
      ) : (
        <View />
      )}
      <Text> </Text>
      {!isReadOnly ? (
        <View>
          <TouchableOpacity activeOpacity={0.5} onPress={pickImage}>
            <Text>Select File</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}
