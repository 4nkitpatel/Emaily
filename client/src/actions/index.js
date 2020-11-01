import axios from "axios";
import history from "../history";
import { FETCH_USER, FETCH_SURVEYS } from "./types";

export const fetchUser = () => async (dispatch) => {
  const response = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: response.data });
};

export const handleToken = (user) => {
  history.push("/surveys");
  return { type: FETCH_USER, payload: user };
};

export const submitSurvey = (values) => async (dispatch) => {
  const response = await axios.post("/api/surveys", values);
  history.push("/surveys");
  dispatch({ type: FETCH_USER, payload: response.data });
};

export const fetchSurveys = () => async (dispatch) => {
  const res = await axios.get("/api/surveys");
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};

// export const handleToken = (token, amount) => async (dispatch) => {
//   try {
//     const res = await axios.post("/api/stripe", { token, amount });
//     console.log(res);
//     dispatch({ type: FETCH_USER, payload: res.data });
//     history.push("/surveys");
//   } catch (err) {
//     console.log(err.response.data);
//     dispatch({ type: PAYMENT_STATUS, payload: err.response.data });
//   }
// };
