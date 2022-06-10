import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import DocumentPicker from "react-native-document-picker";

export default function ProfilePicture({
  url,
  size,
  onUpload,
  isReadOnly,
  height,
  width,
}) {
  const [avatarUrl, setAvatarUrl] = useState("null");
  const [uploading, setUploading] = useState(false);
  const [singleFile, setSingleFile] = useState(null);

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

  async function uploadAvatar(file) {
    try {
      setUploading(true);

      const newFile = file;
      const fileExt = newFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, newFile);

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

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log("res : " + JSON.stringify(res));
      // Setting the state to show single file attributes
      uploadAvatar(res);
      // setSingleFile(res);
    } catch (err) {
      // setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert("Canceled");
      } else {
        // For Unknown Error
        alert("Unknown Error: " + JSON.stringify(err));
        throw err;
      }
    }
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
          {/* <Input
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          >
            Upload
          </Input> */}
          <TouchableOpacity activeOpacity={0.5} onPress={selectFile}>
            <Text>Select File</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}
