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
        fireAuthLoading: false,
        isSignedIn: !!user,
        labels: [],
        data: [],
        dataReceived: false
      }));

      if (user) {
        console.log("user id", user.uid);
        this.getData(user.uid);
      }

      console.log("Is signed in?", this.state.isSignedIn);
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.fireAuthLoading ? (
          <div>Loading...</div>
        ) : this.state.isSignedIn ? (
          <>
            <div>Signed In</div>
            <WeightForm registerEntry={this.registerEntry} />
            {this.state.dataReceived ? (
              <WeightChart
                chartLabels={this.state.labels}
                chartData={this.state.data}
              />
            ) : (
              <div>Loading chart...</div>
            )}
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
          catchedLabels = doc.data().labels;
          catchedData = doc.data().data;
        });
        console.log("Data not catched. State:", this.state);
        
      })
      .then(() => {
        this.setState(prevState => ({
          ...prevState,
          labels: catchedLabels ? catchedLabels : [],
          data: catchedData ? catchedData : [],
          dataReceived: true
        }));
        console.log("Data cached. State:" , this.state)
      })
  };
}

export default App;
