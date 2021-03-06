import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// reducers
import generalReducer from "../modules/general";
import authReducer from "../modules/auth";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "refreshToken"],
};

export const rootReducer = combineReducers({
  general: generalReducer,
  auth: persistReducer(authPersistConfig, authReducer),
});

export default rootReducer;