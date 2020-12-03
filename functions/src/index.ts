import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const fieldValue = require('firebase-admin').firestore.FieldValue;

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

const db = admin.firestore();

export const storeUser = functions.https.onCall(async (data: any) => {
  const {email} = data.body;
  try {
    const userRef = await db.collection('users').doc(email);
    if ((await userRef.get()).exists) {
      return;
    } else userRef.set({chat: []});
  } catch (error) {
    console.log(error);
  }
});

export const newChat = functions.https.onCall(
  async (data: any, context: any) => {
    const email = context.auth.token.email;
    const {receiverPhoneNumber} = data;

    const receiverRef = db.collection('users').doc(receiverPhoneNumber);
    if (!(await receiverRef.get()).exists) {
      console.log('no existe');
      return true;
    }
    const newChatID: string = await db.collection('chats').doc().id;

    await db.collection('chats').doc(newChatID).set({
      id: newChatID,
      createdBy: email,
      receiver: receiverPhoneNumber,
      creationDate: fieldValue.serverTimestamp(),
    });

    await db
      .collection('users')
      .doc(email?.toString())
      .update({chat: fieldValue.arrayUnion(newChatID)});

    await db
      .collection('users')
      .doc(receiverPhoneNumber)
      .update({chat: fieldValue.arrayUnion(newChatID)});

    return false;
  },
);

interface CreationDate {
  seconds: number;
  nanoseconds: number;
}

interface Message {
  message: string;
  creationDate: CreationDate;
  sender: string;
}

interface Chat {
  message?: Message;
  id?: string;
  receiver: string;
  createdBy: string;
  creationDate: CreationDate;
}

export const getChats = functions.https.onCall(
  async (data: any, context: any) => {
    const {email} = data;

    console.log('email from data', email);
    console.log('email from context', context.auth.token.email);

    const chatsGetter: Chat[] = [];

    const chatIDs = await db.collection('users').doc(email).get();

    const userChatList = chatIDs.data().chat;

    for (const item of userChatList) {
      const chatInfo = await db.collection('chats').doc(item).get();

      chatsGetter.push(chatInfo.data());
    }

    return chatsGetter;
  },
);

export const sendMessage = functions.https.onCall(
  async (data: any, context: any) => {
    const {message, id} = data;

    const chatConnection = db.collection('chats').doc(id);

    console.log('context val:', context.auth.token.email);

    await chatConnection.collection('messages').doc().set({
      message: message,
      creationDate: fieldValue.serverTimestamp(),
      sender: context.auth.email,
    });
  },
);
