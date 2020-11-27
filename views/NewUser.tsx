import React from 'react';
import {useState} from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import RegisterField from '../components/RegisterField';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

auth().useEmulator('http://localhost:9099');

db.settings({host: 'localhost:8080', ssl: false});

const storeUser = async (email: string) => {
  try {
    const user = await db
      .collection('users')
      .doc(email)
      .set({chat: []})
      .then(() => {
        console.log('Escrito');
      })
      .catch((err) => console.log(err));
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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signInPhone = async () => {
    const confirmation = await auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(() => {
        console.log('Success');
      })
      .catch((err) => {
        console.log(err);
      });
    setConfirm(confirmation);
    await console.log(confirm);
  };

  const signIn = async () => {
    console.log('wtf');

    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      storeUser(email);
    } catch (error) {
      console.error(error);

      await auth().createUserWithEmailAndPassword(email, password);
      storeUser(email);
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

  const styles = StyleSheet.create({
    submitPressable: {
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: '#20A4F3',
      height: 50,
      width: 200,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },

    submitText: {
      fontFamily: 'Raleway-medium',
      alignSelf: 'center',
      fontSize: 28,
      textTransform: 'uppercase',
      color: '#fff',
    },
  });

  return (
    <View style={{flex: 1}}>
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
      />
      <Pressable style={styles.submitPressable} onPress={signIn}>
        <Text style={styles.submitText}>Ingresar</Text>
      </Pressable>
    </View>
  );
};

export default NewUser;
