import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControl from "../components/Bookings/BookingControl/BookingControl";
class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list"
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
            query {
              bookings {
                _id
               createdAt
               event {
                 _id
                 title
                 date
                 price
                 lat
                 lng
               }
              }
            }
          `
    };

    const token = this.context.token;
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDg1YmVmMGQ1NzRiNjE1NjQ2NmJiN2UiLCJlbWFpbCI6InZvdmFAdm92YS5jb20iLCJpYXQiOjE1NzAxOTg3OTEsImV4cCI6MTU3MDIwMjM5MX0.mt4F6pY55Y6BQClLRNDKRnU_pu1zyGZj4-XBQWmJy5A
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDg1YmVmMGQ1NzRiNjE1NjQ2NmJiN2UiLCJlbWFpbCI6InZvdmFAdm92YS5jb20iLCJpYXQiOjE1NzAxOTg3OTEsImV4cCI6MTU3MDIwMjM5MX0.mt4F6pY55Y6BQClLRNDKRnU_pu1zyGZj4-XBQWmJy5A

    //Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDg1YmVmMGQ1NzRiNjE1NjQ2NmJiN2UiLCJlbWFpbCI6InZvdmFAdm92YS5jb20iLCJpYXQiOjE1NzAxOTkxNzcsImV4cCI6MTU3MDIwMjc3N30.V-UhwElVCu9wlC6Qi4U18uHn9MhXNFctfx6DV_QyFFM
    //Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDg1YmVmMGQ1NzRiNjE1NjQ2NmJiN2UiLCJlbWFpbCI6InZvdmFAdm92YS5jb20iLCJpYXQiOjE1NzAxOTkxNzcsImV4cCI6MTU3MDIwMjc3N30.V-UhwElVCu9wlC6Qi4U18uHn9MhXNFctfx6DV_QyFFM

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  deleteBooking = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
            mutation CancelBooking($id: ID!) {
              cancelBooking(bookingId: $id) {
                _id
               title
              }
            }
          `,
      variables: {
        id: bookingId
      }
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  outputTypeHandler = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingControl
            activeOutputType={this.state.outputType}
            onChange={this.outputTypeHandler}
          />
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBooking}
              />
            ) : (
              <BookingChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
