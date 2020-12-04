import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Pressable,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Bubble from './../components/Bubble';
import RegisterField from './../components/RegisterField';
import {useLocation} from 'react-router-native';
// import {useParams, useRouteMatch} from 'react-router-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {cloudFunctions, db, fieldValue} from '../services/Firebase';
import OneSignal from 'react-native-onesignal';

const Chat = () => {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');

  const location = useLocation();
  const id = location.state.id; //Paso de parametros con react router
  const chatConnection = db.collection('chats').doc(id);

  const sendMessage = async () => {
    await chatConnection.collection('messages').doc().set({
      message: newMessage,
      creationDate: fieldValue.serverTimestamp(),
      sender: auth().currentUser.email,
    });
  };

  let content;
  // const messagesListener = () => {};

  const getMessages = async () => {
    console.log('message ID', location.state.id);

    console.log('antes de msgList');

    const msgList: any = [];
    let msgs: any;

    const chatRef = db.collection('chats').doc(id);
    const receiverId = (await chatRef.get()).data().receiverOneSignalId;

    chatRef
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

                OneSignal.postNotification(data.message);

                break;
              default:
                break;
            }
          }
          console.log('antes setMessage');
          console.log(msgList);

          setMessages(msgList);
        },
        (error) => {
          console.log('onSnapshot error', error);
        },
      );

    console.log('msgList', msgList);

    console.log('messages', messages);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        // ref={(ref) => (content = ref)}
        // onContentSizeChange={() => {
        //   content.scrollToEnd({animated: false});
        // }}
        style={{marginBottom: 60}}>
        {messages.map((item: any, idx: number) => (
          <Bubble
            msg={item.message}
            email={auth().currentUser?.email}
            sender={item.sender}
            key={idx}
          />
        ))}
      </ScrollView>

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

        {/* <RegisterField
          label="Message"
          action={setNewMessage}
          textType={newMessage}
        /> */}
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
