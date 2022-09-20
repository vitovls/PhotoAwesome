import { Image, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "../../styles";

export default function QRCode({code, closeModal}) {
  return (
    <View style={styles.modal}>
      <TouchableOpacity onPress={closeModal}>
        <Ionicons name="close" size="50"></Ionicons>
      </TouchableOpacity>
      <Image style={{ width: 300, height: 300 }} source={{ uri: `http://api.qrserver.com/v1/create-qr-code/?data=${code}` }}></Image>
    </View>
  )
}