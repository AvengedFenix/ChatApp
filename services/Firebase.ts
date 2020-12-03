import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import functions from '@react-native-firebase/functions';

functions().useFunctionsEmulator('http://localhost:5001');

export const userAuth = auth();
export const db = firestore();
export const fieldValue = firebase.firestore.FieldValue;
export const cloudFunctions = functions();
