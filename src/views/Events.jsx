import React from "react";
import AddEvent from "../components/Events/AddEvent";

const Events = () => (
    <>
      <ul className="nav nav-pills mb-2 justify-content-center" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="add-tab" data-bs-toggle="tab" data-bs-target="#add"
                  type="button" aria-controls="add"><h4 className="mb-0">Add Event</h4>
          </button>
        </li>
        <li>
          <button className="nav-link" id="manage-tab" data-bs-toggle="tab" data-bs-target="#manage"
                  type="button" aria-controls="Add"><h4 className="mb-0">Manage Events</h4>
          </button>
        </li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane active" id="add" role="tabpanel" aria-labelledby="add-tab" tabIndex="0">
          <AddEvent />
        </div>
      </div>
      <div className="tab-content">
        <div className="tab-pane" id="manage" role="tabpanel" aria-labelledby="manage-tab" tabIndex="0">
          <h1>Manage Events</h1>
        </div>
      </div>
    </>
);

export default Events;