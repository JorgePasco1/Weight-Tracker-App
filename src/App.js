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
      data: [],
      fireAuthLoading: true
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState(prevState => ({
        ...prevState,
        fireAuthLoading: false,
        isSignedIn: !!user
      }));

      if (user) {
        // console.log(user.uid);
        this.getData(user.uid);
      }

      console.log("Is signed in?", this.state.isSignedIn);
    });
  }

  render() {
    return (
      <div className="App">
        { this.state.fireAuthLoading ? (
          <div>Loading...</div> 
        ) : this.state.isSignedIn ? (
          <>
            <div>Signed In</div>
            <WeightForm registerEntry={this.registerEntry} />
            {/* TODO: Fix WeightChart rendering before data passed */}
            <WeightChart chartLabels={this.state.labels} chartData={this.state.data} />
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

  getData = userId => {
    let catchedLabels;
    let catchedData;

    db.collection("chart-data")
      .where("userId", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc);
          catchedLabels = doc.data().labels;
          catchedData = doc.data().data;
        });
      })
      .then(() => {
        if (catchedLabels) {
          this.setState(prevState => ({
            ...prevState,
            labels: catchedLabels,
            data: catchedData
          }));
        }
        console.log("state labels", this.state.labels);
        console.log("state data", this.state.data);
      });
  };
}

export default App;
