import fire from '../config/config';
import {
  GET_TECHS,
  ADD_TECH,
  DELETE_TECH,
  SET_LOADING,
  TECHS_ERROR,
  GET_LOGS,
  LOGS_ERROR,
} from "./types";

// Get techs from server
export const getTechs = () => async dispatch => {
    try {
        setLoading();

        const data = [];

        const res = await fire.database().ref('/techs/').once('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            data.push(childSnapshot.val());
            data.push({
                id: childSnapshot.numChildren() - 1
            })
          })
        })

        dispatch({
            type: GET_TECHS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: TECHS_ERROR,
            payload: err.message
        })
    }
}

export const addTech = (tech) => async dispatch => {
    try {
        setLoading();

        const res = await fetch('/techs', {
            method: 'POST',
            body: JSON.stringify(tech),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();

        dispatch({
            type: ADD_TECH,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: TECHS_ERROR,
            payload: err.response.statusText
        })
    }
}

// Delete Tech
export const deleteTech = (id) => async dispatch => {
    try {
        setLoading();

        await fetch(`/techs/${id}`, {
            method: 'DELETE'
        });

        dispatch({
            type: DELETE_TECH,
            payload: id
        })
    } catch (err) {
        dispatch({
            type: TECHS_ERROR,
            payload: err.response.statusText
        })
    }
}

// Set loading
export const setLoading = () => {
    return {
        type: SET_LOADING
    }
}