import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import notify from '@components/notify.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAXDpJivMtBIGq0eu-2TXFNYZMnriT-5X0',
  authDomain: 'js-28-group-13--project.firebaseapp.com',
  projectId: 'js-28-group-13--project',
  storageBucket: 'js-28-group-13--project.appspot.com',
  messagingSenderId: '800591343626',
  appId: '1:800591343626:web:8d88484e62f6ac57cfaff3',
};
firebase.initializeApp(firebaseConfig);

async function signUp({ email, password }) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = getUserProfile();
    notify.showSuccess({
      code: 'Registration',
      message: `Registration was successful for ${user.email}`,
    });
  } catch (error) {
    notify.showError(error);
  }
}

async function signOut() {
  try {
    const user = getUserProfile();
    await firebase.auth().signOut();
    notify.showSuccess({
      code: 'Logout',
      message: `You've exited from ${user.email}`,
    });
  } catch (error) {
    notify.showError(error);
  }
}

async function signIn({ email, password }) {
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    notify.showSuccess({
      code: 'Login',
      message: `You've entered as ${data.user.email}`,
    });
  } catch (error) {
    notify.showError(error);
  }
}




function spreadSnapshot(snapshot) {
  const data = snapshot.val();
  if (data) {
    const key = Object.keys(data)[0];
    return data[key];
  }
  return null;
}

async function get(path) {
  try {
    const snapshot = await firebase.database().ref(path).once('value');
    const data = snapshot.val();
    return data;
  } catch (error) {
    notify.showError(error);
  }
}

async function set(path, value) {
  try {
    const snapshot = await firebase.database().ref(path).set(value);
  } catch (error) {
    notify.showError(error);
  }
}

async function getKey(path) {
  try {
    return await firebase.database().ref(path).push().key;
  } catch (error) {
    notify.showError(error);
  }
}

async function getList(path) {
  try {
    const snapshots = await firebase.database().ref(path).once('value');
    const results = [];
    snapshots.forEach(snapshot => {
      const data = snapshot.val();
      const key = snapshot.key;
      if (data) {
        results.push({ [key]: data });
      }
    });
    return results;
  } catch (error) {
    notify.showError(error);
  }
}

function statusChanged(callback) {
  firebase.auth().onAuthStateChanged(callback);
}

function isAuth() {
  return getUserProfile() ? true : false;
}

function getUserProfile() {
  return firebase.auth().currentUser;

}

async function signInGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const data = await firebase
      .auth()
      .signInWithPopup(provider);
    console.log(data.user)
    notify.showSuccess({
      code: 'Login',
      message: `You've entered as ${data.user.email}`,
    });
  } catch (error) {
    notify.showError(error);
  }
}



export default {
  signUp,
  signIn,
  signInGoogle,
  signOut,
  statusChanged,
  getUserProfile,
  get,
  getList,
  getKey,
  set,
  isAuth,
  spreadSnapshot,
};
