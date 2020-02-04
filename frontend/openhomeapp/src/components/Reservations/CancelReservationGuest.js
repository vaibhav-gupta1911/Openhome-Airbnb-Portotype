import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../NavBar/NavBar'
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../NavBarDark/NavBarDark';
import { Form, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import { ROOT_URL } from '../constants/constants';
import Moment from 'react-moment';
import swal from 'sweetalert2';

import CheckingIn from './CheckingIn'
import { Carousel } from 'react-bootstrap';
import { Redirect } from 'react-router';


var moment = require('moment');
var momentb = require('moment-business-days');

export default class CancelReservationGuest extends Component {
	constructor() {
		super();
		this.state = {
			data: [],
			imagesPreview: [],
			penalty: 0,
			weekendPrice: 0,
			weekdayPrice: 0,

		};

	}
	cancelReservation = async (booking) => {
		console.log("booking object..", booking)

		console.log("cancelReservation..")

		console.log("clicked property ", booking)



		axios.get(`${ROOT_URL}/systemdate`)
			.then((response) => {
				console.log("response", response)
				if (response.data) {

					//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

					console.log("date ", moment().format())
					var currentDate = moment(response.data);
					console.log("curr date ", currentDate)
					var startDate = moment(booking.startDate).format();
					console.log("weekend or week? ", moment(startDate).isoWeekday());
					var endDate = booking.endDate;

					console.log("startDate : ", startDate)
					console.log("enddate : ", endDate)

					var duration = moment.duration(currentDate.diff(startDate));
					var hours = duration.asHours();
					console.log("hours", hours)

					console.log("duration", duration)
					var hours = Math.abs(hours)
					console.log("absolute ", hours)

					// var formatCurrDate = 
					var dateToCompare = moment(startDate);
					var today = moment(response.data);
					console.log("compare by hours curr date and startdate :: ", today.diff(dateToCompare, 'hours'))
					console.log("startdate and enddate hours : ", moment(endDate).diff(dateToCompare, 'hours'))


					var hoursCurrentStart = today.diff(dateToCompare, 'hours')
					var hoursEndStart = moment(endDate).diff(dateToCompare, 'hours')
					var hoursCurrentEnd = moment(endDate).diff(today, 'hours')
					if (hoursCurrentStart <= -24) {
						console.log("No charges")
						this.setState({
							penalty: 0
						}, () => {
							this.asyncAxiosCall({ penalty: this.state.penalty, booking })
						})
						console.log("Penalty charged : ", this.state.penalty)

					}
					else if (hoursCurrentStart > -24 && hoursCurrentStart < 0) {
						var isWeekDayStartDate = momentb(startDate, 'YYYY-MM-DD').isBusinessDay();
						console.log("isWeekDayStartDate", isWeekDayStartDate)
						if (isWeekDayStartDate) {
							this.setState({
								penalty: (booking.weekdayPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})
							console.log("Penalty:::", this.state.penalty)
						}
						else {
							this.setState({
								penalty: (booking.weekendPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})
							console.log("Penalty:::", this.state.penalty)
						}

					}
					else if (hoursCurrentEnd >= 20) {

						if (moment(startDate).isoWeekday() == 6) {
							console.log("two days : penalty by weekend price")
							this.setState({
								penalty: (booking.weekendPrice + booking.weekendPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})

						}
						else if (moment(startDate).isoWeekday() == 7) {
							console.log(" 1: weekend penalty && 2: weekday penalty")
							this.setState({
								penalty: (booking.weekendPrice + booking.weekdayPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})
							console.log("here penalty ", this.state.penalty)
						}
						else {
							console.log(" two days: weekday penalty")
							this.setState({
								penalty: (booking.weekdayPrice + booking.weekdayPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})

						}
						console.log("penalty charged...... ", this.state.penalty)
					} else if( hoursCurrentEnd <20) {	
						if (moment(startDate).isoWeekday() == 6 || moment(startDate).isoWeekday() == 7) {
							console.log(" 1: weekend penalty ")
							this.setState({
								penalty: (booking.weekendPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})
							console.log("here penalty ", this.state.penalty)
						} else {
							console.log("weekday penalty")
							this.setState({
								penalty: (booking.weekdayPrice) * 0.30
							}, () => {
								this.asyncAxiosCall({ penalty: this.state.penalty, booking })
							})
						}
					}
					console.log("Penalty:::::", this.state.penalty)


					//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

					console.log(response.data);
					// console.log(moment(response.data));
					// console.log("CURRENT JAVASCRIPT TIME", moment());
				}
			})
			.catch(error => {
				console.log("=====errror", error)
			});

	}

	componentDidMount() {

		var userId = sessionStorage.getItem("userId")
		axios.get(`${ROOT_URL}/getAllReservations/${userId}`)
			.then((response) => {
				console.log("response", response)
				if (response.data) {

					if (response.data.propertyDetails) {
						this.setState({
							data: response.data.propertyDetails
						})
					}
				}
			}).catch(error => {
				console.log("error in fetching reservations", error)
			})
	}
	asyncAxiosCall = ({ penalty, booking }) => {
		const data = {
			penalty: penalty,
			status: "cancelled",
			guestId: booking.guestId,
			propertyId: booking.propertyId,
			bookingId: booking.id
		}
		console.log("!!!!!!!!!! data", data)
		axios.post(`${ROOT_URL}/cancelReservation/`, data)
			.then((response) => {
				console.log("response", response)
				if (response.status == 200) {
					swal.fire({
						title: "You have cancelled reservation successfully",
						text: "Cancellation",
						type: "success",
						buttons: ['OK']
					}).then(function (isConfirm) {
						if (isConfirm) {
							window.location.reload();
						} else {
							//if no clicked => do something else
						}
					})
					// this.state.penalty == 0 ? document.getElementById("error").innerHTML = "" :
					// 	document.getElementById("error").innerHTML = "Your reservation cancelled successfully and penalty of " + this.state.penalty + " has been charged..! \n Please refresh the page. ";

				}

			})
			.catch(error => {
				console.log("error in cancel reservation", error)
			})
	}
	renderRedirect = () => {
		if (!sessionStorage.getItem('userId')) {
			console.log("user not logged in")
			return <Redirect to='/home' />
		}
	}
	render() {
		let propertytList = [];


		propertytList = this.state.data.map(property => {
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
									<div id="below">Property Id: {property.id}</div>
									<div id="below">Address: {property.streetAddress}</div>
									<div id="below">City: {property.city}</div>
									<div id="below">Description: {property.description}</div>
								</div>
								<div className="displayRow">
									<div id="below">Checkin Date:  <Moment format="LLL">{property.bookingDetails.startDate}</Moment></div>
									<div id="below">Checkout Date:  <Moment format="LLL">{property.bookingDetails.endDate}</Moment></div>
									{/* <div className="belowTitleView"><strong>{property.price} $</strong> </div> */}
								</div>
								<div className="belowTitleView"><strong>Status: {property.bookingDetails.status}</strong></div>
								<div>
									<button class="btn btn-danger btn-sm" onClick={() => this.cancelReservation(property.bookingDetails)} style={{ fontWeight: "bolder" }} >Cancel Reservation</button>
								</div>
							</div>
						</div>
					</div>
				</div>

			);
		});

		if (this.state.data != null) {
			return (
				<div>
					<NavBarDark />
					{this.renderRedirect()}
					<div className="main-property-div" style={{ backgroundColor: '#f7f7f8' }}>
						{(propertytList.length == 0 || propertytList == null)
							? <div><p className="p-3">No Reservations yet!!</p></div>
							: propertytList}

					</div>
				</div>
			)

		}

	}
}