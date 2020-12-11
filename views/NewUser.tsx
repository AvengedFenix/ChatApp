import React from 'react';
import {useState} from 'react';
import {View, Pressable, Text, StyleSheet, Modal} from 'react-native';
import RegisterField from '../components/RegisterField';
import auth from '@react-native-firebase/auth';
import Messenger from '../assets/icons/messenger.svg';
import InputScrollView from 'react-native-input-scroll-view';
import OneSignal from 'react-native-onesignal';
import {db, cloudFunctions} from '../services/Firebase';

const storeUserCloudFunction = cloudFunctions.httpsCallable('storeUser');

// const storeUser = async (email: string, oneSignal: string) => {
//   try {
//     await storeUserCloudFunction({email: email, oneSignal: oneSignal});
//   } catch (error) {
//     console.log(error);
//   }
// };

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
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState<string>('hola@hola.com');
  const [password, setPassword] = useState<string>('hola1234');
  const [textAreaHeight, setTextAreaHeight] = useState(null);
  const [codeModal, setCodeModal] = useState(false);
  let oneSignalId: string;
  OneSignal.getPermissionSubscriptionState((status) => {
    console.log('status new user:', status, '\nuser ID: ', status.userId);
    oneSignalId = status.userId;
  });

  const test = async () => {
    console.log('test');
    await db.collection('users').doc().set({hey: 'hey'});
    console.log('test');
  };

  const signInPhone = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('confirmation', confirmation);
      setConfirm(confirmation);
      console.log('trim number', phoneNumber.replace(/\s/g, ''));

      storeUser(phoneNumber.replace(/\s/g, ''), oneSignalId);
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
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('try');
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
    btnCancel: {
      marginTop: 20,
      backgroundColor: '#dc3545',
      borderRadius: 12,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    btnModalText: {
      fontSize: 20,
      color: 'white',
      alignSelf: 'center',
      paddingHorizontal: '5%',
      paddingVertical: '4%',
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
          {/* <RegisterField label="Email" textType={email} action={setEmail} />
          <RegisterField
            label="Password"
            textType={password}
            action={setPassword}
            secure={true}
            // onContentSizeChange={onContentSizeChange}
          /> */}
          <Pressable
            style={styles.submitPressable}
            onPress={() => {
              setCodeModal(true);
              signInPhone();
            }}>
            <Text style={styles.submitText}>Sign In</Text>
          </Pressable>
          <Modal
            animationType="slide"
            transparent={false}
            visible={codeModal}
            onRequestClose={() => setCodeModal(false)}>
            <View style={styles.container}>
              <Text
                style={{alignSelf: 'center', fontSize: 28, marginTop: '20%'}}>
                Enter the code your received via SMS
              </Text>
              <RegisterField label="code" textType={code} action={setCode} />
              <Pressable style={styles.submitPressable} onPress={confirmCode}>
                <Text style={styles.submitText}>Confirmar</Text>
              </Pressable>
              <Pressable
                style={styles.btnCancel}
                onPress={() => setCodeModal(false)}>
                <Text style={styles.btnModalText}>Cancel</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </InputScrollView>
    </View>
  );
};

export default NewUser;
