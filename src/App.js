import React, { Component } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as config from "./firebaseConfig";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import WeightChart from "./WeighChartCmp/WeightChart";
import WeightForm from "./WeightFormCmp/WeightForm";

firebase.initializeApp(config.firebaseConfig);
const db = firebase.firestore();

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      isSignedIn: false,
      labels: [],
      data: []
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      let labels;
      let data;

      console.log(user.uid);
      this.setState(prevState => ({
        ...prevState,
        isSignedIn: !!user
      }));

      db.collection("chart-data")
        .where("userId", "==", user.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            labels = doc.data().labels;
            data = doc.data().data;
          });
        })
        .then(() => {
          console.log("labels", labels);
          console.log("data", data);
        });
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.isSignedIn ? (
          <>
            <div>Signed In</div>
            <WeightForm registerEntry={this.registerEntry} />
            <WeightChart />
            <button onClick={() => firebase.auth().signOut()}>Sign out</button>
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

  registerEntry = (label, data) => {
    console.log("label:", label);
    console.log("data:", data);
  };
}

export default App;
