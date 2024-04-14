import React, {useEffect} from "react";
import {Outlet, useSearchParams} from "react-router-dom";

const StripSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has('code')) {
      searchParams.delete('code');
      setSearchParams(searchParams);
    }
  })

  return (
      <Outlet />
  );
};

export default StripSearch;