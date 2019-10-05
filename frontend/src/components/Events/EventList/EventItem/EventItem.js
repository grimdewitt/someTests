import React from "react";

import "./EventItem.scss";
const eventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>Price: {props.price}</h2>
      <h3>Date: {new Date(props.date).toLocaleDateString('de-DE')}</h3> 
    </div>

    <div>
      {props.userId === props.creatorId ? (
        <p>Owner</p>
      ) : (
        <button className="button" onClick={props.onDetail.bind(this,props.eventId)}>Detail</button>
      )}
    </div>
  </li>
);

export default eventItem;
