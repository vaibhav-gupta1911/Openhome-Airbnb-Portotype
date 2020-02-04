import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../NavBar/NavBar'
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../NavBarDark/NavBarDark';
import { Form, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import _ from "lodash";
import { Empty } from 'antd'
import { Carousel } from 'react-bootstrap';
import { ROOT_URL } from '../constants/constants';
import Maps from '../Maps/SimpleMap';
import { calcCrow } from './MapUtility'


// import 'antd/dist/antd.css';
const { Option } = Select;
export default class ViewHomes extends Component {
	constructor() {
		super();
		this.state = {
			data: [],
			filteredData: [],
			sharingType: "",
			propertyType: [],
			minPrice: "",
			maxPrice: "",
			internet: "",
			keywords: "",
			zipcode: "",
			imagesPreview: [],
			centerzip: '',
			distance: 10,
			center: { lat: 33.7600586, lng: -84.3644884 },
			zipstore: []
		};

	}
	componentWillMount() {
		this.setState({
			data: this.props.location.state.properties,
			filteredData: this.props.location.state.properties
		})
	}
	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = async e => {
		console.log(e);
		console.log("In Handle OK")
		console.log(this.state)
		let filteredData = this.state.data

		if (this.state.zipcode != "") {
			console.log("In IF statement of filter")
			const filteredZipcode = this.state.zipcode
			console.log("Filtered Data::::", this.state.filteredData)
			// if(this.state.Zipcode != "") const filteredZipcode = this.state.Zipcode
			filteredData = _.filter(filteredData, function (o) { return o.zipcode == filteredZipcode })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}
		if (this.state.sharingType != "") {
			console.log("In IF statement of filter")
			const filteredSharingType = this.state.sharingType
			console.log("Filtered Data::::", this.state.filteredData)
			// if(this.state.propertyType != "") const filteredpropertyType = this.state.propertyType
			filteredData = _.filter(filteredData, function (o) { return o.sharingType == filteredSharingType })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}
		if (this.state.propertyType != "") {
			console.log("In IF statement of filter")
			const filteredPropertyType = this.state.propertyType
			console.log("Filtered Data::::", this.state.filteredData)
			console.log("Filters Property Types:", filteredPropertyType)
			// if(this.state.propertyType != "") const filteredpropertyType = this.state.propertyType
			filteredData = _.filter(filteredData, function (o) { return o.propertyType == filteredPropertyType[0][0] || o.propertyType == filteredPropertyType[0][1] || o.propertyType == filteredPropertyType[0][2] })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}
		if (this.state.minPrice != "") {
			console.log("In IF statement of filter")
			const filteredMinPrice = this.state.minPrice
			console.log("Filtered Data::::", this.state.filteredData)
			// if(this.state.minPrice != "") const filteredminPrice = this.state.minPrice
			filteredData = _.filter(filteredData, function (o) { return o.weekdayPrice >= filteredMinPrice })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}
		if (this.state.maxPrice != "") {
			console.log("In IF statement of filter")
			const filteredMaxPrice = this.state.maxPrice
			console.log("Filtered Data::::", this.state.filteredData)
			// if(this.state.maxPrice != "") const filteredmaxPrice = this.state.maxPrice
			filteredData = _.filter(filteredData, function (o) { return o.weekendPrice <= filteredMaxPrice })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}
		if (this.state.keywords != "") {
			console.log("In IF statement of filter")
			const filteredKeywords = this.state.keywords
			console.log("Filtered Data::::", this.state.filteredData)
			// if(this.state.Keywords != "") const filteredKeywords = this.state.Keywords
			filteredData = _.filter(filteredData, function (o) { return o.description.includes(filteredKeywords) })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}
		console.log("Internet::::", this.state.internet)
		if (this.state.internet != "") {
			console.log("In IF statement of filter")
			let filteredInternet = []
			if (this.state.internet[0][0] == "Yes")
				filteredInternet.push(true)
			if (this.state.internet[0][1] == "Yes")
				filteredInternet.push(true)
			if (this.state.internet[0][0] == "No")
				filteredInternet.push(false)
			if (this.state.internet[0][1] == "No")
				filteredInternet.push(false)
			// if(this.state.internet != "") const filteredinternet = this.state.internet
			filteredData = _.filter(filteredData, function (o) {
				console.log(o.internet)
				return o.internet == filteredInternet[0] || o.internet == filteredInternet[1]
			})
			// filteredData = _.filter(filteredData, function (o) { return o.internet == filteredInternet })
			// visible: false,
			console.log("Filtered Data After Applying Filters: ", filteredData)
		}

		let newfilteredData = filteredData;

		if (this.state.centerzip !== null && this.state.centerzip !== undefined && this.state.centerzip !== '') {

			var setmap = this.setMapCenter();

			setmap.then((x) => {

				this.setState({
					zipstore: []
				})

				filteredData.forEach(i => {
					var isValid = this.checkValidZips(i.zipcode, i.streetAddress);
					var id = i.id;
					var zip = i.zipcode;
					isValid.then((msg) => {
						console.log("IS MESSAGE PASS VAILDDDDDDDD>...............................................", msg)
						console.log("IS MESSAGE PASS IDDDDDDDDDDDDDDDDD>...............................................", id)

						if (msg === false) {
							console.log("IS VAILDDDDDDDD newfilteredData......................................")
							newfilteredData = _.filter(newfilteredData, function (o) { return o.id !== id })

							this.setState({
								filteredData: newfilteredData,
								visible: false,
							});
						}

					}).catch((msg) => {
						console.log("IS MESSAGE FAIL VAILDDDDDDDD>...............................................", msg)
					})
				});

				console.log("Filtered Data After Applying Filters newfilteredData: ", newfilteredData)
			}).catch((msg) => {
				console.log("IS MESSAGE FAIL VAILDDDDDDDD>...............................................", msg)
			});

		}

		this.setState({
			filteredData: newfilteredData,
			visible: false,
		});
	};


	checkValidZips = async (zip, desc) => {
		if (zip !== null && zip !== undefined) {
			var val = false;
			const x = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + '&key=' + 'AIzaSyArQJzIzwRkSpzdFWSBlrQffi0P99OQkdQ')// 'AIzaSyATv_BCmdXC8fCaYcTqZ9vY5I5RaNlkzck')
				.then(response => {
					console.log(response.data.results[0].geometry.location.lat);
					console.log(response.data.results[0].geometry.location.lng);
					console.log(zip)

					var randomNo = (Math.floor(Math.random() * 1000) + 1) / 100000;

					var z = {
						latitude: response.data.results[0].geometry.location.lat + randomNo,
						longitude: response.data.results[0].geometry.location.lng + randomNo,
						name: desc
					}

					var dist = calcCrow(this.state.center.lat, this.state.center.lng, z.latitude, z.longitude);

					console.log("THE DISTANNCE .........................", dist);

					if (dist <= this.state.distance) {

						var store = [];
						store = this.state.zipstore;
						store.push(z);

						this.setState({
							zipstore: store
						})

						console.log("THE DISTANNCE TRUEEEEEEEEEEE.........................", dist);
						val = true;
					}
					else {
						console.log("THE	 DISTANNCE FALSEEEEEEEEEEE.........................", dist);
						val = false;
					}
				})
				.catch(data => {
					console.log("**ERROR** GET COORDINATE AND VALIDATION, IS BROKEN: METHOD = getCoordinatesAndValidate(), CLASS = ViewHome.js**");
				})
		} else {
			return false;
		}

		return val;
	}

	setMapCenter = async () => {
		await axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.centerzip + '&key=' + 'AIzaSyATv_BCmdXC8fCaYcTqZ9vY5I5RaNlkzck')
			.then(response => {
				console.log("**SUCCESS** IN GETTING THE CENTER OF THE MAP RESPONSE, FROM GOOGLE SERVER: METHOD = setMapCentre(), CLASS = ViewHome.js**");
				console.log(this.props.centerzip);
				console.log(response.data.results[0].geometry.location.lat);
				console.log(response.data.results[0].geometry.location.lng)
				console.log(this.state.centerzip);

				var t = {
					lat: response.data.results[0].geometry.location.lat,
					lng: response.data.results[0].geometry.location.lng
				}

				this.setState({
					center: t
				})

				console.log("CENTER :---------------------------------------------------", this.state.center)
			})
			.catch(data => {
				console.log("**ERROR** SET CENTER OF THE MAP, IS BROKEN: METHOD = setMapCentre(), CLASS = ViewHome.js**")
			})
	}


	handledistance = (e) => {
		console.log('handledistance', e.target.value);
		this.setState({
			distance: e.target.value
		})
		console.log(this.state.distance);
	}

	handleMapZipcode = (e) => {
		console.log('handleMapZipcode', e.target.value);

		const { value } = e.target;
		const reg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
			this.setState({
				centerzip: e.target.value
			});
		}
		console.log(this.state.centerzip);
	}


	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};


	handleZipcode = (e) => {
		console.log('handleZipcode', e.target.value);

		const { value } = e.target;
		const reg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
			this.setState({
				zipcode: e.target.value
			});
		}
		console.log(this.state.zipcode);
	}

	sharingTypeChangeHandler = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			sharingType: e.target.value
		})
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

	handleMinPrice = (e) => {
		console.log('handleMinPrice', e.target.value);
		this.setState({
			minPrice: e.target.value
		})
		console.log(this.state.minPrice);
	}

	handleMaxPrice = (e) => {
		console.log('handleMaxPrice', e.target.value);
		this.setState({
			maxPrice: e.target.value
		})
		console.log(this.state.maxPrice);
	}

	handleKeywords = (e) => {
		console.log('handleKeywords', e.target.value);
		this.setState({
			keywords: e.target.value
		})
		console.log(this.state.keywords);
	}

	handleInternetChange = (e) => {
		console.log('handleIntenet only e = ', e);
		// const internet = this.state.internet
		this.state.internet = []
		if (e) {
			this.setState({
				internet: [...this.state.internet, e],
			}, () => {
				console.log('fruits', this.state.internet);
			});
			// if (e.pop() === "Yes") {
			//     this.setState({
			//         internet: [...this.state.internet, true],
			//     }, () => {
			//         console.log('fruits', this.state.internet);
			//     }
			//     );
			// }else{
			//     this.setState({
			//         internet: [...this.state.internet, false],
			//     }, () => {
			//         console.log('fruits', this.state.internet);
			//     }
			//     );
			// }
		} else {
			let remove = this.state.internet.indexOf(e);
			this.setState({
				internet: this.state.internet.filter((_, i) => i !== remove)
			},
				() => {
					console.log('fruits', this.state.internet);
				}
			);
		}
		// let val
		// if(e==="Yes") 
		//     val=true
		// else
		//     val=false
		// this.setState({
		//     internet: this.state.internet.push(val)
		// })
		console.log(this.state.internet);
	}

	clearFilters = (e) => {
		console.log('Clear Filters e = ', e);
		this.setState({
			sharingType: "",
			propertyType: [],
			minPrice: "",
			maxPrice: "",
			internet: "",
			keywords: "",
			zipcode: "",
			internet: "",
			centerzip: '',
			distance: 10,
			center: { lat: 33.7600586, lng: -84.3644884 },
			zipstore: [],
			filteredData: this.state.data
		})
		console.log(this.state);
	}

	render() {
		let propertyList;
		console.log(this.props)
		const formItemLayout = {
			labelCol: {
				xs: { span: 21 },
				sm: { span: 7 },
			},
			wrapperCol: {
				xs: { span: 21 },
				sm: { span: 14 },
			},
		};

		propertyList = this.state.filteredData.map(property => {

			console.log("Properties is not null ", this.state.filteredData)
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
							{/* <div style={{ width: 255 }} >
                                    <img src={require('../../images/homeaway.jpg')} height="200px" Width="250px" ></img> */}
							{/* <img src={this.state.imagesPreview} height="100px" /> */}
							{/* </div> */}

							<div>
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
							</div>


							{/* <Link to={{
								pathname: "/homedetails",
								state: {
									property: property
								}
							}}
								role="button" style={{ color: '#000' }}> */}
							<div className="col-xs nameview my-5 ml-3">
								{/* <div> {property.description}</div>
                                <div>

                                    <Link to={{
                                        pathname: "/homedetails",
                                        state: {
                                            property: property
                                        }
                                    }}
                                        role="button">{property.id}</Link>
                                </div> */}

								<div className="displayRow">
									<div id="below">{property.streetAddress}</div>
									<div id="below">{property.city}</div>
								</div>

								<div className="priceview">
									<span>{property.weekdayPrice}</span> Per night
                  </div>
								<div className="mt-2">
									<Link to={{
										pathname: "/homedetails",
										state: {
											property: property
										}
									}}
										role="button" style={{ color: '#000' }}>
										<button class="btn btn-danger btn-sm" >Detailed View</button>
									</Link>
								</div>
							</div>
							{/* </Link> */}
						</div>

					</div>

				</div>


			);

		});



		if (this.state.data != null) {
			return (

				<div>
					<NavBarDark></NavBarDark>
					<div className="ml-5">
						<Button type="dashed" onClick={this.showModal} style={{ marginBottom: "20px", marginLeft: "15px" }}>
							Advanced Search
                        </Button>
						<Button type="dashed" onClick={this.clearFilters} style={{ marginLeft: "15px" }}>
							Clear Filters
                        </Button>

						<Maps stores={this.state.zipstore} mapcenter={this.state.center} ></Maps>

						<Modal
							title="More Filters"
							visible={this.state.visible}
							onOk={this.handleOk}
							onCancel={this.handleCancel}
						>
							<Form.Item label="Zipcode" onChange={this.handleZipcode} name="zipcode" {...formItemLayout}>
								<InputNumber
									//value={this.state.centerzip}
									maxLength='5'
								/>
							</Form.Item>

							<div>
								<Form.Item label="Map Center Zip" onChange={this.handleMapZipcode} name="mapzipcode" {...formItemLayout}>
									<InputNumber
										value={this.state.centerzip}
										maxLength='5'
									/>

								</Form.Item>
								<Form.Item label="Distance Range" onChange={this.handledistance} name="distance" {...formItemLayout}>
									<InputNumber
										value={this.state.distance}
										maxLength='6'
										parser={value => value.replace(/\$\s?|(,*)/g, '')}
									/>
								</Form.Item>
							</div>

							<Form.Item label="Sharing Type" {...formItemLayout}>
								<Radio.Group onChange={this.sharingTypeChangeHandler} value={this.state.sharingType}>
									<Radio value="Entire Place">Entire place</Radio>
									<Radio value="Private Room">Private room</Radio>

								</Radio.Group>
							</Form.Item>
							<Form.Item label="Property Type" {...formItemLayout}>
								{/* Property Type */}
								<Select mode="multiple" style={{ width: '100%' }} placeholder="Select Property Type" defaultValue={[]} onChange={this.handlePropertyChange} name="propertyType" optionLabelProp="label">
									<Option value="House" label="House">House</Option>
									<Option value="Townhouse" label="Townhouse">Townhouse</Option>
									<Option value="Apartment" label="Condo/Apartment">Condo/Apartment</Option>
								</Select>
							</Form.Item>
							<Form.Item label="Minimum Price" {...formItemLayout} onChange={this.handleMinPrice} >
								<InputNumber
									value={this.state.minPrice}
									formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={value => value.replace(/\$\s?|(,*)/g, '')}
								/>
								{/* <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="text" class="form-control" name="minPrice" aria-label="Amount (to the nearest dollar)" />
                                    <div class="input-group-append">
                                        <span class="input-group-text">.00</span>
                                    </div>
                                </div> */}
							</Form.Item>
							<Form.Item label="Maximum Price" {...formItemLayout} onChange={this.handleMaxPrice} >
								<InputNumber
									value={this.state.maxPrice}
									formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={value => value.replace(/\$\s?|(,*)/g, '')}
								/>
								{/* <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="text" class="form-control" name="maxPrice" aria-label="Amount (to the nearest dollar)" />
                                    <div class="input-group-append">
                                        <span class="input-group-text">.00</span>
                                    </div>
                                </div> */}
							</Form.Item>
							<Form.Item label="Keywords" onChange={this.handleKeywords} name="keywords" {...formItemLayout}>
								<Input placeholder="Type Keywords" />
							</Form.Item>

							<Form.Item label="Internet Availability" {...formItemLayout}>
								<Select mode="multiple" style={{ width: '100%' }} placeholder="Select Option(s)" defaultValue={[]} onChange={this.handleInternetChange} name="internet" optionLabelProp="label">
									<Option value="Yes" label="Yes">Yes</Option>
									<Option value="No" label="No">No</Option>
								</Select>
								{/* <Switch
                                    checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    defaultChecked
                                    onChange={this.handleInternetChange} name="internet"
                                /> */}
							</Form.Item>

						</Modal>
					</div>
					<div className="main-property-div" style={{ backgroundColor: '#f7f7f8' }}>

						{propertyList.length == 0 ? <Empty /> : propertyList}
					</div>
				</div >
			)

		}

	}
}