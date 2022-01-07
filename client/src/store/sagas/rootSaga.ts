import { all, fork } from "redux-saga/effects";
import PriceSaga from "./priceSaga";

export default function* rootSaga() {
  yield all([fork(PriceSaga)]);
}
