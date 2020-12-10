import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  View,
  Pressable,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import Bubble from './../components/Bubble';
import {useLocation} from 'react-router-native';
import auth from '@react-native-firebase/auth';
import {cloudFunctions, db, fieldValue} from '../services/Firebase';
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_REST_API_ID, ONESIGNAL_PROJECT_ID} from '@env';

const sendMessageFunction = cloudFunctions.httpsCallable('sendMessage');

const headers: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Basic {{${ONESIGNAL_REST_API_ID}}}`,
};

const Chat = () => {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const [fetching, setFetching] = useState(true);

  const location = useLocation();
  const id = location.state.id; //Paso de parametros con react router
  const chatConnection = db.collection('chats').doc(id);
  // const chatRef = db.collection('chats').doc(id);

  const notificationAPI = async () => {
    let receiverId: string;
    if (
      auth().currentUser?.phoneNumber ===
      (await chatConnection.get()).data().createdBy
    ) {
      receiverId = (await chatConnection.get()).data().receiverOneSignalId;
    } else {
      receiverId = (await chatConnection.get()).data().creatorOneSignalId;
    }

    console.log('reveiverid:', receiverId);

    const body = {
      app_id: ONESIGNAL_PROJECT_ID,
      contents: {
        en: newMessage,
        es: newMessage,
      },
      headings: {
        en: 'New message from: ' + auth().currentUser?.phoneNumber,
        es: 'Nuevo mensaje de: ' + auth().currentUser?.phoneNumber,
      },
      include_player_ids: [receiverId],
    };

    const noti = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'post',
      headers: headers,
      body: JSON.stringify(body),
    });

    console.log(noti);
  };

  const sendMessage = async () => {
    // await sendMessageFunction({message: newMessage, id: id});

    try {
      await chatConnection.collection('messages').doc().set({
        message: newMessage,
        creationDate: fieldValue.serverTimestamp(),
        sender: auth().currentUser?.phoneNumber,
      });
      await notificationAPI();
    } catch (error) {
    } finally {
      setNewMessage('');
    }
  };

  // const messagesListener = () => {};

  const getMessages = async () => {
    console.log('message ID', location.state.id);

    console.log('antes de msgList');

    const msgList: any = [];

    await chatConnection
      .collection('messages')
      .orderBy('creationDate', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          console.log('query snapshot', querySnapshot.docs);
          let changes = querySnapshot.docChanges();

          for (const change of changes) {
            switch (change.type) {
              case 'added':
                const data = change.doc.data();

                console.log('changes data', data);

                console.log('msg List', msgList);

                msgList.push(data);
                // content = {en: data};

                break;
              default:
                break;
            }
          }
          console.log('antes setMessage');
          console.log(msgList);

          setMessages(msgList);
          setFetching(false);
        },
        (error) => {
          console.log('onSnapshot error', error);
        },
      );

    console.log('msgList', msgList);

    console.log('messages', messages);
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({animated: false});
  };

  useEffect(() => {
    getMessages();
    setTimeout(() => {
      scrollToEnd();
    }, 1);
  }, []);

  return (
    <View style={{flex: 1}}>
      {/* {fetching ? (
        <Loading />
      ) : ( */}
      <ScrollView ref={scrollViewRef} style={{marginBottom: 60}}>
        {messages.map((item: any, idx: number) => (
          <Bubble
            msg={item.message}
            email={auth().currentUser?.phoneNumber}
            sender={item.sender}
            key={idx}
          />
        ))}
      </ScrollView>
      {/* )} */}
      <View style={styles.bottomView}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={newMessage}
          onChangeText={(text) => {
            setNewMessage(text);
            console.log(messages);
          }}
        />
        <Pressable
          style={styles.sendBtn}
          onPress={() => {
            if (newMessage != '') {
              sendMessage();
              setNewMessage('');
            }
          }}>
          <Text style={styles.btnText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    // marginVertical: 5,
    backgroundColor: 'white',
    // marginHorizontal: '2%',
  },
  input: {
    width: '83%',
    backgroundColor: 'white',
    borderRadius: 12,
    // marginHorizontal: '2%',
    paddingHorizontal: 15,
  },
  sendBtn: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // borderRadius: 100,
    // backgroundColor: '#0083FE',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: '2%',
    // marginHorizontal: '3%',
  },
});

export default Chat;
