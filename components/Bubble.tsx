import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  msg: string;
  sender: string;
  email: string;
}

const Bubble = ({msg, sender, email}: Props) => {
  return (
    <View
      style={
        sender === email ? styles.containerSender : styles.containerReceiver
      }>
      <Text style={styles.text}>{msg}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerReceiver: {
    backgroundColor: '#3A3B3C',
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: '3%',
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    alignSelf: 'flex-start',
  },
  containerSender: {
    backgroundColor: '#0083FE',
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: '3%',
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default Bubble;
