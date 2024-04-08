import "./App.css";
import {Route, Routes} from "react-router-dom";
import Availability from "./views/Availability";
import NotFound from "./views/NotFound";
import Profile from "./views/Profile";
import Layout from "./components/Layout";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./components/PersistLogin";

const App = () => {
  return (
      <>
        <Routes>
          <Route path="/">
            <Route element={<PersistLogin/>}>
              <Route element={<RequireAuth/>}>
                <Route element={<Layout/>}>
                  <Route index element={<Availability/>}/>
                  <Route path="availability" element={<Availability/>}/>
                  <Route path="profile" element={<Profile/>}/>
                  <Route path="*" element={<NotFound/>}/>
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>

      </>
  );
};

export default App;