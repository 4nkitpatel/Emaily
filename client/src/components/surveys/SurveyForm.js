import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import _ from "lodash";
import SurveyField from "./SurveyField";
import { Link } from "react-router-dom";
import validateEmails from "../../utils/validateEmailList";

import FIELDS from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return _.map(FIELDS, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancle
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const error = {};

  _.each(FIELDS, ({ name }) => {
    if (!values[name]) {
      error[name] = "You must provide a body";
    }
  });

  error.recipients = validateEmails(values.recipients || "");

  return error; // if empty object returned then no error [redux-form]
}

export default reduxForm({
  validate: validate, // every time user submit the form this function will call
  form: "surveyForm",
  destroyOnUnmount: false,
})(SurveyForm);
