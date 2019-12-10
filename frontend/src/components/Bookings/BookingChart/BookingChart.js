import React from "react";

var lat, lng;

const bookingsChart = props => {
  navigator.geolocation.getCurrentPosition(position => {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    //console.log(lat, lng);

    const filteredBookings = props.bookings.filter(value => {
      console.log(lat, lng);
      console.log(value.event.lat, value.event.lng);
      return (Math.abs(value.event.lat - lat) < 0.1 && Math.abs(value.event.lat - lat) < 0.1);
    });
    console.log(filteredBookings);

    // const books = filteredBookings.map(booking => {
    //   return (
    //     <BookingItem
    //       key={booking._id}
    //       title={booking.event.title}
    //       price={booking.event.price}
    //       date={booking.event.date}
    //     />
    //   );y
    
    // });
    // return <ul className="event__list">{books}</ul>;
  });

  return <p>ALOHA</p>;
};

export default bookingsChart;

// class bookingsChart extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       lat: null,
//       lng: null,
//       markers: [],
//       locations: []
//     };
//   }
//   componentDidMount() {
//     navigator.geolocation.getCurrentPosition(position =>
//       this.setState({
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       })
//     );

//     navigator.geolocation.getCurrentPosition(position => {
//           this.lat = position.coords.latitude;
//           this.lng = position.coords.longitude;
          
      
//           const filteredBookings = props.bookings.filter(value => {
//             console.log(lat, lng);
//             console.log(value.event.lat, value.event.lng);
//             return (Math.abs(value.event.lat - lat) < 0.1 && Math.abs(value.event.lat - lat) < 0.1);
//           });
//           console.log(filteredBookings);
//   }
// }

// export default bookingsChart;