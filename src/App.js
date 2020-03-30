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
      isSignedIn: false,
      userId: "",
      userName: "",
      userEmail: "",
      hasDocument: false,
      labels: [],
      data: [],
      fireAuthLoading: true,
      finishedQuery: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState(prevState => ({
        ...prevState,
        userId: user ? user.uid : "",
        userName: user ? user.displayName : "",
        userEmail: user ? user.email : "",
        hasDocument: false,
        fireAuthLoading: false,
        isSignedIn: !!user,
        labels: [],
        data: [],
        finishedQuery: false
      }));

      if (user) {
        console.log("user data:", user);
        this.getData(user.uid);
      }

      console.log("Is signed in?", this.state.isSignedIn);
    });
  }

  render() {
    let chartZone;

    if (this.state.finishedQuery && this.state.labels.length > 0) {
      chartZone = (
        <WeightChart
          chartLabels={this.state.labels}
          chartData={this.state.data}
        />
      );
    } else if (this.state.finishedQuery && this.state.labels.length === 0) {
      chartZone = (
        <div>
          No data registered. Add your first record above to see a chart{" "}
          <span role="img" aria-label="Chart Emoji">
            📈
          </span>
          .
        </div>
      );
    } else {
      chartZone = <div>Loading chart...</div>;
    }

    return (
      <div className="App">
        {this.state.fireAuthLoading ? (
          <div>Loading...</div>
        ) : this.state.isSignedIn ? (
          <>
            <div>
              Welcome {this.state.userName} ({this.state.userEmail})
            </div>
            {/* Conditional rendering to prevent unexpected behaviour when submitting data before database data has finished */}
            {this.state.finishedQuery ? (
              <WeightForm registerEntry={this.registerEntry} />
            ) : null}
            {chartZone}
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
    if (label && data) {
      this.setState(
        prevState => ({
          ...prevState,
          labels: [...prevState.labels, label],
          data: [...prevState.data, data]
        }),
        this.sendToDatabase
      );
    } else {
      alert("You can't submit an empty form!")
    }
  };

  sendToDatabase = () => {
    db.collection("chart-data")
      .doc(this.state.userId)
      .set({
        data: this.state.data,
        labels: this.state.labels
      })
      .then(() => {
        console.log("Document succesfully written");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  getData = userId => {
    let catchedLabels;
    let catchedData;
    let docExist = false;

    const docRef = db.collection("chart-data").doc(this.state.userId);

    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docExist = true;
          catchedLabels = doc.data().labels;
          catchedData = doc.data().data;
        }
        this.setState(prevState => ({
          ...prevState,
          finishedQuery: false
        }));
        console.log("State not set:", this.state);
      })
      .then(() => {
        this.setState(prevState => ({
          ...prevState,
          hasDocument: docExist,
          labels: catchedLabels ? catchedLabels : [],
          data: catchedData ? catchedData : []
        }));
        console.log("State set:", this.state);
      })
      .then(() => {
        this.setState(prevState => ({
          ...prevState,
          finishedQuery: true
        }));
      });
  };
}

export default App;
