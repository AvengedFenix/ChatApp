"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getChats = exports.newChat = exports.storeUser = void 0;
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const fieldValue = require('firebase-admin').firestore.FieldValue;
admin.initializeApp();
const db = admin.firestore();
exports.storeUser = functions.https.onCall(async (data) => {
    console.log(data);
    const { email, oneSignal } = data;
    // const email = 'hola@hola.com';
    // const oneSignal = 'hey';
    console.log('store user call');
    try {
        const userRef = await db.collection('users').doc(email);
        if ((await userRef.get()).exists) {
            return;
        }
        else {
            userRef.set({ chat: [], device: oneSignal });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.newChat = functions.https.onCall(async (data, context) => {
    const email = context.auth.token.phone_number;
    console.log(email);
    const { receiverPhoneNumber, oneSignalUserId } = data;
    const receiverRef = db.collection('users').doc(receiverPhoneNumber);
    if (!(await receiverRef.get()).exists) {
        console.log('no existe');
        return true;
    }
    console.log('oneSignalUserId', oneSignalUserId);
    const newChatID = db.collection('chats').doc().id;
    const senderRef = db.collection('users').doc(email === null || email === void 0 ? void 0 : email.toString());
    // const receiverRef = db.collection('users').doc(phoneNumber);
    const receiverOneSignalId = (await receiverRef.get()).data().device;
    console.log('receiverOneSignal', receiverOneSignalId);
    await db.collection('chats').doc(newChatID).set({
        id: newChatID,
        createdBy: email,
        creatorOneSignalId: oneSignalUserId,
        receiverOneSignalId: receiverOneSignalId,
        receiver: receiverPhoneNumber,
        creationDate: fieldValue.serverTimestamp(),
    });
    await db
        .collection('chats')
        .doc(newChatID)
        .collection('messages')
        .doc()
        .set({
        message: 'Your new conversation is ready, say hello!',
        sender: 'system',
        creationDate: fieldValue.serverTimestamp(),
    });
    await senderRef.update({ chat: fieldValue.arrayUnion(newChatID) });
    await receiverRef.update({ chat: fieldValue.arrayUnion(newChatID) });
    return false;
});
exports.getChats = functions.https.onCall(async (data, context) => {
    const { email } = data;
    console.log('email from data', email);
    console.log('email from context', context.auth.token.email);
    const chatsGetter = [];
    const chatIDs = await db.collection('users').doc(email).get();
    const userChatList = chatIDs.data().chat;
    for (const item of userChatList) {
        const chatInfo = await db.collection('chats').doc(item).get();
        chatsGetter.push(chatInfo.data());
    }
    return chatsGetter;
});
exports.sendMessage = functions.https.onCall(async (data, context) => {
    const { message, id } = data;
    const chatConnection = db.collection('chats').doc(id);
    console.log('context val:', context.auth.token.email);
    await chatConnection.collection('messages').doc().set({
        message: message,
        creationDate: fieldValue.serverTimestamp(),
        sender: context.auth.token.email,
    });
});
//# sourceMappingURL=index.js.map