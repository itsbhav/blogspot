import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { Navigate, useLocation } from "react-router-dom";
const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const { pathname } = useLocation();
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError}] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        try {
          await refresh();

          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) {
        verifyRefreshToken();
      }
    }

    return () => (effectRan.current = true);
  }, [persist,refresh,token]);

  let content;
  if (!persist) {
    // persist: no
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    content = <PulseLoader color={"#FFF"} />;
  } else if (isError) {
    //persist: yes, token: no

    content = <Navigate to="/" state={{ from: pathname }} replace />;
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes

    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes

    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
