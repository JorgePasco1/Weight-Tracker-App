const firebaseConfig = {
  apiKey: "AIzaSyAf04_F2GESer6ydTVRZn_CCJBRFEnNxRg",
  authDomain: "jorgepasco-weight-track-app.firebaseapp.com",
  databaseURL: "https://jorgepasco-weight-track-app.firebaseio.com",
  projectId: "jorgepasco-weight-track-app",
  storageBucket: "jorgepasco-weight-track-app.appspot.com",
  messagingSenderId: "779688991076",
  appId: "1:779688991076:web:f8649a6753a2f2feb18271",
  measurementId: "G-V06NKSPQJJ"
}

const uiConfig = (firebase) => ({
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ],
  signInFlow: "popup"
});

export {firebaseConfig, uiConfig};