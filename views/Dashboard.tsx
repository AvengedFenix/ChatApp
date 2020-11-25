import React from 'react';
import {View, Text, FlatList} from 'react-native';
import ChatPreview from './../components/ChatPreview';

const DATA = [
  {email: 'hola@hola.com', id: '1', msg: 'dog'},
  {email: 'tigre@hola.com', id: '1', msg: 'que pex'},
];

const Dashboard = () => {
  const renderItem = ({item}: any) => (
    <ChatPreview email={item.email} msg={item.msg} />
  );

  return (
    <View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Dashboard;
