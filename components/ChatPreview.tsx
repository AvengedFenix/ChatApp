import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

interface Props {
  email: string;
  msg: string;
}

const ChatPreview = ({email, msg}: Props) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={require('../assets/images/person.png')}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.title}>{email}</Text>
        <Text style={styles.msg}>{msg}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
    width: 40,
    height: 40,
    backgroundColor: '#FF5733',
  },
  card: {
    // backgroundColor: '#FF5733',
    marginVertical: '2%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: '4%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  msg: {
    fontSize: 14,
  },
  chatInfo: {
    // top: -8,
    paddingLeft: '4%',
  },
});

export default ChatPreview;
