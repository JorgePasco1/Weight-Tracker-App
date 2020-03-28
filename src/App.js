import React, { Component } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as config from "./firebaseConfig";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

firebase.initializeApp(config.firebaseConfig);
const db = firebase.firestore();

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
            uiConfig={config.uiConfig(firebase)}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    );
  }
}

export default App;
