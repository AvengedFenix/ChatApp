import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import ChatPreview from './../components/ChatPreview';
import {useHistory} from 'react-router-native';
import {cloudFunctions, db} from '../services/Firebase';
import Loading from '../components/Loading';
import NewChatModal from './../components/NewChatModal';

// const db = firestore();
// cloudFunctions.useFunctionsEmulator('http://localhost:5001');

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
  const [fetching, setFetching] = useState(true);

  const getChats = async (email: string) => {
    console.log('getChats local');
    let chatsGetter: Chat[] = [];

    try {
      // const functionCall = await fetchChats({email: email});
      // chatsGetter = functionCall.data;

      const chatIDs = await db.collection('users').doc(email).get();

      const userChatList = chatIDs.data().chat;

      for (const item of userChatList) {
        const chatInfo = await db.collection('chats').doc(item).get();

        chatsGetter.push(chatInfo.data());
      }
    } catch (error) {
      console.log(error);
    }
    console.log('chatsGetter', chatsGetter);

    setChats(chatsGetter);
    setFetching(false);
  };

  useEffect(() => {
    console.log(user.email);
    getChats(user.phoneNumber);
    console.log('chats state', chats);
  }, []);

  const Card = ({item}: any) => {
    const history = useHistory();
    return (
      <Pressable
        onPress={() => {
          history.push('/chat', {id: item.id});
        }}>
        {user.phoneNumber === item.receiver ? (
          <ChatPreview email={item.createdBy} msg={item.createdBy} />
        ) : (
          <ChatPreview email={item.receiver} msg={item.createdBy} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={{height: 200}}>
      <Pressable
        style={{
          alignSelf: 'center',
          backgroundColor: '#f1c40f',
          borderRadius: 8,
        }}
        onPress={() => getChats(user.phoneNumber)}>
        <Text style={{padding: '3%', color: 'white', fontSize: 18}}>
          Refresh
        </Text>
      </Pressable>
      {fetching ? (
        <Loading />
      ) : chats.length === 0 ? (
        <View style={{alignItems: 'center', marginVertical: '40%'}}>
          <Text style={{fontSize: 32, marginVertical: 8}}>
            You don't have any conversation
          </Text>
          <NewChatModal />
        </View>
      ) : (
        chats.map((item: any, idx: number) => {
          return <Card key={idx} item={item} />;
        })
      )}
    </View>
  );
};

export default Dashboard;
