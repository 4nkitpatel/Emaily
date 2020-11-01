import React, { Component } from "react";
import { connect } from "react-redux";
import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";
import { reduxForm } from "redux-form";

class SurveyNew extends Component {
  state = {
    showFormReview: false,
  };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }
    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return this.props.auth ? (
      <div>{this.renderContent()}</div>
    ) : (
      <h3 className="red-text center">You Must Logged In Fist</h3>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

// we added this redux form to when user click cacel it will clear all the data
// bcz by default destroyOnUnmount is set to true
export default reduxForm({
  form: "surveyForm",
})(connect(mapStateToProps)(SurveyNew));
