import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../../NavBar/NavBar'
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../../NavBarDark/NavBarDark';
import { Form, Table, Tag, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import { ROOT_URL } from '../../constants/constants';
import Moment from 'react-moment';
import { Carousel } from 'react-bootstrap';
import swal from 'sweetalert2';
import { Redirect } from 'react-router';

var moment = require('moment');

export default class CancelReservationHost extends Component {
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

		axios.get(`${ROOT_URL}/systemdate`)
			.then((response) => {
				console.log("response", response)
				if (response.data) {

					//aaaaaaaaaaaaaaaaaaaaaaaaa

					var price = booking.price;
					var status = booking.status;
					var parkingfee = booking.parkingfee;
					var penalty = 0;
					var refund = 0;
					var weekdayprice = booking.weekdayprice;
					var weekendprice = booking.weekendprice;

					var currentDate = moment(response.data);
					var startDate = moment(booking.startDate).format();
					var endDate = moment(booking.endDate).format();
					var duration = moment.duration(currentDate.diff(startDate));
					var hours = Math.abs(hours)

					var cancelstartday;
					var cancelendday = moment(booking.endDate);
					var cancelendday2 = moment(booking.endDate);
					var today1100 = moment(currentDate);
					today1100 = today1100.hour(11)
					today1100 = today1100.minute(0)
					today1100 = today1100.second(0)

					console.log("BOOKING ..............", booking);
					console.log("curr date ", currentDate.toString())
					console.log("weekend or week? ", moment(startDate).isoWeekday());
					console.log("startDate : ", startDate)
					console.log("enddate : ", endDate)
					console.log("absolute ", hours)

					// var formatCurrDate = 
					var dateToCompare = moment(startDate);
					var today = moment(response.data);
					var isSame = dateToCompare.startOf('day').isSame(today.startOf('day'));
					var checkoutDate = moment(today1100)
					
					if (currentDate.hours() >= 11) {	
						checkoutDate = checkoutDate.add(1, 'days')
					} 
					console.log("Checked Out Date::::::::::", checkoutDate.toString())
					// else {
					// 	checkoutDate = moment('3:00', 'HH:mm')
					// 	console.log("Checked Out Date::::::::::", checkoutDate)
					// }
					console.log("isSame? ", isSame)
					//var isTimeAfterCheckInTime = now.isSameOrAfter(today1730)
					console.log("now.isSameOrAfter(today1100) ", currentDate.isSameOrAfter(today1100))
					console.log("DURATIONS DAYSSSSSSSSSSSSSSSSS", duration._data.days);
					console.log("STATUSSSSSSSSSSSSSS", moment.duration(dateToCompare.diff(currentDate)).asHours());
					console.log("STATUSSSSSSSSSSSSSS", status);

					if ((duration._data.days) > -7 && !(status === "checkedin" || status ==="paid")) {
						penalty = price * .15;
					}
					else if (status === "checkedin" || status === "paid" ) {
						console.log("REFUND CALCULATIONS1");

						// if (currentDate.isSameOrAfter(today1100)) {
						// 	cancelstartday = today1100.add(1, 'days');
						// 	console.log("cancelstartday", cancelstartday.toString());
						// } else {
						// 	cancelstartday = today1100;
						// 	console.log("cancelstartday", cancelstartday.toString());
						// }
						cancelstartday = moment(checkoutDate)
						console.log("cancelstartday", cancelstartday.toString())

						var cstrt = moment(cancelstartday);
						
						var count = 0;
						console.log("REFUND CALCULATIONS1");
						console.log("cancelendday", cancelendday.toString());
						console.log("cstrt", cstrt.toString());
						console.log("REFUND CALCULATIONS1");
						while (moment.duration(cancelendday.diff(cstrt)).asHours() >= 24 && count<7) {

							console.log("REFUND CALCULATIONS");
							if (moment(cstrt).isoWeekday() == 6 || moment(cstrt).isoWeekday() == 7 ) {
								refund += weekendprice + parkingfee;
								if (count < 6) {
									penalty += (weekendprice + parkingfee) * .15;
								}
							} else {
								refund += weekdayprice + parkingfee;
								if (count < 6) {
									penalty += (weekdayprice + parkingfee) * .15;
								}
							}

							cstrt.add(1, 'day');
							count++;
						}

					}


					var data = {
						penalty: penalty,
						refund: refund + penalty,
						status: "cancelled",
						guestId: booking.guestId,
						propertyId: booking.propertyId,
						bookingId: booking.id,
						checkOutDate: checkoutDate.add(-8, 'hours'),
						owner: sessionStorage.getItem("userId")
					}

					console.log("data.............", data)
					axios.post(`${ROOT_URL}/cancelReservationByHost/`, data)
						.then((response) => {
							console.log("response", response)
							if (response.status == 200) {

								console.log("Booking Canceled Succesfully!!")
								swal.fire({
									title: "Booking Canceled Succesfully",
									text: "Refund amount charged is : \n\n" +
										data.refund,
									buttons: ['OK']
								}).then(function (isConfirm) {
									if (isConfirm) {
										window.location.reload();
									}
								})
							}

						})
						.catch(error => {
							console.log("=====errror", error)
						})




					//aaaaaaaaaaaaaaaaaaaaaaaaa


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
		axios.get(`${ROOT_URL}/getAllHostBookings/${userId}`)
			.then((response) => {
				console.log("response", response)
				if (response.data.propertyDetails) {
					this.setState({
						data: response.data.propertyDetails
					})
				}

			})
			.catch(error => {
				console.log("=====errror", error)
			})
	}
	renderRedirect = () => {
		if (!sessionStorage.getItem('userId')) {
			console.log("user not logged in")
			return <Redirect to='/home' />
		}
	}
	render() {
		let propertytList;

		const columns = [
			{
				title: 'Id',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: 'StartDate',
				dataIndex: 'startDate',
				key: 'startDate',
			},
			{
				title: 'EndDate',
				dataIndex: 'endDate',
				key: 'endDate',
			},
			{
				title: 'ParkingFee/Day',
				dataIndex: 'parkingfee',
				key: 'parkingfee',
			},
			{
				title: 'Price',
				dataIndex: 'price',
				key: 'price',
			},
			{
				title: 'Status',
				dataIndex: 'status',
				key: 'status',
			},
			{
				title: 'WeekdayPrice',
				dataIndex: 'weekdayprice',
				key: 'weekdayprice',
			},
			{
				title: 'WeekendPrice',
				dataIndex: 'weekendprice',
				key: 'weekendprice',
			},
			{
				title: 'Action',
				key: 'action',
				render: (booking) => (
					<button class="btn btn-danger btn-sm" onClick={() => this.cancelReservation(booking)} style={{ fontWeight: "bolder" }} >Cancel Reservation</button>
				)
			}

		]

		if (this.state.data.length > 0) {
			propertytList = this.state.data.map(property => {
				console.log("````````````property``````", property);
				var presentbookingdata = [];
				var x;
				var futurebookingdata = [];
				var y;

				return (
					<div>

						<div className="container-fluid" style={{
							borderRadius: "5px",
							marginBottom: "20px",
							// width: "90%",
							backgroundColor: "white",
							boxShadow: "0px 1px 3px rgba(0,0,0,.1)"
						}}>
							<div className="row p-2">
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
									<div> <h3>{property.description}</h3></div>
									<div>
										<h2>Property Id: {property.id}</h2>
									</div>

									{
										property.presentBookingDetails.map((booking, i) => {
											x = {
												id: booking.id,
												startDate: new Date(booking.startDate).toString(),
												endDate: new Date(booking.endDate).toString(),
												price: booking.price,
												status: booking.status,
												parkingfee: property.dailyParkingFee,
												weekdayprice: property.weekdayPrice,
												weekendprice: property.weekendPrice,
												propertyId: property.id
											};

											if (x.status != "cancelled") {
												presentbookingdata.push(x);
											}

										})
									}

									<div>
										<Tag color="#2db7f5">CURRENT BOOKINS</Tag>
										<Table columns={columns} dataSource={presentbookingdata} onChange={this.handleChange} />
									</div>

									{
										property.futureBookingDetails.map((booking, i) => {
											y = {
												id: booking.id,
												startDate: new Date(booking.startDate).toString(),
												endDate: new Date(booking.endDate).toString(),
												price: booking.price,
												status: booking.status,
												parkingfee: property.dailyParkingFee,
												weekdayprice: property.weekdayPrice,
												weekendprice: property.weekendPrice,
												propertyId: property.id
											};

											if (y.status != "cancelled") {
												futurebookingdata.push(y);
											}

										})
									}

									<div>
										<Tag color="#87d068">FUTURE BOOKING</Tag>
										<Table columns={columns} dataSource={futurebookingdata} onChange={this.handleChange} />
									</div>
								</div>
							</div>
						</div>
					</div>

				);
			});
		} else {
			propertytList = (<div>
				No property posted by this user yet !!
			</div>)
		}



		if (this.state.data != null) {
			return (
				<div>
					<NavBarDark />
					{this.renderRedirect()}

					<div className="main-property-div p-3" style={{ backgroundColor: '#f7f7f8' }}>
						<h3>Cancel Reservation</h3>
						{sessionStorage.getItem('isVerified') == "false"
							? <div>
								<p> Please verify your account! </p>
							</div>
							:
							<div>
								{propertytList}

							</div>}
					</div>
				</div >
			)

		}

	}
}