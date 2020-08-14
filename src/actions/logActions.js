import fire from "../config/config";
import {
  GET_LOGS,
  SET_LOADING,
  LOGS_ERROR,
  ADD_LOG,
  DELETE_LOG,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_LOG,
  SEARCH_LOGS,
} from "./types";


// Get Logs from Server
export const getLogs = () => async (dispatch) => {
  try {
    setLoading();

    const data = [];

    const res = fire
      .database()
      .ref("/logs/")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          data.push(childSnapshot.val());
        });
        dispatch({
          type: GET_LOGS,
          payload: data,
        });
      })
      .catch((err) => {
        if (err["code"] === "PERMISSION DENIED") {
          window.alert("Permission denied");
          dispatch({
            type: LOGS_ERROR,
            payload: err.response,
          });
        } else {
        }
      });
  } catch (err) {
  }
};

// Add new log
export const addLog = (log) => async (dispatch) => {
  try {
    setLoading();

    let data = log;

    let newObjKey = 0;
    let newID = '';

    await fire
      .database()
      .ref("/logs/")
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (newObjKey == childSnapshot.key) {
            newObjKey += 1;
          }
        });
      });

    const res = fire.database().ref("/logs/");
    const newLog = res.child(newObjKey);
    newLog.update(log, () => {
      let newID = 1;
      res.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (newID == childSnapshot.val()["id"]) {
            newID += 1;
          }
        });
        newLog.update({ id: JSON.stringify(newID) });
      });
    });
    data['id'] = newID;

    dispatch({
      type: ADD_LOG,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOGS_ERROR,
      payload: err.message,
    });
  }
};

// Delete log
export const deleteLog = (id) => async (dispatch) => {
  try {
    setLoading();

    // Change resp to res
    // @Desc    Delete log function
    const resp = fire.database().ref("/logs/");
    resp.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (id == childSnapshot.val()["id"]) {
          const childID = childSnapshot.val()["id"];
        
          const result = window.confirm("Are you sure?");
          if (result) {
            resp
              .child(childSnapshot.key)
              .remove()
              .then(() => {
                dispatch({
                  type: DELETE_LOG,
                  payload: id,
                });
              })
              .catch((err) => {
                dispatch({
                  type: LOGS_ERROR,
                  payload: err.message,
                });
              });
          }
        } else {
          getLogs();
        }
      });
    });
  } catch (err) {
    dispatch({
      type: LOGS_ERROR,
      payload: err.response.statusText,
    });
  }
};

// Update log
export const updateLog = (log) => async (dispatch) => {
  try {
    setLoading();


    const resp = fire.database().ref(`/logs/`);

    const data = ''

    dispatch({
      type: UPDATE_LOG,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOGS_ERROR,
      payload: err.message,
    });
  }
};

export const searchLogs = (text) => async (dispatch) => {
  try {
    setLoading();

    const res = await fetch(`/logs?q=${text}`);
    const data = await res.json();

    dispatch({
      type: SEARCH_LOGS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOGS_ERROR,
      payload: err.response.statusText,
    });
  }
};

// Set current log
export const setCurrent = (log) => {
  return {
    type: SET_CURRENT,
    payload: log,
  };
};

// Clear current log
export const clearCurrent = (log) => {
  return {
    type: CLEAR_CURRENT,
  };
};

// Set Loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
