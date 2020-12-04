import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import functions from '@react-native-firebase/functions';

if (process.env.NODE_ENV === 'development') {
  functions().useFunctionsEmulator('http://localhost:5001');
  firestore().settings({host: 'localhost:8080', ssl: false});
  auth().useEmulator('http://localhost:9099');
}

export const userAuth = auth();
export const db = firestore();
export const fieldValue = firebase.firestore.FieldValue;
export const cloudFunctions = functions();
