import React, { useState } from "react";
import { connect } from "react-redux";
import FIELDS from "./formFields";
import _ from "lodash";
import * as action from "../../actions/index";

const SurveyFormReview = ({ onCancel, formValues, submitSurvey }) => {
  const [isProcessing, setProcessingTo] = useState(false);

  const reviewFileds = _.map(FIELDS, (field) => {
    return (
      <div key={field.name}>
        <label>{field.label}</label>
        <div>{formValues[field.name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFileds}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={() => {
          setProcessingTo(true);
          submitSurvey(formValues);
        }}
        className="green right white-text btn"
        disabled={isProcessing}
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  console.log(state.form.surveyForm.values);
  return {
    formValues: state.form.surveyForm.values,
  };
}

export default connect(mapStateToProps, action)(SurveyFormReview);
