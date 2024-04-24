import React from "react";
import {Link, Outlet, useLocation} from "react-router-dom";

const Events = () => {
  const location = useLocation();
  const addActive = location.pathname === "/events/add";
  const [addClassName, editClassName] = addActive ?
      ["nav-link active", "nav-link"] : ["nav-link", "nav-link active"];

  return (<>
        <ul className="nav nav-pills mb-2 justify-content-center" role="tablist">
          <li className="nav-item" role="presentation">
            <Link className={addClassName} id="add-tab" to="add">
              <h4 className="mb-0">Add Event</h4>
            </Link>
          </li>
          <li>
            <Link className={editClassName} id="manage-tab" to="manage">
              <h4 className="mb-0">Manage Events</h4>
            </Link>
          </li>
        </ul>

        <Outlet />
      </>
  );
}

export default Events;