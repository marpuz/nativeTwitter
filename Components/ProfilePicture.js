import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { View, Image, Text } from "react-native";
export default function ProfilePicture({
  url,
  size,
  onUpload,
  isReadOnly,
  height,
  width,
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event) {
    if (isReadOnly) return;
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={
          avatarUrl ? avatarUrl : process.env.PUBLIC_URL + "/default-avatar.jpg"
        }
        alt="Avatar"
        style={{
          display: "inline-block",
          borderRadius: "50%",
          border: "1px",
          width: width,
          height: height,
        }}
      />
      {!isReadOnly && (
        <View style={{ width: size }}>
          <label
            className="upload-btn text-white display: flex justify-center items-center text-sm rounded-lg border-[2px] border-white mt-3 p-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            htmlFor="single"
          >
            <b>
              {uploading ? (
                "Uploading ..."
              ) : (
                <Text
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Upload
                </Text>
              )}
            </b>
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </View>
      )}
    </View>
  );
}
