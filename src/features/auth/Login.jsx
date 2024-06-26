import {setCredentials} from "./authSlice";
import {Outlet} from "react-router-dom";
import {useLoginMutation} from "./authApiSlice";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";

const Login = ({authCode, redirectUri}) => {
  const [login, {
    isLoading,
    isSuccess,
  }] = useLoginMutation();
  const effectRan = useRef(false);
  const dispatch = useDispatch();
  const [trueSuccess, setTrueSuccess] = useState(false);

  useEffect(() => {
    if (effectRan.current === true || process.env.REACT_APP_ENVIRONMENT !== "development") {
      const exchangeCode = async () => {
        try {
          const authResponse = await login({authCode, redirectUri}).unwrap();
          dispatch(setCredentials({...authResponse}))

          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      }
      exchangeCode();
    }

    return () => effectRan.current = true;

    //eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (<LoadingScreen />)
  }

  if (isSuccess && trueSuccess) {
    return (<Outlet />);
  }

  return (<p>Error</p>)
}

export default Login;