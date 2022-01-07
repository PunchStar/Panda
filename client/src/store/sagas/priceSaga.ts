import { put, call, takeEvery, all, fork } from "redux-saga/effects";

import { fetchPrice } from "./../services/priceServices";
import * as actionCreators from "../action/actionCreators/priceActionCreators";
import * as actionTypes from "../action/actionTypes/priceActionTypes";

function* onLoadPrice({ price }: actionTypes.GetPriceAction) {
  try {
    yield put(actionCreators.getPriceRequest());
    const { data } = yield call(fetchPrice, price);
    yield put(actionCreators.getPriceSuccess(data.price));
  } catch (error) {
    // yield put(actionCreators.getPriceFailure(error.response.data.error));
  }
}

function* watchOnLoadPrice() {
  yield takeEvery(actionTypes.GET_PRICE, onLoadPrice);
}

export default function* priceSaga() {
  yield all([fork(watchOnLoadPrice)]);
}
