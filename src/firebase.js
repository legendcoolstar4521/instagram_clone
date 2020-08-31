import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD6QdPs4zJMB8yB0hggp9vhzCgg6LQ3WBk",
    authDomain: "instagram-clone-ff041.firebaseapp.com",
    databaseURL: "https://instagram-clone-ff041.firebaseio.com",
    projectId: "instagram-clone-ff041",
    storageBucket: "instagram-clone-ff041.appspot.com",
    messagingSenderId: "858797116328",
    appId: "1:858797116328:web:cb077a18b100899fa32b9d",
    measurementId: "G-JTBNDWP60T"
})
const db = firebaseApp.database();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage }