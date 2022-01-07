import * as actions from "../actionTypes/priceActionTypes";

export function setPrice(price: string): actions.SetPriceAction {
  return {
    type: actions.SET_PRICE,
    price
  };
}

export function getPrice(
    price: string,
): actions.GetPriceAction {
  return {
    type: actions.GET_PRICE,
    price,
  };
}

export function getPriceRequest(): actions.GetPriceRequestAction {
  return {
    type: actions.GET_PRICE_REQUEST
  };
}

export function getPriceSuccess(
  price: string
): actions.GetPriceSuccessAction {
  return {
    type: actions.GET_PRICE_SUCCESS,
    price
  };
}

export function getPriceFailure(
  error: Error | string
): actions.GetPriceFailureAction {
  return {
    type: actions.GET_PRICE_FAILURE,
    error
  };
}
