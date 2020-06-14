import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    REMOVE_ALL_FROM_CART,
} from "../actions/actionTypes";

export default (state = {}, action) => {
    const { id } = action;
    switch (action.type) {
        case ADD_TO_CART:
            let aState = { ...state };
            aState[id] = (aState[id] || 0) + 1;
            return aState;
        case REMOVE_FROM_CART:
            let rState = {};
            for (let k of Object.keys(state)) {
                if (k === id) {
                    if (state[k] > 1) {
                        rState[k] = state[k] - 1;
                    } else {
                        continue;
                    }
                } else {
                    rState[k] = state[k];
                }
            }
            return rState;
        case REMOVE_ALL_FROM_CART:
            let rlState = {};
            for (let k of Object.keys(state)) {
                if (k !== id) {
                    rlState[k] = state[k];
                }
            }
            return rlState;
        default:
            return state;
    }
};
