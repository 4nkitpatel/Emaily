import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSurveys } from "../../actions";

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderSurveyList() {
    return this.props.surveys.reverse().map((survey) => {
      return (
        <div className="card blue-grey darken-1" key={survey._id}>
          <div className="card-content white-text">
            <span className="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            <p className="right">
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action" style={{ color: "#ffab40" }}>
            <span style={{ fontSize: "1.5rem" }}>Yes: {survey.yes}</span>
            <span style={{ marginLeft: "15px", fontSize: "1.5rem" }}>
              No: {survey.no}
            </span>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderSurveyList()}</div>;
  }
}

function mapStateToProps(state) {
  return { surveys: state.surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
