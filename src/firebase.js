import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCJlrZfT3kNyU35l34JYTRyGcTkVSeOYhI',
  authDomain: 'smartbelltify.firebaseapp.com',
  databaseURL: 'https://smartbelltify.firebaseio.com',
  projectId: 'smartbelltify',
  storageBucket: 'smartbelltify.appspot.com',
  messagingSenderId: '896502089874',
  appId: '1:896502089874:web:be504cad1f8525b3',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default {
  firestore: firebase.firestore(),
  auth: firebase.auth(),
};
