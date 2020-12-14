import React, {useState} from 'react';
import {Modal, View, Text, Pressable, StyleSheet} from 'react-native';
import RegisterField from './RegisterField';
import OneSignal from 'react-native-onesignal';
import {db, fieldValue, userAuth} from '../services/Firebase';

const NewChatModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+504');
  const [alert, setAlert] = useState<boolean>(true);

  let oneSignalId: string;
  OneSignal.getPermissionSubscriptionState((status: any) => {
    oneSignalId = status.userId;
    console.log('Onesignal', status.userId);
    console.log(status);
  });

  const verifyExistingChat = async (
    id: string,
    phoneNumber: string,
  ): boolean => {
    try {
      const userChats: string[] = (
        await db.collection('users').doc(id).get()
      ).data().chat;

      console.log('userchats', userChats);

      for (const chat of userChats) {
        console.log('forof', chat);

        const currentChat: any = await (
          await db.collection('chats').doc(chat).get()
        ).data();

        const createdBy: string = currentChat.createdBy;
        console.log('createdBy', createdBy);

        const receiver: string = currentChat.receiver;
        console.log('receiver', receiver);

        if (
          (createdBy === id && receiver === phoneNumber) ||
          (createdBy === phoneNumber && receiver === id)
        ) {
          console.log('Chat ya existe');

          return true;
        }
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  const newChat = async (
    phoneNumber: string,
    oneSignalUserId: string,
  ): boolean => {
    console.log('phoneNumber', phoneNumber);

    console.log('newChat', oneSignalUserId);

    // newChatCloudFunction({
    //   receiverPhoneNumber: phoneNumber,
    //   oneSignalUserId: oneSignalUserId,
    // });

    const email: string | null | undefined = userAuth.currentUser?.phoneNumber;
    const receiver = db.collection('users').doc(phoneNumber);
    if (!(await receiver.get()).exists) {
      console.log('no existe');
      setAlert(false);
      return false;
    }
    const newChatID: string = db.collection('chats').doc().id;
    const senderRef = db.collection('users').doc(email?.toString());
    const receiverRef = db.collection('users').doc(phoneNumber);
    const receiverOneSignalId = (await receiverRef.get()).data().device;

    if (verifyExistingChat(email?.toString(), phoneNumber)) {
      return false;
    }
    await db.collection('chats').doc(newChatID).set({
      id: newChatID,
      createdBy: email,
      creatorOneSignalId: oneSignalUserId,
      receiverOneSignalId: receiverOneSignalId,
      receiver: phoneNumber,
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
    await senderRef.update({chat: fieldValue.arrayUnion(newChatID)});
    await receiverRef.update({chat: fieldValue.arrayUnion(newChatID)});

    setShowModal(false);
    return true;
  };

  return (
    <>
      <Pressable
        style={styles.btnAdd}
        onPress={() => {
          setShowModal(true);
        }}>
        <Text style={styles.btnText}>Add</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        {alert ? null : (
          <View
            style={{
              backgroundColor: '#dc3545',
              marginTop: '4%',
              marginHorizontal: '2%',
              borderRadius: 8,
            }}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                alignSelf: 'center',
                paddingVertical: '3%',
              }}>
              This user is not registered
            </Text>
          </View>
        )}
        <View
          style={{
            height: '80%',
            marginTop: 60,
            width: '100%',
            paddingHorizontal: '2%',
          }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Create a conversation with someone!
          </Text>
          <Text
            style={{
              marginTop: 10,
              textAlign: 'center',
              opacity: 0.7,
              fontSize: 16,
            }}>
            If the user is registered you'll be able to open a conversation,
            just enter their phone number
          </Text>
          <RegisterField
            label="Phone number"
            textType={phoneNumber}
            action={setPhoneNumber}
          />
          <Pressable
            style={styles.btnAddChat}
            onPress={async () => {
              newChat(phoneNumber.replace(/\s/g, ''), oneSignalId);
              // alert ? setShowModal(false) : null;
            }}>
            <Text style={styles.btnModalText}>Create chat</Text>
          </Pressable>
          <Pressable
            style={styles.btnCancel}
            onPress={() => {
              setShowModal(false);
            }}>
            <Text style={styles.btnModalText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  btnAdd: {
    backgroundColor: '#4CCC1F',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  btnText: {
    fontSize: 16,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'right',
  },
  btnAddChat: {
    backgroundColor: '#4CCC1F',
    justifyContent: 'center',
    // marginHorizontal: '10%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  btnCancel: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnModalText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
  },
});

export default NewChatModal;
