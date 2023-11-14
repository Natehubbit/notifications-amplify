import { API } from "aws-amplify";
import * as ExpoNotification from "expo-notifications";
import Constants from "expo-constants";

export default class NotificationService {
  private static pushToken: string;

  static async setup() {
    ExpoNotification.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  static async getToken() {
    try {
      if (this.pushToken) {
        return this.pushToken;
      }
      const projectId = Constants.expoConfig?.extra?.eas.projectId;
      const result = await ExpoNotification.getExpoPushTokenAsync({
        projectId,
      });
      this.pushToken = result.data;
      return result.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async init(name: string) {
    const settings = await ExpoNotification.getPermissionsAsync();
    if (!settings.granted) {
      return;
    }
    const token = await this.getToken();
    if (token) {
      await API.post("api4c961572", `/push`, {
        body: {
          name,
          token,
        },
      })
        .then((res) => console.log(res.data))
        .catch((err) => console.error(err));
    }
  }
}
