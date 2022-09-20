import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Modal, Image, Animated, Easing } from 'react-native';
import styles from './styles';
import { Camera, CameraType, requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } from "expo-camera"
import Ionicons from '@expo/vector-icons/Ionicons';
import * as FileSystem from 'expo-file-system'
import refreshTokenAPI from './src/utils/refreshToken';
import axios from 'axios';
import PostCapture from './src/components/post-component';
import Loading from './src/components/loading';
import QRCode from './src/components/QRCode';

export default function App() {
  const camRef = useRef(null)
  const [accessToken, setAcessToken] = useState("")
  const [typeCamera, setTypeCamera] = useState(CameraType.back)
  const [cameraPermissions, setCameraPermissions] = useState(null)
  const [microphonePermissions, setMicrophonePermissions] = useState(null)
  const [capturedVideo, setCapturedVideo] = useState(null)
  const [openModal, setOpenModal] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [qrCode, setQRCode] = useState(undefined)
  const [openQRCodeModal, setOpenQRCodeModal] = useState(false)
  const [flash, setFlash] = useState("off")
  const [cloudVideo, setCloudVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    verifyToken()
    requestCameraPermissionsAsync().then(({ status }) => {
      setCameraPermissions(status === "granted")
    })

    requestMicrophonePermissionsAsync().then(({ status }) => {
      setMicrophonePermissions(status === "granted")
    })
  }, [])

  const flipCam = () => {
    setTypeCamera(
      typeCamera === CameraType.back ?
        CameraType.front :
        CameraType.back
    )
  }

  const initRecord = async () => {
    if (camRef) {
      setIsRecording(true)
      const data = await camRef.current.recordAsync({
        maxDuration: 60
      })
      setCapturedVideo(data.uri)

    }
  }

  const stopRecord = async () => {
    camRef.current.stopRecording()
    setIsRecording(false)
    setOpenModal(true)
  }

  const verifyToken = async () => {
    try {
      const res = await axios({
        baseURL: "https://www.googleapis.com/drive/v3/files/1G2sXNTp3xknko9ziygd7pfNJgui_7_27",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        method: "get"
      })
      console.log("Token Ok")
    } catch (err) {
      console.log("Fazendo requisição de novo token")
      const token = await refreshTokenAPI()
      setAcessToken(token)
    }
  }


  const uploadVideo = async () => {
    const URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=media"
    const uploadVideoResponse = await FileSystem.uploadAsync(
      URL,
      capturedVideo,
      {
        fieldName: "file",
        httpMethod: "post",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "video/quicktime"
        },
      }
    )
    return uploadVideoResponse
  }

  const saveVideo = async () => {
    await uploadVideo()
    await updateVideoData()
    console.log("video na nuvem")
    alert("Video no Drive")
  }

  const getLastUploadVideo = async () => {
    const res = await axios({
      baseURL: "https://www.googleapis.com/drive/v3/files/",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      method: "get"
    })

    return res.data.files[0].id
  }

  const updateVideoData = async () => {
    const PASTE_GOOGLE_DRIVE = "1W-nqIVTf-k6HtA4fEbY398T3xdQ2oc-b"
    const date = new Date().toLocaleString()
    const videoName = `${date}.mp4`
    await verifyToken()
    const idVideo = await getLastUploadVideo()

    const resFile = await axios({
      baseURL: `https://www.googleapis.com/drive/v3/files/${idVideo}?addParents=${PASTE_GOOGLE_DRIVE}`,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      method: "PATCH",
      data: {
        name: videoName
      }
    })
  }

  const getVideoLink = async () => {
    setLoading(true)
    await verifyToken()
    if (!cloudVideo) {
      await saveVideo()
    }
    const idVideo = await getLastUploadVideo()

    const resFile = await axios({
      baseURL: `https://www.googleapis.com/drive/v3/files/${idVideo}?fields=webContentLink`,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      method: "get"
    })

    const linkVideoDonwload = resFile.data.webContentLink
    console.log(linkVideoDonwload)

    setQRCode(linkVideoDonwload)
    setOpenModal(false)
    setOpenQRCodeModal(true)
    setCloudVideo(true)
    setLoading(false)
  }

  const closeModalQRCode = async () => {
    setOpenModal(true)
    setOpenQRCodeModal(false)
  }

  const closeModalVideo = () => {
    setOpenModal(false)
    setCloudVideo(false)
  }

  const flashOnOff = async () => {
    flash === "off" ? setFlash("torch") : setFlash("off")
  }

  if (cameraPermissions === null || microphonePermissions === null) {
    return (
      <View />
    )
  }

  if (cameraPermissions === false || microphonePermissions === null) {
    return <Text> Acesso negado! </Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={typeCamera}
        ref={camRef}
        flashMode={flash}
      >
        {
          !loading && (
            <>
              <TouchableOpacity style={styles.flash} onPress={flashOnOff}>
                <Ionicons name="flash" color={flash === "off" ? "white" : "#FAD749"} size={35}></Ionicons>
              </TouchableOpacity>
              <View style={styles.cameraBtns}>
                <TouchableOpacity>
                  <Ionicons name="logo-buffer" size={50} color="white"></Ionicons>
                </TouchableOpacity>
                {
                  !isRecording ?
                    <TouchableOpacity onPress={initRecord}>
                      <Ionicons name="radio-button-on" size={50} color="white"></Ionicons>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={stopRecord}>
                      <Ionicons name="radio-button-off" size={50} color="white"></Ionicons>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={flipCam} disabled={isRecording}>
                  <Ionicons name="refresh" size={50} color={!isRecording ? "white" : "grey"}></Ionicons>
                </TouchableOpacity>
              </View>
            </>
          )
        }
      </Camera>
      {
        (capturedVideo && !loading) &&
        <Modal animationType='slide' visible={openModal}>
          <PostCapture
            capturedVideo={capturedVideo}
            videoLink={getVideoLink}
            closeModal={closeModalVideo} />
        </Modal>
      }
      {
        <Modal animationType='slide' visible={openQRCodeModal}>
          <QRCode code={qrCode} closeModal={closeModalQRCode}></QRCode>
        </Modal>
      }
      {
        loading && (
          <Loading></Loading>
        )
      }
    </SafeAreaView >
  );
}

