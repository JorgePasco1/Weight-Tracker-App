import React, { Component } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ],
  signInFlow: "popup"
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user =>
      this.setState(prevState => ({
        ...prevState,
        isSignedIn: !!user
      }))
    );
  }

  render() {
    return (
      <div className="App">
        {this.state.isSignedIn ? (
          <>
            <div>Signed In</div>
            <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
          </>
        ) : (
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    );
  }
}

export default App;
