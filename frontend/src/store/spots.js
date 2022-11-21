import { csrfFetch } from "./csrf";

// Action Type
const GET_ALL_SPOTS = "spots/getallspots"
const GET_SPOT_BY_ID = "spots/getspotbyid"
const GET_SPOTS_OF_USER = "spots/getspotsofuser"
const CREATE_NEW_SPOT = "spots/createnewspot"
const EDIT_SPOT = "spots/editspot"
const DELETE_SPOT = "spots/deletespot"
const ADD_IMAGE = "spots/addimage"

// Action Creator
export const setSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

export const setSpotById = (spot) => {
    return {
        type: GET_SPOT_BY_ID,
        spot
    }
}

export const createNewSpotAction = (spotDetails) => {
    return {
        type: CREATE_NEW_SPOT,
        spotDetails
    }
}

export const editSpotAction = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    }
}

export const deleteSpotAction = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

export const getSpotsOfUserAction = (spots) => {
    return {
        type: GET_SPOTS_OF_USER,
        spots
    }
}

export const addImageAction = (image) => {
    return {
        type: ADD_IMAGE,
        image
    }
}

// Thunks **********************
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json();

    if (response.ok) {
        dispatch(setSpots(data.Spots))
    }

    return response
}

export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();

    if (response.ok) {
        dispatch(setSpotById(data))
    }
    return response
}

export const createSpot = (spotInfo) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify(spotInfo)
    });

    // const data = await response.json();
    if (response.ok) {
        dispatch(setSpots());
    }
    return response
}

export const editSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}`,{
        method: "PUT",
        body: JSON.stringify(spot)
    });
    const data = await response.json();

    if (response.ok) {
        dispatch(editSpotAction(data));
    }
    return response
}

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });
    // const data = await response.json()
    if (response.ok) {
        dispatch(deleteSpotAction(spotId))
    }
    return response
}

export const getSpotsOfUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current")
    const data = await response.json();

    if (response.ok) {
        dispatch(getSpotsOfUserAction(data.Spots))
    }
    return response
}

export const addImage = (image, spotId) => async (dispatch) => {
    let { url, preview } = image;
    if (!preview) preview = false;

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify({
            url,
            preview
        })
    })

    const data = await response.json();
    dispatch(addImageAction(data));

    return response
}
// Reducer
const initialState = { Spots: [], spotById: null, userSpots: null}

export const spotReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case GET_ALL_SPOTS:
            newState.Spots = action.spots
            return newState;
        case GET_SPOT_BY_ID:
            newState.spotById = action.spot
            return newState;
        case GET_SPOTS_OF_USER:
            newState.userSpots = action.spots;
            return newState
        case EDIT_SPOT:
            // FIND INDEX OF EXISTING SPOT AND SPLICE REPLACE
            const { id } = action.spot;
            const spotIndexEdit = newState.userSpots.findIndex(spot => Number(spot.id) === Number(id));
            newState.userSpots.splice(spotIndexEdit, 1, action.spot);
            return newState
        case DELETE_SPOT:
            const { spotId } = action;
            const spotIndexDelete = newState.userSpots.find(spot => Number(spot.id) === Number(spotId));
            newState.userSpots.splice(spotIndexDelete, 1)
            return newState;
        case ADD_IMAGE:
            newState.spotById.SpotImages.concat([action.image])
            return newState;
        default:
            return state;
    }
}
