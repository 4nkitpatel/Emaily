import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";
import Header from "./Header";
import Landing from "./Landing";
import Payments from "./Payments";
import history from "../history";
import Dashboard from "./Dashboard";
import SurveyNew from "./surveys/SurveyNew";

class App extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <Router history={history}>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/surveys" exact component={Dashboard} />
            <Route path="/checkout" exact component={Payments} />
            <Route path="/surveys/new" component={SurveyNew} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(null, actions)(App);
