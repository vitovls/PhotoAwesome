import { View, Animated, Easing } from "react-native";

export default function Loading() {
  let rotateValueHolder = new Animated.Value(0);


  rotateValueHolder.setValue(0);
  Animated.timing(rotateValueHolder, {
    toValue: 1,
    duration: 3000,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();


  const rotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "110%",
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          transform: [{ rotate: rotateData }],
          borderStyle: "solid",
          borderWidth: "5px",
          borderRadius: "50%",
          borderBottomColor: "red",
          borderTopColor: "blue",
          borderLeftColor: "blue",
          borderRightColor: "blue"
        }}
      />
    </View>
  )
}