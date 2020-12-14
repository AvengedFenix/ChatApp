import React, {useState} from 'react';
import {Image, StyleSheet, View, Text, Pressable, Modal} from 'react-native';
import RegisterField from '../components/RegisterField';
import Off from '../assets/icons/off.svg';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import {useHistory} from 'react-router-native';
import OneSignal from 'react-native-onesignal';
import {db, cloudFunctions} from '../services/Firebase';
import NewChatModal from '../components/NewChatModal';

const fieldValue = firebase.firestore.FieldValue;

const newChatCloudFunction = cloudFunctions.httpsCallable('newChat');

const signOut = async () => {
  await auth().signOut();
};

const Header = () => {
  // let oneSignalId: string;
  // OneSignal.getPermissionSubscriptionState((status) => {
  //   console.log('Onesignal');
  //   oneSignalId = status.userId;
  // });

  const history = useHistory();

  console.log(auth().currentUser?.phoneNumber);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/person.png')}
      />
      <Pressable
        onPress={() => {
          history.push('/');
        }}>
        <Text style={styles.title}>Chats</Text>
      </Pressable>
      <View style={styles.btnContainer}>
        <NewChatModal />
        <Pressable style={styles.btnLogOut} onPress={signOut}>
          <Text style={styles.btnText}>Log Out</Text>
          {/* <Off width={240} height={40} /> */}
        </Pressable>
      </View>
      {/* <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        {alert ? null : (
          <View
            style={{
              backgroundColor: '#dc3545',
              marginTop: '4%',
              marginHorizontal: '2%',
              borderRadius: 8,
            }}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                alignSelf: 'center',
                paddingVertical: '3%',
              }}>
              This user is not registered
            </Text>
          </View>
        )}
        <View
          style={{
            height: '80%',
            marginTop: 60,
            width: '100%',
            paddingHorizontal: '2%',
          }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Create a conversation with someone!
          </Text>
          <Text
            style={{
              marginTop: 10,
              textAlign: 'center',
              opacity: 0.7,
              fontSize: 16,
            }}>
            If the user is registered you'll be able to open a conversation,
            just enter their phone number
          </Text>
          <RegisterField
            label="Phone"
            textType={phoneNumber}
            action={setPhoneNumber}
          />
          <Pressable
            style={styles.btnAddChat}
            onPress={async () => {
              newChat(phoneNumber.replace(/\s/g, ''), oneSignalId);
              // alert ? setShowModal(false) : null;
            }}>
            <Text style={styles.btnModalText}>Create chat</Text>
          </Pressable>
          <Pressable
            style={styles.btnCancel}
            onPress={() => {
              setShowModal(false);
            }}>
            <Text style={styles.btnModalText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: '4%',
    marginHorizontal: '2%',
    paddingHorizontal: '2%',
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
    // top: -6,
    // alignSelf: 'flex-start',
    // justifyContent: 'center'
  },
  btnContainer: {
    // flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 'auto',
    // paddingBottom: 6,
    top: -2,
  },
  btnLogOut: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    marginHorizontal: 5,
  },

  btnText: {
    fontSize: 16,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'right',
  },
});

export default Header;
