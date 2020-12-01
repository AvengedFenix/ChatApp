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

const db = firestore();

const Chat = () => {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();
  const id = location.state.id;
  const chatConnection = db.collection('chats').doc(id);

  const sendMessage = async () => {
    await chatConnection.collection('messages').doc().set({
      message: newMessage,
      creationDate: firebase.firestore.FieldValue.serverTimestamp(),
      sender: auth().currentUser.email,
    });
  };

  // const messagesListener = () => {};

  const getMessages = () => {
    console.log('message ID', location.state.id);

    console.log('antes de msgList');

    const msgList: any = [];
    let msgs: any;

    // return new Promise(async (resolve, reject) => {
    //   let resolveOnce = (doc: any) => {
    //     resolveOnce = () => {};
    //     resolve(doc);
    //   };

    db.collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('creationDate', 'asc')
      .limit(10)
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
                // setMessages((prevState: any) => [...prevState, data.message]);
                // for (const doc of msgs) {
                //   console.log(doc.data());

                //   msgList.push(doc.data().message);
                // }
                // setMessages(msgList);\
                break;
              default:
                break;
            }
          }
          // msgs = querySnapshot.docs;

          // querySnapshot.forEach(async (doc) => {
          //   await msgList.push(doc.data().message);
          // });

          // console.log(
          //   'map querySnapshot',
          //   querySnapshot.docs.map((doc) => doc.data()),
          // );

          // setMessages(msgs);

          // querySnapshot.docs.map((doc) => msgList.push(doc.data()));

          // for (const doc of msgs) {
          //   console.log(doc.data());

          //   msgList.push(doc.data().message);
          // }

          console.log('antes setMessage');
          console.log(msgList);

          // setMessages((prevState: any) => [...prevState, ...msgList]);
          setMessages(msgList);
          // resolveOnce(msgs);
        },
        (error) => {
          console.log('onSnapshot error', error);
        },
      );
    // });
    // .get();

    // setMessages(msgList);

    // msgs.forEach((item: any) => {
    //   msgList.push(item.data().message);
    //   console.log('message', item.data().message);
    // });
    console.log('msgList', msgList);

    console.log('messages', messages);
  };

  useEffect(() => {
    getMessages();
    // setMessages((prevState) => ({...prevState}));

    // const msgList: any = [];
    // let msgs: any = [];

    // const unsubscribe = db
    //   .collection('chats')
    //   .doc(id)
    //   .collection('messages')
    //   // .orderBy('creationDate', 'asc')
    //   // .limit(10)
    //   .onSnapshot(
    //     (querySnapshot) => {
    //       console.log(typeof querySnapshot);
    //       console.log(querySnapshot.docs);

    //       msgs = querySnapshot.docs;
    //       // querySnapshot.forEach(async (doc) => {
    //       //   await msgList.push(doc.data().message);
    //       // });

    //       msgs.map((doc) => msgList.push(doc.data()));

    //       // for (const doc of msgs) {
    //       //   msgList.push(doc.data().message);
    //       // }
    //       setMessages(msgList);
    //     },
    //     (error) => {
    //       console.log('onSnapshot error', error);
    //     },
    //   );

    // return unsubscribe();
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
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
    marginVertical: 5,
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
    borderRadius: 100,
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
