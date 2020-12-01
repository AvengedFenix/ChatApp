import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import ChatPreview from './../components/ChatPreview';
import firestore from '@react-native-firebase/firestore';
import {Link, useHistory} from 'react-router-native';

let DATA = [
  {email: 'hola@hola.com', id: '1', msg: 'dog'},
  {email: 'tigre@hola.com', id: '1', msg: 'que pex'},
];

const db = firestore();

interface Message {}

interface Chat {
  message?: Message;
  id?: string;
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

const Dashboard = ({user}: Props) => {
  const [chats, setChats] = useState<any[]>([]);

  const getChats = async (email: string) => {
    const chatsGetter: Chat[] = [];

    const chatIDs = await db.collection('users').doc(email).get();

    const userChatList = chatIDs.data().chat;

    // userChatList.map(async (doc: any) => {});

    for (const item of userChatList) {
      const chatInfo = await db.collection('chats').doc(item).get();

      chatsGetter.push(chatInfo.data());
    }

    setChats(chatsGetter);
  };

  useEffect(() => {
    console.log(user.email);
    getChats(user.email);
    console.log('chats state', chats);
  }, []);

  const renderItem = ({item}: any) => <Card item={item} />;

  const Card = ({item}: any) => {
    const history = useHistory();
    return (
      <Pressable
        onPress={() => {
          history.push('/chat', {id: item.id});
        }}>
        <ChatPreview email={item.receiver} msg={item.createdBy} />
      </Pressable>
    );
  };

  console.log('chats state antes de return', chats);

  // const info = [
  //   {
  //     createdBy: 'hola@hola.com',
  //     id: 'jl3PuBySdi5CwFR4PqSh',
  //     receiver: 'hola123@hola.com',
  //   },
  // ];

  return (
    <View style={{height: 200}}>
      {chats.map((item: any, idx: number) => {
        // console.log(item)
        return <Card key={idx} item={item} />;
      })}
      {/* <Text>hola</Text>
      <FlatList
        data={chats}
        extraData={chats}
        renderItem={renderItem}
        keyExtractor={(item: Chat) => item.id}
      />
      {console.log(chats)} */}
    </View>
  );
};

export default Dashboard;
