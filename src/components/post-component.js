import { Video } from "expo-av";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import styles from "../../styles";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PostCapture({ capturedVideo, videoLink, closeModal }) {

  const [videoStatus, setVideoStatus] = useState(false)
  const [visiblePause, setVisiblePause] = useState(false)

  return (
    <Video
      style={styles.capturedVideo}
      source={{ uri: capturedVideo }}
      shouldPlay={videoStatus}
      isLooping={true}
      isMuted={false}
      onTouchStart={() => {
        videoStatus === true && setVisiblePause(true)
      }}
    >
      <View style={{
        position: "absolute",
        zIndex: 1,
        alignSelf: "center",
        height: "100%",
        justifyContent: "center"
      }}>
      {
        !videoStatus && (
          <TouchableOpacity onPress={() => {
            setVideoStatus(true)
            
          }}>
            <Ionicons name="play" size={50} color="white" />
          </TouchableOpacity>
        )
      }
      {
        visiblePause === true && (
          <TouchableOpacity style={{ zIndex: 1 }} onPress={() => {
            setVideoStatus(false)
            setVisiblePause(false)
          }}>
            <Ionicons name="pause" size={50} color="white" />
          </TouchableOpacity>
        )
      }
      </View>
      <View style={styles.modalBtns}>
        <TouchableOpacity onPress={() => closeModal(false)}>
          <Ionicons name="close" size={50} color="white"></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity onPress={videoLink}>
          <Ionicons name="qr-code" size={50} color="white"></Ionicons>
        </TouchableOpacity>
      </View>
    </Video>
  )
}