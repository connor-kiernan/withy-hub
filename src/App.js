import "./App.css";
import {Route, Routes} from "react-router-dom";
import Availability from "./views/Availability";
import NotFound from "./views/NotFound";
import Profile from "./views/Profile";
import Layout from "./components/Layout";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import StripSearch from "./components/StripSearch";
import MatchAvailability from "./components/availability/MatchAvailability";
import Index from "./views/Index";
import Events from "./views/Events";
import RequireRoles from "./features/auth/RequireRoles";
import PreFetchEvents from "./components/PreFetchEvents";

const App = () => {
  return (
      <Routes>
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth/>}>
            <Route element={<StripSearch/>}>
              <Route element={<Layout/>}>
                <Route element={<PreFetchEvents/>}>
                  <Route index element={<Index/>}/>
                  <Route path="/" element={<Index/>}/>
                  <Route path="availability">
                    <Route index element={<Availability/>}/>
                    <Route path=":fixtureId" element={<MatchAvailability/>}/>
                  </Route>
                  <Route path="profile" element={<Profile/>}/>
                  <Route path="*" element={<NotFound/>}/>
                  <Route element={<RequireRoles allowedRoles={["Admin"]}/>}>
                    <Route path="events" element={<Events/>}/>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
  )
      ;
};

export default App;