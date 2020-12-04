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
        sender === email
          ? styles.containerSender
          : sender === 'system'
          ? styles.containerSystem
          : styles.containerReceiver
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
  containerSystem: {
    backgroundColor: '#f1c40f',
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: '3%',
    borderRadius: 12,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default Bubble;
