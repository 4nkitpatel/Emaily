import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./LoadingSpinner.css";
// import Loading from "./Loading";
// import Payments from "./Payments";

class Header extends Component {
  loadingLine() {
    return (
      <div className="loadingio-spinner-rolling-k1kieaaxnfn">
        <div className="ldio-htjza9k64sv">
          <div></div>
        </div>
      </div>
    );
  }

  renderContent() {
    switch (this.props.auth) {
      // case null:
      //   return <Loading />; // TODO: why they are delay to display
      case false:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );
      default:
        return [
          <li key="1">
            <Link to="/checkout">
              <button disabled={this.props.auth ? false : true} className="btn">
                Add Credits
              </button>
            </Link>
          </li>,
          <li
            key="3"
            style={{
              margin: "0 10px",
              color: "yellow",
              fontWeight: "bold",
            }}
          >
            CREDITS:
            {this.props.auth ? this.props.auth.credits : this.loadingLine()}
          </li>,
          <li key="2">
            {this.props.auth ? (
              <a href="/api/logout">Logout</a>
            ) : (
              <a href="/surveys">Logout</a>
            )}
          </li>,
        ];
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link
            to={this.props.auth ? "/surveys" : "/"}
            className="brand-logo left"
          >
            Emaily
          </Link>
          <ul id="nav-mobile" className="right">
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(Header);
