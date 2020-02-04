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

export default class HistoryHost extends Component {
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

	


	componentDidMount() {

		var userId = sessionStorage.getItem("userId")
		axios.get(`${ROOT_URL}/getHistoryOfHostBookings/${userId}`)
			.then((response) => {
                console.log("response", response)
                console.log("response", response.data)

                if(response.data){
                    if (response.data.propertyDetails) {
                        this.setState({
                            data: response.data.propertyDetails
                        })
                    }
                }else{
                    console.log("no data")
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
				title: 'Checkout Date',
				dataIndex: 'checkoutDate',
				key: 'checkoutDate',
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
			}

		]

		if (this.state.data.length > 0) {
			propertytList = this.state.data.map(property => {
				console.log("````````````property``````", property);
				var presentbookingdata = [];
				var x;
				var futurebookingdata = [];
				var y;
                var pastbookingdata = [];
				var z;
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
												checkoutDate: new Date(booking.checkedOutDate).toString(),
												price: booking.price,
												status: booking.status,
												parkingfee: property.dailyParkingFee,
												weekdayprice: property.weekdayPrice,
												weekendprice: property.weekendPrice,
												propertyId: property.id
											};

											
												presentbookingdata.push(x);
											

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
												checkoutDate: new Date(booking.checkedOutDate).toString(),
												price: booking.price,
												status: booking.status,
												parkingfee: property.dailyParkingFee,
												weekdayprice: property.weekdayPrice,
												weekendprice: property.weekendPrice,
												propertyId: property.id
											};

											
												futurebookingdata.push(y);
											

										})
									}

									<div>
										<Tag color="#87d068">FUTURE BOOKING</Tag>
										<Table columns={columns} dataSource={futurebookingdata} onChange={this.handleChange} />
									</div>

                                    {
										property.pastBookingDetails.map((booking, i) => {
											z = {
												id: booking.id,
												startDate: new Date(booking.startDate).toString(),
												checkoutDate: new Date(booking.checkedOutDate).toString(),
												price: booking.price,
												status: booking.status,
												parkingfee: property.dailyParkingFee,
												weekdayprice: property.weekdayPrice,
												weekendprice: property.weekendPrice,
												propertyId: property.id
											};

											
												pastbookingdata.push(z);
											

										})
									}

									<div>
										<Tag color="#87d068">PAST BOOKING</Tag>
										<Table columns={columns} dataSource={pastbookingdata} onChange={this.handleChange} />
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
						<h3>History of Reservations</h3>
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