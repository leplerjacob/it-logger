import fire from '../config/config';
import { GET_LOGS, SET_LOADING, LOGS_ERROR, ADD_LOG, DELETE_LOG, SET_CURRENT, CLEAR_CURRENT, UPDATE_LOG, SEARCH_LOGS } from "./types";
import { isCompositeComponent } from 'react-dom/test-utils';

// export const getLogs = () => {
//     return async (dispatch) => {
//         setLoading();

//         const res = await fetch('/logs');
//         const data = await res.json();

//         dispatch({
//             type: GET_LOGS,
//             payload: data
//         })
//     }
// }

// Get Logs from Server
export const getLogs = () => async (dispatch) => {
  try {
    setLoading();
    
    const data = [];

    const res = await fire.database().ref('/logs/').once('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        console.log(childSnapshot.val()['id'])
        data.push(childSnapshot.val());
      })
    })
    
    dispatch({
      type: GET_LOGS,
      payload: data,
    });
  } catch (err) {
    console.log({err});
    if(err.code != 'PERMISSION DENIED') {
      dispatch({
        type: LOGS_ERROR,
        payload: err.response,
      });
    } else {
      window.alert("Permission denied");
    }

  }
};

// Add new log
export const addLog = (log) => async (dispatch) => {
  try {
    setLoading();

    console.log(log)

    let data = {}

    const res = await fire.database().ref('/logs/')
    const newLog = res.push();
    newLog.set((log), (log) => {
      let newID = 1;
      res.once('value', (snapshot) => {
        snapshot.forEach(childSnapshot => {
          if(newID == childSnapshot.val()['id']) {
            newID += 1;
          }
        })
        newLog.update({'id': JSON.stringify(newID)});
      })
      data = JSON.stringify(log);
    });

    dispatch({
      type: ADD_LOG,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOGS_ERROR,
      payload: err.response.statusText,
    });
  }
};

// Delete log
export const deleteLog = (id) => async (dispatch) => {
  try {
    setLoading();

    const resp = await fire.database().ref('/logs/');
    const delLog = resp.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (id == childSnapshot.val()['id']){
          console.log("This object will be deleted: " + childSnapshot.val()['id']);
          console.log(childSnapshot.ref())
        }
      })
    })

    const res = await fetch(`/logs/${id}`, {
      method: "DELETE",
    });

    dispatch({
      type: DELETE_LOG,
      payload: id,
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

    const res =  await fetch(`/logs/${log.id}`, {
      method: "PUT",
      body: JSON.stringify(log),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    dispatch({
      type: UPDATE_LOG,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOGS_ERROR,
      payload: err.response.statusText,
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
export const setCurrent = log => {
  return {
    type: SET_CURRENT,
    payload: log
  }
}

// Clear current log
export const clearCurrent = log => {
  return {
    type: CLEAR_CURRENT,
  }
}

// Set Loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
