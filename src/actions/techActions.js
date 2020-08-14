import fire from "../config/config";
import {
  GET_TECHS,
  ADD_TECH,
  DELETE_TECH,
  SET_LOADING,
  TECHS_ERROR,
} from "./types";

// Get techs from server
export const getTechs = () => async (dispatch) => {
  try {
    setLoading();

    const data = [];

    const res = fire.database().ref("/techs/");
    res
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          data.push(childSnapshot.val());
        });
        dispatch({
          type: GET_TECHS,
          payload: data,
        });
      })
      .catch((error) => {
        console.log(error.message);
        dispatch({
          type: TECHS_ERROR,
          payload: error.message,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const addTech = (tech) => async (dispatch) => {
  try {
    setLoading();

    let data = {};

    let newObjKey = 0;
    
    fire
    .database()
    .ref("/techs/")
    .once("value")
    .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (newObjKey == childSnapshot.key) {
              console.log()
            newObjKey += 1;
          }
        });
      });


    const res = fire.database().ref("/techs/");
    const newTech = res.child(newObjKey);
    newTech.set(tech, (tech) => {
      let newID = 1;
      res.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            console.log(childSnapshot.val())
          if (newID == childSnapshot.val()["id"]) {
            newID += 1;
          }
        });
        newTech
          .update({ id: JSON.stringify(newID) })
          .then(() => {
            dispatch({
              type: ADD_TECH,
              payload: data,
            });
          })
          .catch((err) => {
            dispatch({
              type: TECHS_ERROR,
              payload: err.response.statusText,
            });
          });
      });
      data = JSON.stringify(tech);
    });
  } catch (err) {
    console.log({err});
  }
};

// Delete Tech
export const deleteTech = (id) => async (dispatch) => {
  try {
    setLoading();

    await fetch(`/techs/${id}`, {
      method: "DELETE",
    });

    dispatch({
      type: DELETE_TECH,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: TECHS_ERROR,
      payload: err.response.statusText,
    });
  }
};

// Set loading
export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
