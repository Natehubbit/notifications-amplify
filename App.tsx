import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  Text,
} from "react-native";
import { Amplify } from "aws-amplify";
import { useRef } from "react";

import config from "./src/aws-exports";
import NotificationService from "./services/notification";

Amplify.configure(config);
NotificationService.setup();

export default function App() {
  const name = useRef<string>();

  const onTriggerNotification = async () => {
    if (!name.current) return;
    NotificationService.init(name.current);
  };

  const onTextChange: TextInputProps["onChangeText"] = (val) => {
    name.current = val;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Send me your name so I can say Hi!</Text>
      <TextInput onChangeText={onTextChange} style={styles.input} />
      <Button onPress={onTriggerNotification} title="Send Notification" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    marginBottom: 50,
    borderRadius: 10,
    height: 50,
    textAlign: "center",
    fontSize: 20,
  },
  text: {
    marginBottom: 10,
  },
});
