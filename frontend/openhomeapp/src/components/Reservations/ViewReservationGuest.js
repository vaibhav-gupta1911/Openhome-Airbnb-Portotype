import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../NavBar/NavBar'
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../NavBarDark/NavBarDark';
import { Form, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon, Rate } from 'antd';
import { Empty } from 'antd'
import { ROOT_URL } from '../constants/constants';
import { Carousel } from 'react-bootstrap';
import CheckingIn from './CheckingIn'
import CheckedOut from './CheckedOut';
import PaymentTxn from '../Payment/PaymentTxn';
import { Redirect } from 'react-router';
import swal from 'sweetalert2';

const { Option } = Select;
const { TextArea } = Input;

class ViewReservationGuest extends Component {

	state = {
		"propertyData": [],
		"pastReservations": [],
		"presentReservations": [],
		"futureReservations": [],
		"rating": 0,
		"review": "",
	}

	ratingHandler = (bookingId, e) => {
		console.log("rating", e)
		console.log("clicked property", bookingId)
		this.setState({
			rating: e
		})
		const data = {
			rating: e
		}
		axios.put(`${ROOT_URL}/updatePropertyRating/${bookingId}`, data)
			.then((response) => {
				console.log("response", response)
			})
	}
	reviewHandler = (e) => {
		console.log("this target", e.target.value)
		this.setState({
			review: e.target.value
		})
	}

	submitReview = (bookingId) => {
		console.log("clicked property", bookingId)

		const data = {
			review: this.state.review
		}
		axios.put(`${ROOT_URL}/updatePropertyReviewByGuest/${bookingId}`, data)
			.then((response) => {
				console.log("response", response)
				if (response.status == 200) {
					swal.fire("Review submitted", "success", "success")
				}
			})


	}

	componentDidMount() {
		// axios call here
		let guestUserId = sessionStorage.getItem('userId');
		console.log("`````````````````````````s", guestUserId)
		axios.get(`${ROOT_URL}/getAllGuestReservations2/` + guestUserId)
			.then((response) => {
				console.log("====== response", response);
				if (response.data) {
					this.setState({
						propertyData: this.state.propertyData.concat(response.data),
					});
					if (response.data.propertyDetails) {
						if (response.data.propertyDetails.pastReservationDetails) {
							this.setState({
								pastReservations: this.state.pastReservations.concat(response.data.propertyDetails.pastReservationDetails)
							});
							console.log("=========this.state.pastReservations", response.data.propertyDetails.pastReservationDetails);

						}
						if (response.data.propertyDetails.presentReservationsDetails) {
							this.setState({
								presentReservations: this.state.presentReservations.concat(response.data.propertyDetails.presentReservationsDetails)
							});
							console.log("=========this.state.presentReservations", response.data.propertyDetails.presentReservationsDetails);
						}
						if (response.data.propertyDetails.futureReservationDetails) {
							this.setState({
								futureReservations: this.state.futureReservations.concat(response.data.propertyDetails.futureReservationDetails)
							});
							console.log("=========this.state.futureReservations", response.data.propertyDetails.futureReservationDetails);

						}

					} else {
						// this means it has thrown an error
					}
				}
			})
			.catch(error => {
				console.log("====error in fetching the guest reservations", error);
			})

	}
	// componentWillMount() {
	// 	//check api at db for each refresh if date has changed

	// 	const dataToSend = {
	// 		//this will have time from navbar to here
	// 		userId: sessionStorage.getItem("userId")
	// 	}

	// 	axios.post(`${ROOT_URL}/updateNoShowWithTimeAdvancement`, dataToSend)
	// 		.then((response) => {
	// 			console.log(" updateNoShowWithTimeAdvancement response", response)
	// 		})
	// 		.catch(error => {
	// 			console.log("error in update with update with no show", error)
	// 		})
	// }

	renderRedirect = () => {
		if (!sessionStorage.getItem('userId')) {
			console.log("user not logged in")
			return <Redirect to='/home' />
		}
	}
	render() {

		let futureReservationsList = null;
		let pastReservationsList = null;
		let presentReservationsList = null;
		futureReservationsList = this.state.futureReservations.map(property => {
			console.log("===== property=========````````````````", property);
			return (
				<div>
					{/* <div className="shadow p-3 mb-5 bg-white rounded"> */}

					<div className="container-fluid" style={{
						borderRadius: "5px",
						marginBottom: "20px",
						width: "90%",
						backgroundColor: "white",
						boxShadow: "0px 1px 3px rgba(0,0,0,.1)"
					}}>

						<div className="row">
							{property.pictureUrl ?
								<div style={{ width: 255 }}>
									<Carousel controls={false}>
										{property.pictureUrl.map((picture, i) => {
											console.log("======picture url ====````````````", picture)
											return (

												<Carousel.Item key={i}>
													<a className="thumbnail" href="javascript:void(0)">
														<img
															src={picture}
															alt="First slide"
															height="200px"
															width="250px"
														/>
													</a>
												</Carousel.Item>
											)
										})}

									</Carousel>
								</div>
								:
								<div>
									<div className="col-md nameview my-5 ml-3">
										<div className="displayRow">
											no pictures available for this property!
									</div>
									</div>
								</div>
							}

							<div className="col-md nameview my-5 ml-3">
								<div className="displayRow">
									<div id="below">Booking #{property.bookingDetails.id}</div>
									<div id="below">{property.id}</div>
									<div id="below">{property.streetAddress}</div>
									<div id="below">{property.city}</div>
								</div>

								<div className="priceview">
									<span>{property.weekdayPrice}</span> Per night
                </div>
								<div>
									{/* <p>Start Date :{property}</p> */}
									{/* {property.bookingDetails.map(booking => {
										return (
										<div>
											<p>Start Date :{booking.startDate}</p>
										</div>
										)}	
								}
							} */}
									{/* Date:	{new Date(property.bookingDetails.startDate).toDateString()} */}
									{/* {property.bookingDetails.map(booking => {
										return (
											<div>
												<p>Start Date :{booking.startDate}</p>
											</div>
										)
									}
									)}

									{/* {property.bookingDetails.startDate} */}
									{/* start date : {startDate} */}
									<div>
										Start Date:{new Date(property.bookingDetails.startDate).toDateString()}
									</div>
									<div>
										End Date:{new Date(property.bookingDetails.endDate).toDateString()}
									</div>
									<div>
										Status:{property.bookingDetails.status}

									</div>
								</div>
								<div className="float-right float-below ml-3">
									{/* <CheckingIn sendPropertyAsProps= {property}> </CheckingIn> */}
								</div>
								{/* <div className="float-right float-below ">
									button check out
								</div> */}
							</div>
						</div>
					</div>
					<div>
					</div>
				</div>
			)
		})

		pastReservationsList = this.state.pastReservations.map(property => {
			return (
				<div>
					<div className="container-fluid" style={{
						borderRadius: "5px",
						marginBottom: "20px",
						width: "90%",
						backgroundColor: "white",
						boxShadow: "0px 1px 3px rgba(0,0,0,.1)"
					}}>

						<div className="row">
							{property.pictureUrl ?
								<div style={{ width: 255 }}>
									<Carousel controls={false}>
										{property.pictureUrl.map((picture, i) => {
											console.log("======picture url ====````````````", picture)
											return (
												<Carousel.Item key={i}>
													<a className="thumbnail" href="javascript:void(0)">
														<img
															src={picture}
															alt="First slide"
															height="200px"
															width="250px"
														/>
													</a>
												</Carousel.Item>
											)
										})}

									</Carousel>
								</div>
								:
								<div>
									<div className="col-md nameview my-5 ml-3">
										<div className="displayRow">
											no pictures available for this property!
									</div>
									</div>
								</div>
							}

							<div className="col-md nameview my-5 ml-3">
								<div className="displayRow">
									<div id="below">Booking #{property.bookingDetails.id}</div>
									<div id="below">{property.streetAddress}</div>
									<div id="below">{property.city}</div>
								</div>

								<div className="priceview">
									<span>{property.weekdayPrice}</span> Per night
                </div>
								<div>
									<div>
										Start Date:{new Date(property.bookingDetails.startDate).toDateString()}
									</div>
									<div>
										End Date:{new Date(property.bookingDetails.endDate).toDateString()}

									</div>
									<div className="float-right float-below ml-3">
										Rate Property
									<Rate onChange={(e) => this.ratingHandler(property.bookingDetails.id, e)} defaultValue={property.bookingDetails.rating} />
										<div><TextArea rows={4} placeholder="write review" onChange={this.reviewHandler} defaultValue={property.bookingDetails.review} /></div>

										<div className="float-left float-below ml-3">
											<button class="btn btn-success btn-sm" style={{ fontWeight: "bolder" }} onClick={() => this.submitReview(property.bookingDetails.id)} >Review</button>

										</div>
									</div>
									<div>
										Status:{property.bookingDetails.status}

									</div>
								</div>
								{/* <div className="float-right float-below ml-3">
									button check in
								</div>
								<div className="float-right float-below ">
									button check out
								</div> */}
							</div>

						</div>
					</div>
				</div>
			)
		})

		presentReservationsList = this.state.presentReservations.map(property => {
			console.log("===== in present reservation")
			let buttons = null;
			if (property.bookingDetails.status == "reserved") {
				buttons = (<div>
					<div className="float-right float-below ml-3">
						<CheckingIn sendPropertyAsProps={property}> </CheckingIn>
					</div>
				</div>)
			}
			if (property.bookingDetails.status == "checkedin" || property.bookingDetails.status == "noshow") {
				buttons = (<div>
					<div className="float-right float-below ml-3">
						<PaymentTxn amt={property.bookingDetails.price + property.bookingDetails.noShowPenalty}
							propertyid={property.bookingDetails.propertyId}
							bookingid={property.bookingDetails.id}
						></PaymentTxn> </div>
				</div>)
			}
			if (property.bookingDetails.status == "paid") {
				buttons = (<div><div className="float-right float-below ">
					<CheckedOut sendPropertyAsProps={property}> </CheckedOut>
				</div></div>)
			}

			return (
				<div>
					<div className="container-fluid" style={{
						borderRadius: "5px",
						marginBottom: "20px",
						width: "90%",
						backgroundColor: "white",
						boxShadow: "0px 1px 3px rgba(0,0,0,.1)"
					}}>

						<div className="row">
							{property.pictureUrl ?
								<div style={{ width: 255 }}>
									<Carousel controls={false}>
										{property.pictureUrl.map((picture, i) => {
											console.log("======picture url ====````````````", picture)
											return (
												<Carousel.Item key={i}>
													<a className="thumbnail" href="javascript:void(0)">
														<img
															src={picture}
															alt="First slide"
															height="200px"
															width="250px"
														/>
													</a>
												</Carousel.Item>
											)
										})}
									</Carousel>
								</div>
								:
								<div>
									<div className="col-md nameview my-5 ml-3">
										<div className="displayRow">
											no pictures available for this property!
									</div>
									</div>
								</div>
							}

							<div className="col-md nameview my-5 ml-3">
								<div className="displayRow">
									<div id="below">Booking #{property.bookingDetails.id}</div>
									<div id="below">Property #{property.id}</div>
									<div id="below">{property.streetAddress}</div>
									<div id="below">{property.city}</div>
								</div>

								<div className="priceview">
									<span>{property.weekdayPrice}</span> Per night
                </div>
								<div>
									<div>
										Start Date:{new Date(property.bookingDetails.startDate).toDateString()}
									</div>
									<div>
										End Date:{new Date(property.bookingDetails.endDate).toDateString()}

									</div>
									<div>
										Status:{property.bookingDetails.status}

									</div>
								</div>
								{/* <div className="float-right float-below ml-3">
									<CheckingIn sendPropertyAsProps={property}> </CheckingIn>
								</div>
								<div className="float-right float-below ">
									<CheckedOut sendPropertyAsProps={property}> </CheckedOut>
								</div> */}
								{buttons}
								<div>
									No Show Penalty:{property.bookingDetails.noShowPenalty}
								</div>
								<div>
									Price:{property.bookingDetails.price}
								</div>
								{/* <div>
									<PaymentTxn amt={property.bookingDetails.price + property.bookingDetails.noShowPenalty}></PaymentTxn>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			)
		})

		return (
			<div>
				<NavBarDark />
				{this.renderRedirect()}
				<h3 className="m-5"> View Reservations</h3>
				<div>
					<div className="main-property-div " style={{ backgroundColor: '#f7f7f8' }}>
						<div className="ml-3">
							<h4>Present Reservations</h4>
							{(this.state.presentReservations.length == 0 || this.state.presentReservations.length == null) ? <div><p>No Current Reservations</p></div> : presentReservationsList}
						</div>

					</div>
					<div className="main-property-div" style={{ backgroundColor: '#f7f7f8' }}>
						<div className="ml-3">
							<h4>Future Reservations</h4>
							{(this.state.futureReservations.length == 0 || this.state.futureReservations.length == null) ? <div><p>No Future Reservations</p></div> : futureReservationsList}
						</div>
					</div>
					<div className="main-property-div" style={{ backgroundColor: '#f7f7f8' }}>
						<div className="ml-3">
							<h4>Past Reservations</h4>
							{(this.state.pastReservations.length == 0 || this.state.pastReservations.length == null) ? <div><p>No Past Reservations</p></div> : pastReservationsList}
						</div>
					</div>
				</div>
			</div>
		)

	}
}
export default ViewReservationGuest;
