import * as actions from "../action/actionTypes/priceActionTypes";

export interface PriceState {
  price: string;
}

const initialState: PriceState = {
  price: ""
};

export default function priceReducer(
  state: PriceState = initialState,
  action: actions.PriceAction
): PriceState {
  switch (action.type) {
    case actions.SET_PRICE:
    case actions.GET_PRICE_SUCCESS:
      return {
        price: action.price
      };
    default:
      return state;
  }
}