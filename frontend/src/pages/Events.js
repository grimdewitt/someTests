import React, { Component } from "react";
import "./Event.scss";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import GoogleMap from "../components/Googlemap/GoogleMap";
//const nodemailer = require('nodemailer');
import nodemailer from "nodemailer";
//import GoogleMapReact from 'google-map-react';
//import GoogleMapReact from 'google-map-react'

//const AnyReactComponent = ({ text }) => <div>{ text }</div>;export default class Map extends Component {
// static defaultProps = {
//  center: { lat: 40.7446790, lng: -73.9485420 },
//  zoom: 11
//}
//}

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
    latNew: null,
    lngNew: null
  };
  isActive = true;

  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
    //this.sendMail();
  }

  sendMail() {
    let transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "murray.von74@ethereal.email",
        pass: "Abm4fUYrevSVvdGjAN"
      }
    });
    const message = {
      from: 'murray.von74@ethereal.email', // Sender address
      to: "murray.von74@ethereal.email", // List of recipients
      subject: "Design Your Model S | Tesla", // Subject line
      text: "Have the most fun you can in a car. Get your Tesla today!" // Plain text body
    };
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  startCreateEvent = () => {
    this.setState({ creating: true });
  };
  modalConfirm = () => {
    this.setState({ creating: false });
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const lat = this.state.latNew;
    const lng = this.state.lngNew;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    //const event = { title, price,lat,lng, date, description };
    //console.log(event);

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    //const event = { title, price,lat,lng, date, description };
    //console.log(event);

    const requestBody = {
      query: `
                    mutation CreateEvent($title:String!,$desc:String!,$price:Float!,$lat:Float!,$lng:Float!,$date:String!){
                        createEvent(eventInput:{title: $title,description: $desc,price: $price,lat: $lat,lng: $lng,date: $date}){
                          _id
                          title
                          description
                          date
                          price
                          lat
                          lng                           
                        }
                    }
                `,
      variables: {
        title: title,
        desc: description,
        price: price,
        lat: lat,
        lng: lng,
        date: date
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
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            lat: resData.data.createEvent.lat,
            lng: resData.data.createEvent.lng,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  modalCancel = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
                    query{
                      events{ 
                          _id
                          title
                          description
                          date
                          price
                          lat
                          lng
                          creator{
                            _id
                            email
                          }                            
                        }
                    }
                `
    };

    //const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetail = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEvent = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
                    mutation BookEvent($id: ID!){
                      bookEvent(eventId: $id){ 
                          _id
                          createdAt
                          updatedAt                         
                        }
                    }
                `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    //const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentWillUnmount() {
    this.isActive = false;
  }
  updateData = value => {
    this.setState({
      latNew: value.lat,
      lngNew: value.lng
    });
    //console.log(this.state.latNew);
    //console.log(this.state.lngNew);
  };
  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancel}
            onConfirm={this.modalConfirm}
            confirmText="Confirm"
          >
            <form>
              <div className="GoogleMap">
                <GoogleMap updateData={this.updateData}></GoogleMap>
              </div>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleEl}></input>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceEl}></input>
              </div>

              <div className="form-control">
                <label htmlFor="lat">lat</label>
                <p>{this.state.latNew}</p>
              </div>
              <div className="form-control">
                <label htmlFor="lng">lng</label>
                <p>{this.state.lngNew}</p>
              </div>

              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateEl}
                ></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  ref={this.descriptionEl}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancel}
            onConfirm={this.bookEvent}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h2>Description:</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="add-event">
            <p>JUST CREATE EVENT PLEASE WE ARE WAITING 4 U</p>
            <button onClick={this.startCreateEvent}>Create</button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner /> //</Spinner>
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetail}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
