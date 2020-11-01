// TODO : if possible make this component resuable for other project
// TODO: error checking is still left of form elemnt like address name and all

import React, { useState } from "react";
// import StripeCheckout from "react-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { connect } from "react-redux";
import axios from "axios";

import * as actions from "../actions";
import "./Payment.css";
import Loading from "./Loading";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

// class Payments extends Component {
//   render() {
//     return (
//       <StripeCheckout
//         name="Emaily"
//         description="$5 for 5  email credits"
//         amount={500} // 5 dollar
//         token={(token) => this.props.handleToken(token)} // after getting token from stripe this cb invoke
//         stripeKey={process.env.REACT_APP_STRIPE_KEY}
//       >
//         <button className="btn">Add Credits</button>
//       </StripeCheckout>
//     );
//   }
// }

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

const CheckoutForm = ({ handleToken }) => {
  const [isProcessing, setProcessingTo] = useState(false);
  const [isError, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessingTo(true);

    const billingDetails = {
      name: event.target.fname.value,
      // email: event.target.email.value,
      address: {
        city: event.target.city.value,
        line1: event.target.add.value,
        state: event.target.state.value,
        postal_code: event.target.zip.value,
      },
    };

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });
    if (!error) {
      const { id } = paymentMethod;
      try {
        const res = await axios.post("/api/stripe", {
          token: id,
          amount: 500,
        });
        handleToken(res.data);
      } catch (err) {
        console.log(err.response.data);
        setError(err.response.data.message);
        setProcessingTo(false);
      }
    } else {
      setError(error.message);
      setProcessingTo(false);
    }
  };

  function showError() {
    setTimeout(() => {
      setError("");
    }, 5000);
    return (
      <span className="left" style={{ color: "red" }}>
        {isError}
      </span>
    );
  }

  function handleError(e) {
    if (e.error) {
      return setError(e.error.message);
    }
    setError("");
  }

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <input type="text" name="fname" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <input type="text" name="add" placeholder="Address" />
        <div style={{ display: "flex" }}>
          <input
            placeholder="City"
            type="text"
            name="city"
            style={{ marginRight: "10px" }}
          />
          <input type="text" name="state" placeholder="State" />
          <input
            type="number"
            name="zip"
            placeholder="zip"
            style={{ marginLeft: "10px" }}
          />
        </div>
        <div className="cardElement">
          <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleError} />
        </div>
        {isError ? showError() : null}
        <button
          className="btnStyle"
          type="submit"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? <Loading /> : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Payments = ({ handleToken, auth }) =>
  auth ? (
    <Elements stripe={stripePromise}>
      <CheckoutForm handleToken={handleToken} />
    </Elements>
  ) : (
    <h3 className="red-text center">You Must Logged In Fist</h3>
  );

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, actions)(Payments);
