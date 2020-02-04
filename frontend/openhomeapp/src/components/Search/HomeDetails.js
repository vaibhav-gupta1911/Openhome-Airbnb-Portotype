import React, { Component } from 'react'
import axios from 'axios';
import swal from 'sweetalert2';
import NavBarDark from '../NavBarDark/NavBarDark';
import { Carousel } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { ROOT_URL } from '../constants/constants';

var moment = require('moment');
var momentb = require('moment-business-days');

// i have to validation of not being able to book if the user is not verified.

class HomeDetails extends Component {
	constructor(props) {
		super(props)
		this.state = {
			property: this.props.location.state.property,
			totalPrice: 0,
			weekends: 0,
			weekday: 0,
			parking: 0,
		};
		this.bookingProperty = this.bookingProperty.bind(this);
	}


	parkingPriceHandler = (e) => {
		console.log("target value :", e.target.checked)
		console.log(this.state.property.dailyParkingFee)
		if (e.target.checked) {
			this.setState({
				parking: this.state.property.dailyParkingFee,
				totalPrice: this.state.totalPrice + (this.state.weekday + this.state.weekends) * this.state.property.dailyParkingFee
			})
		}
		else {
			this.setState({
				parking: this.state.property.dailyParkingFee,
				totalPrice: this.state.totalPrice - (this.state.weekday + this.state.weekends) * this.state.property.dailyParkingFee
			})
		}


	}


	componentDidMount() {
		console.log("Property Details .... ", this.state.property)
		var startDate = sessionStorage.getItem("startDate")
		var endDate = sessionStorage.getItem("endDate")
		console.log(" startdate from session", startDate)
		console.log(" enddate from session", endDate)

		var weekends = 0
		var days = 0;
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const firstDate = Date.parse(startDate);
		const secondDate = Date.parse(endDate);
		const diff = Math.round(Math.abs((firstDate - secondDate) / oneDay));
		console.log("diff ", diff)
		for (let i = 0; i < diff; i++) {
			var isbussday = momentb(startDate, 'YYYY-MM-DD').isBusinessDay();
			if (isbussday) {
				days++;
			}
			else {
				weekends++;
			}
			console.log("is this a buss day ", isbussday, "date ", startDate)
			startDate = momentb(startDate).add(1, 'days').format("YYYY-MM-DD")
		}

		console.log("Number of weekday : ", days)
		console.log("Number of weekends :", weekends)
		this.setState({
			weekday: days,
			weekends: weekends,
			totalPrice: days * this.state.property.weekdayPrice + weekends * this.state.property.weekendPrice
		}, () => {
			console.log("weekday from state ", this.state.weekday)

			console.log("weekend from state ", this.state.weekends)

			console.log("parking from state ", this.state.parking)

		})

	}

	bookingProperty(e) {
		// if(this.props.authFlag){
		e.preventDefault();
		if (sessionStorage.getItem('isVerified') == "true") {
			console.log("==== user is verified to book the property")
			const data = {
				property_id: this.state.property.id,
				guest_id: sessionStorage.getItem('userId'),
				start_date: sessionStorage.getItem('startDate'),
				end_date: sessionStorage.getItem('endDate'),
				status: "reserved",
				price: this.state.totalPrice,
				checkedOutDate: sessionStorage.getItem('endDate'),
				weekdayPrice: this.state.property.weekdayPrice,
				weekendPrice: this.state.property.weekendPrice,
				parkingFee: this.state.parking
			}
			console.log("pass data", data)
			axios.post(`${ROOT_URL}/bookProperty`, data)
				.then((response) => {
					console.log("response", response);
					if (!response.data) {
						swal.fire("Already Reserved!", "Go to HomePage", "error");
					}
					if (response.data) {
						swal.fire("Reservation done!", "Successffully", "success");
						// redirect the page to booking details page
					}
				})
				.catch(error => {
					console.log(" error in booking the property", error);
				})
		} else {
			console.log("==== user is not verified to book the property")
			console.log("show alert")
			alert("Please verify your account!!");
		}


	}
	renderRedirect = () => {
		if (!sessionStorage.getItem('userId')) {
			console.log("user not logged in")
			alert("Please Login/Verify")
			return <Redirect to='/home' />
		}
	}

	render() {
		var imageList = null
		console.log("`````this.state.property.pictureUrl", this.state.property.pictureUrl)
		console.log("``````this.state.property.roomSquareFootage", this.state.property.privateShower)
		if (this.state.property) {
			if (this.state.property.pictureUrl) {
				imageList = (
					<div style={{ width: 550 }}>
						<Carousel controls={false}>
							{this.state.property.pictureUrl.map((picture, i) => {
								console.log("======picture url ====````````````", picture)
								return (
									<Carousel.Item key={i}>
										<a className="thumbnail" href="javascript:void(0)">
											<img
												src={picture}
												alt="First slide"
												height="500px"
												width="550px"
											/>
										</a>
									</Carousel.Item>
								)
							})}
						</Carousel>
					</div>
				)
			} else {
				imageList = (
					<div>
						<div className="col-md nameview my-5 ml-3">
							<div className="displayRow">
								no pictures available for this property!
									</div>
						</div>
					</div>
				)
			}
		}

		return (
			<div>

				<NavBarDark />
				{this.renderRedirect()}

				<div class="container-fluid" style={{ backgroundColor: '#f7f7f8' }}>
					<div className="row ml-3 mt-3 p-3">
						<div className="col-sm">
							{/* One of three columns */}
							<div>
								{imageList}
							</div>
						</div>
						<div className="col-sm">
							{/* One of three columns */}
							<div>
								<div>
									<div>
										<strong>
											<p>Property Details</p>
										</strong>
									</div>
									<div>
										<strong>
											<p>
												Property # :
											{this.state.property.id}
											</p>
										</strong>
									</div>
									<div>
										<p>
											<strong>
												State :
												{this.state.property.state}
											</strong>
										</p>
									</div>
								</div>

								<div>
									<p>
										<strong>
											ZipCode :
											{this.state.property.zipcode}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											City :
											{this.state.property.city}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Description:
										{this.state.property.description}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Property Type:
											{this.state.property.propertyType}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Sharing Type:
											{this.state.property.sharingType}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Daily parking Fee:
											{this.state.property.dailyParkingFee}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Internet availablility:
											{this.state.property.internet}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Private Bathroom:
											{this.state.property.privateBathroom}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											Private Shower:
											{this.state.property.privateShower}
										</strong>
									</p>
								</div>
								<div>
									<p>
										<strong>
											RoomSquare Footage:
											{this.state.property.roomSquareFootage}
										</strong>
									</p>
								</div>

								<div>
									<p>
										<strong>
											Bedrooms :
											{this.state.property.totalBedroom}
										</strong>
									</p>
								</div>
							</div>

						</div>
						<hr style={{ width: "1px", height: "auto", display: "inline-block", backgroundColor: "#9c9c94" }}></hr>
						<div className="col-sm">
							{/* One of three columns */}
							{/* <form className=""> */}
							{/* <div className="col-md-3 " > */}
							<div>
								<p>
									<strong >
										Weekday Price: $&nbsp;
								 		{this.state.property.weekdayPrice}
									</strong>
									<span style={{ fontSize: "12px" }}> per night</span>
								</p>
							</div>
							<div>
								<p>
									<strong>
										Weekend Price: $&nbsp;{this.state.property.weekendPrice}
									</strong>
									<span style={{ fontSize: "12px" }}>	per night</span>
								</p>
							</div>
							<div>
								<p>
									<strong>
										Check In:
								</strong>
									<div >
										<input type="date" name="checkin" value={sessionStorage.getItem("startDate")} disabled></input>
									</div>
								</p>
							</div>
							<div>
								<p>
									<strong>
										Check Out
									</strong>
									<div>
										<input type="date" name="checkout" value={sessionStorage.getItem("endDate")} disabled></input>
									</div>
								</p>
							</div>
							<div>
								<input type="checkbox" name="parking" onChange={this.parkingPriceHandler} /> Check here if you need parking /* daily parking fee is applicable */<br />
							</div>
							<div>
								<div>
									<strong style={{ fontSize: "17px" }}>
										Total Cost:
								{this.state.totalPrice}
									</strong>
								</div>
								<div className="mt-3">
									<button type="submit" className="btn btn-danger" onClick={this.bookingProperty}> Reserve </button>
								</div>
								<div>
									<p>You won’t be charged yet.</p>
								</div>
								<div>
									<p>
										You'll be charged at the time of check-in.
								</p>
								</div>
							</div>
							{/* </form> */}
						</div>
					</div>
					<div className="row d-flex justify-content-center">
						{/* <div>
							<div>
								<strong style={{ fontSize: "17px" }}>
									Total Cost:
								{this.state.totalPrice}
								</strong>
							</div>
							<div className="mt-3">
								<button type="submit" className="btn btn-danger" onClick={this.bookingProperty}> Reserve </button>
							</div>
							<div>
								<p>You won’t be charged yet.</p>
							</div>
							<div>
								<p>
									You'll be charged at the time of check-in.
								</p>
							</div>
						</div> */}
					</div>
				</div>
			</div >
		);

	}
}




export default (HomeDetails);