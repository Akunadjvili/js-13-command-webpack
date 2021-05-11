import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import notify from '@components/message.notify.js';
import { progress } from '@components/spinner.progress';


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
    progress.show();
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = getUserProfile();
    progress.hide();
    notify.showSuccess({
      code: 'Registration',
      message: `Registration was successful for ${user.email}`,
    });

  } catch (error) {
    progress.hide();
    notify.showError(error);
  }
}

async function signOut() {
  try {
    progress.show();
    const user = getUserProfile();
    await firebase.auth().signOut();
    progress.hide();
    notify.showSuccess({
      code: 'Logout',
      message: `You've exited from ${user.email}`,
    });

  } catch (error) {
    progress.hide();
    notify.showError(error);
  }
}

async function signIn({ email, password }) {
  try {
    progress.show();
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    progress.hide();
    notify.showSuccess({
      code: 'Login',
      message: `You've entered as ${data.user.email}`,
    });

  } catch (error) {
    progress.hide();
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
    progress.show();
    const snapshot = await firebase.database().ref(path).once('value');
    const data = snapshot.val();
    progress.hide();
    return data;
  } catch (error) {
    progress.hide();
    notify.showError(error);
  }
}

async function set(path, value) {
  try {
    progress.show();
    const snapshot = await firebase.database().ref(path).set(value);
    progress.hide();
  } catch (error) {
    progress.hide();
    notify.showError(error);
  }
}

async function getKey(path) {
  try {
    progress.show();
    const data = await firebase.database().ref(path).push().key;
    progress.hide();
    return data;
  } catch (error) {
    progress.hide();
    notify.showError(error);
  }
}

async function getList(path) {
  try {
    progress.show();
    const snapshots = await firebase.database().ref(path).once('value');
    const results = [];
    snapshots.forEach(snapshot => {
      const data = snapshot.val();
      const key = snapshot.key;
      if (data) {
        results.push({ [key]: data });
      }
    });
    progress.hide();
    return results;
  } catch (error) {
    progress.hide();
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
    progress.show();
    const provider = new firebase.auth.GoogleAuthProvider();
    const data = await firebase
      .auth()
      .signInWithPopup(provider);
    console.log(data.user)
    progress.hide();
    notify.showSuccess({
      code: 'Login',
      message: `You've entered as ${data.user.email}`,
    });

  } catch (error) {
    progress.hide();
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
