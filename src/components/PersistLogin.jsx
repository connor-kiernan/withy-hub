import {useEffect, useRef, useState} from "react";
import {Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice";
import {useRefreshMutation} from "../features/auth/authApiSlice";
import LoadingScreen from "./LoadingScreen";

const PersistLogin = () => {
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, {
    isUninitialised,
    isLoading,
    isSuccess,
    isError
  }] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.REACT_APP_ENVIRONMENT !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();

          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      }

      if (!token) {
        verifyRefreshToken();
      }
    }

    return () => effectRan.current = true;

    //eslint-disable-next-line
  }, []);

  let content
  if (isLoading) {
    content = <LoadingScreen />
  } else if ((token && isUninitialised) || (isSuccess && trueSuccess)) {
    content = <Outlet />;
  } else if (isError) {
    return <Outlet /> //expired
  }

  return content;
};

export default PersistLogin;
