import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";
import Header from "./Header";
import Landing from "./Landing";

const Dashboard = () => <h1>Dashboard</h1>;
const laaaa = () => <h1>laaaa</h1>;

class App extends React.Component {
  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <Header />
          <Route path="/" exact component={Landing} />
          <Route path="/surveys" exact component={Dashboard} />
          <Route path="/surveys/new" component={laaaa} />
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
