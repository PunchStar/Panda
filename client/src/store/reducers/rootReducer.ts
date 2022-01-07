import { combineReducers } from "redux";
import isLoadingReducer from "./isLoadingReducer";
import priceReducer from "./priceReducer";

const rootReducer = combineReducers({
    isLoading: isLoadingReducer,
    price: priceReducer
});

export type Appstate = ReturnType<typeof rootReducer>;

export default rootReducer;