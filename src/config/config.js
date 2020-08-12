const firebase = require('firebase');

export const DB_CONFIG = {
  apiKey: "AIzaSyBbcDD0QmEJI7J6HxznK4jK-8Nncn9LTU0",
  authDomain: "it-logger-9af52.firebaseapp.com",
  databaseURL: "https://it-logger-9af52.firebaseio.com",
  projectId: "it-logger-9af52",
  storageBucket: "it-logger-9af52.appspot.com",
  messagingSenderId: "641955595582",
  appId: "1:641955595582:web:34ae40d6fa19513e4a586f",
  measurementId: "G-76HE97ECCC",
};

const fire = firebase.initializeApp(DB_CONFIG);
export default fire;