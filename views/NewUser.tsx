import React from 'react';
import {useState} from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import RegisterField from '../components/RegisterField';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Messenger from '../assets/icons/messenger.svg';
import InputScrollView from 'react-native-input-scroll-view';
import OneSignal from 'react-native-onesignal';

const db = firestore();

// auth().useEmulator('http://localhost:9099');

// db.settings({host: 'localhost:8080', ssl: false});

const storeUser = async (email: string, oneSignal: string) => {
  try {
    const userRef = await db.collection('users').doc(email);

    if ((await userRef.get()).exists) {
      return;
    } else userRef.set({chat: [], device: oneSignal});
    // console.log('User', user);
    // if(user != undefined)
  } catch (error) {
    console.error(error);
    // db.collection('users').doc(email);
  }
};

const NewUser = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('+44 7444 555666');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('123456');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [textAreaHeight, setTextAreaHeight] = useState(null);
  let oneSignalId;
  OneSignal.getPermissionSubscriptionState((status) => {
    console.log('status new user:', status, '\nuser ID: ', status.userId);
    oneSignalId = status.userId;
  });

  const signInPhone = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('confirmation', confirmation);
      setConfirm(confirmation);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmCode = async () => {
    console.log(code);

    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async () => {
    console.log('wtf');

    try {
      console.log('try');
      await auth().signInWithEmailAndPassword(email, password);
      storeUser(email, oneSignalId);
    } catch (error) {
      console.error(error);

      await auth().createUserWithEmailAndPassword(email, password);
      storeUser(email, oneSignalId);
    }
  };

  const verifyPhoneNumber = async () => {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  };

  const handleCreate = () => {
    console.log(phoneNumber);
    signIn();
    // verifyPhoneNumber().then(() => {
    //   console.log();

    // }).catch;
  };

  const onContentSizeChange = ({nativeEvent: event}) => {
    setTextAreaHeight(event.contentSize.height);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: '2%',
    },

    submitPressable: {
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: '#4CCC1F',
      height: 50,
      width: '100%',
      borderRadius: 16,
      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 5,
      // },
      // shadowOpacity: 0.34,
      // shadowRadius: 6.27,
      // elevation: 10,
      marginVertical: 10,
    },

    submitText: {
      fontFamily: 'Raleway-medium',
      alignSelf: 'center',
      fontSize: 16,
      textTransform: 'uppercase',
      color: '#fff',
    },
  });

  return (
    <View style={styles.container}>
      <InputScrollView keyboardOffset={70}>
        <Messenger
          style={{alignSelf: 'center', marginTop: 100}}
          width={250}
          height={250}
        />
        <View style={{marginTop: 0}}>
          <RegisterField
            label="Phone number"
            textType={phoneNumber}
            action={setPhoneNumber}
          />
          <RegisterField label="Email" textType={email} action={setEmail} />
          <RegisterField
            label="Password"
            textType={password}
            action={setPassword}
            secure={true}
            // onContentSizeChange={onContentSizeChange}
          />
          <Pressable style={styles.submitPressable} onPress={signIn}>
            <Text style={styles.submitText}>Ingresar</Text>
          </Pressable>
          <Pressable style={styles.submitPressable} onPress={confirmCode}>
            <Text style={styles.submitText}>Confirmar</Text>
          </Pressable>
        </View>
      </InputScrollView>
    </View>
  );
};

export default NewUser;
