import React, {useState} from 'react';
import {Image, StyleSheet, View, Text, Pressable, Modal} from 'react-native';
import RegisterField from '../components/RegisterField';
import Off from '../assets/icons/off.svg';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const fieldValue = firebase.firestore.FieldValue;

const db = firestore();

const signOut = async () => {
  await auth().signOut();
};

const newChat = async (phoneNumber: string) => {
  const email: string | null | undefined = auth().currentUser?.email;

  const newChatID: string = await db.collection('chats').doc().id;

  await db.collection('chats').doc(newChatID).set({
    createdBy: email,
    receiver: phoneNumber,
    creationDate: fieldValue.serverTimestamp(),
  });

  await db
    .collection('users')
    .doc(email?.toString())
    .update({chat: fieldValue.arrayUnion(newChatID)});

  await db
    .collection('users')
    .doc(phoneNumber)
    .update({chat: fieldValue.arrayUnion(newChatID)});
};

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/person.png')}
      />
      <Text style={styles.title}>Chats</Text>
      <View style={styles.btnContainer}>
        <Pressable
          style={styles.btn}
          onPress={() => {
            setShowModal(true);
          }}>
          <Text style={styles.btnText}>Add</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={signOut}>
          <Text style={styles.btnText}>Log Out</Text>
          {/* <Off width={240} height={40} /> */}
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View>
          <RegisterField
            label="Phone"
            textType={phoneNumber}
            action={setPhoneNumber}
          />
          <Pressable
            style={styles.btnModal}
            onPress={() => newChat(phoneNumber)}>
            <Text>Close modal</Text>
          </Pressable>
          <Pressable
            style={styles.btnModal}
            onPress={() => setShowModal(false)}>
            <Text>Close modal</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: '4%',
    flexDirection: 'row',
    // alignItems: 'flex-start',
    // flex: 1,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    paddingLeft: '4%',
    top: -6,
    // alignSelf: 'flex-start',
    // justifyContent: 'center'
  },
  btnContainer: {
    // flex: 1,
    flexDirection: 'row',
    marginLeft: 'auto',
    paddingBottom: 6,
  },
  btn: {
    marginHorizontal: 5,
    // width: 50,
    justifyContent: 'center',
  },
  btnText: {
    alignSelf: 'center',
    textAlign: 'right',
  },
  btnModal: {
    backgroundColor: '#C72241',
    width: 140,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Header;
