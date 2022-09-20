import { StyleSheet } from "react-native-web"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1
  },
  cameraBtns: {
    alignItems: "center",
    bottom: 0,
    flexDirection: "row",
    height: 75,
    justifyContent: "space-around",
    position: "absolute",
    width: "100%",
  },
  capturedVideo: {
    flex: 1,
    width: "100%",
  },
  modalBtns: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around",
    zIndex: 1
  },
  flash: {
    position: "absolute",
    margin: 20,
    right: 0
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default styles