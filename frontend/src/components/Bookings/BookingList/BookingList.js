import React from "react";
import "../../Bookings/BookingList/BookingList.scss";
const bookingList = props => (
  <ul className="bookings__list">
    {props.bookings.map(booking => {
      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title}-{"  "}
            {new Date(booking.createdAt).toLocaleString()}
          </div>
          <div className="bookings__item-action">
              <button onClick={props.onDelete.bind(this,booking._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default bookingList;
