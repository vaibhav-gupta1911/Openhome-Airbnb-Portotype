import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { ROOT_URL } from '../constants/constants';

import { Form, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import 'antd/dist/antd.css';
import {

	Row, Col
} from 'react-bootstrap';
import NavBar from '../NavBar/NavBar'
import NavBarDark from '../NavBarDark/NavBarDark';
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: sessionStorage.getItem("username"),
			authFlag: false,
			sharingType: "entire",
			propertyType: [],
			visible: false,
			minPrice: "",
			maxPrice: "",
			internet: true,
			keywords: "",
			activeSearch: true,
			dateErr: "",
			dateErrFlag: true,
			currentDate:""
		}
		this.handleLogout = this.handleLogout.bind(this);
		this.handlePropertyChange = this.handlePropertyChange.bind(this);

	}
	//handle logout to destroy the cookie
	handleLogout = () => {
		// cookie.remove('cookie', { path: '/' });
		sessionStorage.clear();
	}


	handlePropertyChange = e => {
		console.log(e);
		this.state.propertyType = []
		if (e) {
			this.setState({
				propertyType: [...this.state.propertyType, e],
			});
		} else {
			let remove = this.state.propertyType.indexOf(e);
			this.setState({
				propertyType: this.state.propertyType.filter((_, i) => i !== remove)
			},
				() => {
					console.log('fruits', this.state.propertyType);
				}
			);
		}
		console.log(this.state.propertyType);
	};

	componentDidMount(){
		axios.get(`${ROOT_URL}/systemdate`)
		.then((response) => {
			console.log("response", response)
			if (response.data) {

				this.setState({
					currentDate: new Date(response.data)
				})
				console.log(response.data);
				// console.log(moment(response.data));
				// console.log("CURRENT JAVASCRIPT TIME", moment());
			}
		})
		.catch(error => {
			console.log("=====errror", error)
		});
	}
	dateChangeHandler = e => {
		console.log(e);
		console.log("first date is start date", e[0].format('YYYY-MM-DD'));
		console.log("first date is start date", e[1].format('YYYY-MM-DD'));
		let startDate = new Date(e[0]._d);
		startDate.setHours(0, 0, 0, 0)
		// let currentDate1 = new Date();
		let currentDate1 =this.state.currentDate;
		currentDate1.setHours(0, 0, 0, 0)
		console.log("!!!!!!!!!!!!!!!",currentDate1)

		if (e && (startDate < currentDate1)) {
			console.log("new Date(e[0]._d)", new Date(e[0]._d))
			console.log("new Date", new Date())
			console.log("Invalid Date")
			this.setState({
				dateErr: "Date is required and start date cannot be before today's date.",
				dateErrFlag: true,
				activeSearch: true

			})
			document.getElementById("try-error").innerHTML = "Past dates are not valid!";

		} else {
			console.log("===== date is changed =====");
			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
			const firstDate = Date.parse(e[0].format('YYYY-MM-DD'));
			const secondDate = Date.parse(e[1].format('YYYY-MM-DD'));
			let currentDate1 = new Date();
			currentDate1.setHours(0, 0, 0, 0)
			const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

			const yearCheck = Math.round(Math.abs((firstDate - currentDate1) / oneDay))
			console.log("===== diffDays=====", diffDays + 1);
			console.log("===== yearCheck ==== ", yearCheck);
			if ((diffDays + 1) > 14 || yearCheck > 365) {
				if (diffDays + 1 > 14) {

					document.getElementById("try-error").innerHTML = "Please select dates within range of 14 days";
				} else {
					document.getElementById("try-error").innerHTML = "Please select dates within range of a year from today's date";

				}
				this.setState({
					activeSearch: true
				});
			} else {
				document.getElementById("try-error").innerHTML = "";
				this.setState({
					activeSearch: false
				});
				console.log("\n - - - - - - - - - Start date : " + e[0]._d)
				console.log("Type of start date : " + typeof (e[0]._d))
				console.log("\n - - - - - - - - - End date : " + e[1]._d)
				this.setState({
					dateErr: "",
					dateErrFlag: false
				})
			}

		}
	}

	componentWillMount() {
		this.setState({
			authFlag: false
		})
	}

	renderRedirect = () => {
		if (this.state.authFlag) {
			console.log("here")
			return <Redirect to='/Search' />
		}

	}

	handleSearchSubmit = async e => {
		e.preventDefault();

		const _this = this
		this.props.form.validateFields(async (err, fieldsValue) => {
			if (err) {
				return;
			}

			// Should format date value before submit.
			const rangeValue = fieldsValue['rangepicker'];
			const values = {
				...fieldsValue,
				'rangepicker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
			};
			console.log('Received values of form: ', values);
			console.log("sharingType", this.state.sharingType)
			console.log("propertyType", this.state.propertyType)
			console.log("minPrice ", this.state.minPrice)
			console.log("maxPrice ", this.state.maxPrice)
			console.log("internet ", this.state.internet)
			console.log("keywords ", this.state.keywords)
			sessionStorage.setItem("startDate", values.rangepicker[0]);
			sessionStorage.setItem("endDate", values.rangepicker[1]);
			const data = {
				city: values.location,
				startDate: values.rangepicker[0],
				//i need to add this to UI, was not sure where is the use of this
				endDate: values.rangepicker[1],
			}

			console.log("data fetched from req: ", data)

			await axios.get(`${ROOT_URL}/getProperties/search`, { params: data })
				.then(response => {
					console.log(response)
					if (response.status === 200)
						console.log("Response from java : ", response);
					_this.props.history.push({
						pathname: '/viewHomes',
						search: `?city=${data.city}&startDate=${data.startDate}&endDate=${data.endDate}`,
						state: { properties: response.data.propertyDetails }
					})
				})
				.catch(error => {
					console.log("error occured in fetching properties for the search", error);
				})
		});
	};
	render() {
		let view = null;
		const { getFieldDecorator } = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};

		const rangeConfig = {
			rules: [{ type: 'array', required: true, message: 'Please select dates!' }],
		};


		if ((sessionStorage.getItem('userId') && sessionStorage.getItem('type') == "Host") || (sessionStorage.getItem('userId') && sessionStorage.getItem('type') == "host")) {
			console.log("=== userId ===", sessionStorage.getItem('userId'))
			console.log("=== type ===", sessionStorage.getItem('type'))
			view = (
				<div>
					<h1 className="text-white">Welcome to OPEN HOME</h1>
					<h3 className="text-white">Host a property</h3>
					<h3 className="text-white">Host an experience</h3>
				</div>)
		} else {
			console.log("=== userId ===", sessionStorage.getItem('userId'))
			console.log("=== type ===", sessionStorage.getItem('type'))
			view = (
				<div>
					<div>
						<Row>
							<Col s={8} md={6}>
								<div id="divForm">
									<h1>Book unique places to stay and things to do.</h1>
									<Form {...formItemLayout} onSubmit={this.handleSearchSubmit}>

										<Form.Item label="Where" labelCol={{ span: 8 }} wrapperCol={{ span: 6 }} >
											{getFieldDecorator('location', {
												rules: [{ required: true, message: 'Please input place!' }],
											})(<Input />)}
										</Form.Item>
										<Form.Item label="Checkin-Checkout">
											{getFieldDecorator('rangepicker', rangeConfig)(<RangePicker onChange={this.dateChangeHandler} />)}
										</Form.Item>
										<div id="try-error" class="error" class="text-danger"></div>
										<Form.Item
											wrapperCol={{
												xs: { span: 24, offset: 0 },
												sm: { span: 16, offset: 8 },
											}}
										>
											{/* here exist advance serach option, shifting to viewHomes.js */}
											<Button disabled={this.state.activeSearch} type="danger" htmlType="submit">
												Search
                      </Button>
										</Form.Item>
									</Form>
								</div>

							</Col>
							<Col s={6} md={4}></Col>
							<Col s={6} md={4}></Col>

						</Row>

					</div>
				</div>
			)
		}


		require("./HomePage.css")

		return (

			<div>
				{/* {redirectVar} */}
				{this.renderRedirect()}

				<div id="intro" >
					<div className="content">
						<NavBar />
						<div className="jumbotron">
							<div className="Jumbotron__wrapper">
								<div class="ValueProps hidden-xs">
									{view}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div >

		)
	}
}

export default Form.create({ name: 'time_related_controls' })(HomePage);
// export default Form.create()(Signup);
