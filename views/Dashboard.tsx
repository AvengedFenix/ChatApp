import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import ChatPreview from './../components/ChatPreview';
import firestore from '@react-native-firebase/firestore';

let DATA = [
  {email: 'hola@hola.com', id: '1', msg: 'dog'},
  {email: 'tigre@hola.com', id: '1', msg: 'que pex'},
];

const db = firestore();

interface Message {}

interface Chat {
  message?: Message;
  receiver: string;
  createdBy: string;
  creationDate: {
    seconds: number;
    nanoseconds: number;
  };
}

interface Props {
  user: any;
}

// const getChats = async (email: string): Chat[] => {
//   const chats: Chat[] = [];

//   const chatIDs = await db.collection('users').doc(email).get();

//   console.log('ids', chatIDs.data().chat);

//   const userChatList = chatIDs.data().chat;

//   userChatList.map(async (doc: any) => {
//     console.log('id', doc);

//     const chatInfo = await db.collection('chats').doc(doc).get();

//     console.log('chatInfo', JSON.stringify(chatInfo.data()));

//     chats.push(chatInfo.data());
//   });

//   // await console.log('chatsss', chats);

//   return chats;
// };

const Dashboard = ({user}: Props) => {
  const [chats, setChats] = useState<Chats[]>([]);

  const getChats = async (email: string) => {
    const chatsGetter: Chat[] = [];

    const chatIDs = await db.collection('users').doc(email).get();

    console.log('ids', chatIDs.data().chat);

    const userChatList = chatIDs.data().chat;

    userChatList.map(async (doc: any) => {
      console.log('id', doc);

      const chatInfo = await db.collection('chats').doc(doc).get();

      console.log('chatInfo', JSON.stringify(chatInfo.data()));

      chatsGetter.push(chatInfo.data());
      console.log('getter', chatsGetter);
    });
    setChats(chatsGetter);

    // await console.log('chatsss', chats);
  };

  useEffect(() => {
    console.log(user.email);
    getChats(user.email);
    console.log('chats state', chats);
    DATA = chats;
    console.log('data', DATA);

    // setChats(getChats(user.email));
    // const chatsDB: Chat[] = getChats(user.email);
  }, []);

  const renderItem = ({item}: any) => (
    <ChatPreview email={item.receiver} msg={item.createdBy} />
  );

  return (
    <View>
      {console.log(DATA)}
      <FlatList
        data={DATA}
        extraData={chats}
        renderItem={renderItem}
        keyExtractor={(item: Chat) => item.createdBy}
      />
    </View>
  );
};

export default Dashboard;
