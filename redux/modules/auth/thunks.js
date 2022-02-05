// api
import sdpAPI from "../../../api";

// actions
import { setAccessToken, setRefreshToken } from ".";

import { setInputErrors } from "../general";

// redux
import { toast } from "react-toastify";

export const signup = (email, password) => {
  return async (dispatch, _getState) => {
    try {
      const { data } = await sdpAPI.auth.signup(email, password);
      await dispatch(setVerificationToken(data?.data.access_token));
      const {
        email: _,
        password: __,
        ...rest
      } = _getState().general.inputErrors;
      await dispatch(setInputErrors(rest));
      location.assign("/verify-email");
    } catch (error) {
      if (error?.response?.status === 400) {
        const { email, password } = error.response.data.errors;
        dispatch(
          setInputErrors({
            ..._getState().general.inputErrors,
            email: Array.isArray(email) ? email[0] : email,
            password,
          })
        );
      }
      console.log(error);
    }
  };
};

export const login = async (email, password) => {
  return async (dispatch) => {
    try {
      const { data: loginData } = await sdpAPI.auth.login(email, password);
      const { access, refresh } = loginData;
      await dispatch(setAccessToken(access));
      await dispatch(setRefreshToken(refresh));
      const { data: profileData } = await sdpAPI.auth.getProfile();
      await dispatch(setProfile(profileData));
    } catch (error) {
      toast({ type: "error", message: "Something went wrong" });
    }
  };
};

export const logout = async () => {
  try {
    await sdpAPI.auth.logout();
    await persistor.purge();
    window.location.assign("/");
  } catch (e) {
    toastr.error("Failed to logout");
  }
};
