/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Expo } = require("expo-server-sdk");

exports.handler = async (event) => {
  try {
    console.info(`EVENT:: ${JSON.stringify(event)}`);
    const { name, token } = JSON.parse(event.body);

    let expo = new Expo();

    let messages = [];
    if (!Expo.isExpoPushToken(token)) {
      return {
        statusCode: 400,
        body: `Push token ${token} is not a valid Expo push token`,
      };
    }

    messages.push({
      to: token,
      sound: "default",
      body: "Hello " + name,
    });

    console.log("MESSAGES:: ", messages);

    let chunks = expo.chunkPushNotifications(messages);

    const sendList = [];
    for (let chunk of chunks) {
      console.log("CHUNK:: ", chunk);
      sendList.push(expo.sendPushNotificationsAsync(chunk));
    }

    const [...tickets] = await Promise.all(sendList);

    console.info("SENT", tickets);
    return {
      statusCode: 200,
      body: JSON.stringify("Hello " + name),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
