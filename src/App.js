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
      labels: [],
      data: [],
      fireAuthLoading: true,
      dataReceived: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState(prevState => ({
        ...prevState,
        userId: user ? user.uid : "",
        userName: user ? user.displayName : "",
        userEmail: user ? user.email : "",
        fireAuthLoading: false,
        isSignedIn: !!user,
        labels: [],
        data: [],
        dataReceived: false
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

    if (this.state.dataReceived && this.state.labels.length > 0) {
      chartZone = (
        <WeightChart
          chartLabels={this.state.labels}
          chartData={this.state.data}
        />
      );
    } else if (this.state.dataReceived && this.state.labels.length === 0) {
      chartZone = (
        <div>
          No data registered. Add your first record above to see a chart <span role="img" aria-label="Chart Emoji">📈</span>.
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
            <WeightForm registerEntry={this.registerEntry} />
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
    //TODO: Add the entry to the state and send it to the database in the background
    this.setState(prevState => ({
      ...prevState,
      labels: [...prevState.labels, label],
      data: [...prevState.data, data]
    }));
  };

  getData = userId => {
    let catchedLabels;
    let catchedData;

    db.collection("chart-data")
      .where("userId", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          catchedLabels = doc.data().labels;
          catchedData = doc.data().data;
        });
        console.log("Data not catched. State:", this.state);
        this.setState(prevState => ({
          ...prevState,
          dataReceived: false
        }));
      })
      .then(() => {
        this.setState(prevState => ({
          ...prevState,
          labels: catchedLabels ? catchedLabels : [],
          data: catchedData ? catchedData : [],
          dataReceived: true
        }));
        console.log("Data cached. State:", this.state);
      });
  };
}

export default App;
