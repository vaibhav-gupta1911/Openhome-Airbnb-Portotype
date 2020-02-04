import firebase from 'firebase/app'
import 'firebase/storage'

 
var firebaseConfig = {
    apiKey: "AIzaSyBf4dt38wISG11Vqjals7QPV9G1FHVOcIw",
    authDomain: "openhome-91c46.firebaseapp.com",
    databaseURL: "https://openhome-91c46.firebaseio.com",
    projectId: "openhome-91c46",
    storageBucket: "openhome-91c46.appspot.com",
    messagingSenderId: "412464867726",
    appId: "1:412464867726:web:dc17c87cda26f0a4381cdf",
    measurementId: "G-W3YZ8H8BND"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();

  export {
      storage, firebase as default
  }