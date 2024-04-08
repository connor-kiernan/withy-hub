import {useSelector} from "react-redux";
import {selectCurrentToken} from "./authSlice";
import {Outlet, useSearchParams} from "react-router-dom";
import {useEffect, useRef} from "react";
import Login from "./Login";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  const [searchParams] = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true || process.env.REACT_APP_ENVIRONMENT !== "development") {
      const redirect = () => {
       window.location.replace(loginUrl());
      }

      if (!token && !searchParams.has("code")) redirect();
    }

    return () => effectRan.current = true;
    //eslint-disable-next-line
  }, []);

  if (token) {
    return (<Outlet/>);
  }

  if (searchParams.has("code")) {
    return (<Login authCode={searchParams.get("code")} redirectUri={window.location.href.split("?")[0]}/>);
  }
};

function loginUrl() {
  return `${process.env.REACT_APP_COGNITO_URL}/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.href)}`;
}

export default RequireAuth;