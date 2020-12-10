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

const sendMessageFunction = cloudFunctions.httpsCallable('sendMessage');

const Chat = () => {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const [fetching, setFetching] = useState(true);

  // const scrollViewRef = React.createRef<ScrollView>();

  const location = useLocation();
  const id = location.state.id; //Paso de parametros con react router
  const chatConnection = db.collection('chats').doc(id);

  const sendMessage = async () => {
    // await sendMessageFunction({message: newMessage, id: id});

    await chatConnection.collection('messages').doc().set({
      message: newMessage,
      creationDate: fieldValue.serverTimestamp(),
      sender: auth().currentUser?.phoneNumber,
    });
    setNewMessage('');
  };

  const onNotificationOpened = (message, data, isActive) => {
    if (data.p2p_notification) {
      for (var num in data.p2p_notification) {
        // console.log(data.p2p_notification[num]);
      }
    }
  };
  // const messagesListener = () => {};

  const getMessages = async () => {
    console.log('message ID', location.state.id);

    console.log('antes de msgList');

    const msgList: any = [];
    let content: any = {en: 'test'};

    const chatRef = db.collection('chats').doc(id);
    let receiverId: string;
    if (
      auth().currentUser?.phoneNumber === (await chatRef.get()).data().createdBy
    ) {
      receiverId = (await chatRef.get()).data().receiverOneSignalId;
    } else {
      receiverId = (await chatRef.get()).data().creatorOneSignalId;
    }

    await chatRef
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
          try {
            console.log('antes de notificacion', receiverId);

            // OneSignal.postNotification(content, [], null, {
            //   include_external_user_ids: [receiverId],
            // });

            OneSignal.postNotification(
              content,
              {},
              {include_player_ids: [receiverId]},
              {},
            );
          } catch (error) {
            console.log('error', error);
          }
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
