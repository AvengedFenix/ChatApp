import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import ChatPreview from './../components/ChatPreview';
import firestore from '@react-native-firebase/firestore';
import {Link, useHistory} from 'react-router-native';
import {cloudFunctions, db} from '../services/Firebase';

// const db = firestore();
cloudFunctions.useFunctionsEmulator('http://localhost:5001');

interface Message {}

interface Chat {
  message?: any;
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

const fetchChats = cloudFunctions.httpsCallable('getChats');

const Dashboard = ({user}: Props) => {
  const [chats, setChats] = useState<any[]>([]);

  const getChats = async (email: string) => {
    console.log('getChats local');
    let chatsGetter: Chat[] = [];

    try {
      const functionCall = await fetchChats({email: email});

      chatsGetter = functionCall.data;
    } catch (error) {
      console.log(error);
    }
    console.log('chatsGetter', chatsGetter);

    // const chatIDs = await db.collection('users').doc(email).get();

    // const userChatList = chatIDs.data().chat;

    // // userChatList.map(async (doc: any) => {});

    // for (const item of userChatList) {
    //   const chatInfo = await db.collection('chats').doc(item).get();

    //   chatsGetter.push(chatInfo.data());
    // }

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
