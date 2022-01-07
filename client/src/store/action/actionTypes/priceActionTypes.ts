export const SET_PRICE = "priceActionTypes/SET_PRICE";
export interface SetPriceAction {
  type: typeof SET_PRICE;
  price: string;
}

export const GET_PRICE = "priceActionTypes/GET_PRICE";
export interface GetPriceAction {
  type: typeof GET_PRICE;
  price: string;
}

export const GET_PRICE_REQUEST = "priceActionTypes/GET_PRICE_REQUEST";
export interface GetPriceRequestAction {
  type: typeof GET_PRICE_REQUEST;
}

export const GET_PRICE_SUCCESS = "priceActionTypes/GET_PRICE_SUCCESS";
export interface GetPriceSuccessAction {
  type: typeof GET_PRICE_SUCCESS;
  price: string;
}

export const GET_PRICE_FAILURE = "priceActionTypes/GET_PRICE_FAILURE";
export interface GetPriceFailureAction {
  type: typeof GET_PRICE_FAILURE;
  error: Error | string;
}

export type PriceAction =
  | SetPriceAction
  | GetPriceAction
  | GetPriceRequestAction
  | GetPriceSuccessAction
  | GetPriceFailureAction;
