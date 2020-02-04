import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../../NavBar/NavBar'
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../../NavBarDark/NavBarDark';
import { Form, Table, Tag, DatePicker, TimePicker, PageHeader, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import { ROOT_URL } from '../../constants/constants';
import Moment from 'react-moment';
import { Carousel } from 'react-bootstrap';
import swal from 'sweetalert2';
import { Redirect } from 'react-router';

const { TextArea } = Input
const { Option } = Select;
var moment = require('moment');

export default class ViewPropertiesHost extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            imagesPreview: [],
            penalty: 0,
            weekendPrice: 0,
            weekdayPrice: 0,
            availability: [],
            changeWeekendPrice: false,
            changeWeekdayPrice: false,
            error: false
        };
    }


    handleAvailability = (e) => {
        console.log(`selected: ${e}`)

        this.setState({
            availability: e
        })
    }
    handleWeekdayPrice = (e) => {
        console.log('Weekday price: ', e);
        if (e < 10) {
            document.getElementById("weekday-error").innerHTML = "Weekday price should be atleast 10"
            this.setState({
                error: true
            })
        }
        else {
            document.getElementById("weekday-error").innerHTML = ""
            this.setState({
                weekdayPrice: e,
                changeWeekdayPrice: true,
                error: false
            })
        }

    }

    handleWeekendPrice = (e) => {
        console.log('Weekend Price: ', e);
        // console.log(e.target.value)
        if (e < 10) {
            document.getElementById("weekend-error").innerHTML = "Weekend price should be atleast 10"
            this.setState({
                error: true
            })
        }
        else {
            document.getElementById("weekend-error").innerHTML = ""
            this.setState({
                weekendPrice: e,
                changeWeekendPrice: true,
                error: false
            })
        }
    }

    changeAvailability = async (property) => {
        console.log(property)
        const availability = this.state.availability
        console.log("================= this.state.availability is ===========", availability)
        if (this.state.availability.length == 0) {
            console.log("availability is null")
            console.log("show alert message")
            alert("Please enter availability");
        } else {
            //availability is changed
            console.log("availability changed so make the axios call")
            const sunday = availability.includes("Sunday") ? -1 : 1
            const monday = availability.includes("Monday") ? -1 : 2
            const tuesday = availability.includes("Tuesday") ? -1 : 3
            const wednesday = availability.includes("Wednesday") ? -1 : 4
            const thursday = availability.includes("Thursday") ? -1 : 5
            const friday = availability.includes("Friday") ? -1 : 6
            const saturday = availability.includes("Saturday") ? -1 : 0

            const data = {
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday
            }
            await axios.put(`${ROOT_URL}/checkConflict/${property.id}`, data)
                .then((response) => {
                    console.log("response", response)
                    if (response.status == 200) {
                        if (response.data.conflict) {
                            console.log("Conflict is there")
                            swal.fire({
                                title: "Are you sure?",
                                text: "You will penalized as there are reservations within 7 days",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: '#DD6B55',
                                confirmButtonText: 'Yes, I am sure!',
                                cancelButtonText: "No, cancel it!",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            }).then(function (isConfirm) {
                                console.log("in function", isConfirm)
                                console.log("in function", isConfirm.dismiss)
                                console.log("in function", isConfirm.value)


                                if (isConfirm.value) {
                                    console.log("in confirm part of swal")
                                    axios.put(`${ROOT_URL}/updatePropertyAvailability/${property.id}`, data)
                                        .then((response) => {
                                            console.log("response", response)
                                            if (response.status == 200) {
                                                swal.fire("You are penalized", "There were some reservation within next 7 days", "success");
                                            }

                                        })
                                        .catch(error => {
                                            console.log("error in updating property availability", error)
                                        })


                                } else {
                                    console.log("in cancel part of swal")
                                    swal.fire("Success", "You chose not to change your availability :)", "success");
                                }
                            });
                        } else {
                            console.log("Conflict is not there")
                            console.log("Data:::::", data)
                            axios.put(`${ROOT_URL}/updatePropertyAvailability/${property.id}`, data)
                                .then((response) => {
                                    console.log("response", response)
                                    if (response.status == 200) {
                                        swal.fire("Successfully Updated", "Your availability Changed", "success");
                                    }

                                })
                                .catch(error => {
                                    console.log("error in updating property availability", error)
                                })
                        }
                    }

                })
                .catch(error => {
                    console.log("error in updating property availability", error)
                })

            // axios.put(`${ROOT_URL}/updatePropertyAvailability/${property.id}`, data)
            //     .then((response) => {
            //         console.log("response", response)
            //         if (response.status == 200) {
            //             swal.fire("Information updated successfully", "Updated", "success")
            //         }

            //     })
            //     .catch(error => {
            //         console.log("error in updating property availability", error)
            //     })

        }

    }

    removeProperty = async (property) => {
        console.log("=====inside remove property ======")


        console.log(property)


        //availability is changed
        console.log("availability changed so make the axios call")
        const data = {
            userId: sessionStorage.getItem("userId"),
            propertyId: property.id
        }

        await axios.get(`${ROOT_URL}/checkConflictOnDelete/${property.id}`)
            .then((response) => {
                console.log("response", response)
                if (response.status == 200) {
                    if (response.data.conflict) {
                        console.log("Conflict is there")
                        swal.fire({
                            title: "Are you sure?",
                            text: "You will penalized as there are reservations within 7 days",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: '#DD6B55',
                            confirmButtonText: 'Yes, I am sure!',
                            cancelButtonText: "No, cancel it!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        }).then(function (isConfirm) {
                            console.log("in function", isConfirm)
                            console.log("in function", isConfirm.dismiss)
                            console.log("in function", isConfirm.value)


                            if (isConfirm.value) {
                                console.log("in confirm part of swal")
                                axios.put(`${ROOT_URL}/removeProperty`, data)
                                    .then((response) => {
                                        console.log("response", response)
                                        if (response.status == 200) {
                                            swal.fire("You are penalized and Property Deleted", "There were some reservation within next 7 days", "success");
                                        }

                                    })
                                    .catch(error => {
                                        console.log("error in deleting property", error)
                                    })


                            } else {
                                console.log("in cancel part of swal")
                                swal.fire("Success", "You chose not to delete Property :)", "success");
                            }
                        });
                    } else {
                        console.log("Conflict is not there")
                        console.log("Data:::::", data)
                        axios.put(`${ROOT_URL}/removeProperty`, data)
                            .then((response) => {
                                console.log("response", response)
                                if (response.status == 200) {
                                    swal.fire("Deleted", "Your Property Deleted Successfully", "success");
                                }

                            })
                            .catch(error => {
                                console.log("error in removing property", error)
                            })
                    }
                }

            })
            .catch(error => {
                console.log("error in removing property", error)
            })

        // axios.put(`${ROOT_URL}/updatePropertyAvailability/${property.id}`, data)
        //     .then((response) => {
        //         console.log("response", response)
        //         if (response.status == 200) {
        //             swal.fire("Information updated successfully", "Updated", "success")
        //         }

        //     })
        //     .catch(error => {
        //         console.log("error in updating property availability", error)
        //     })









    }

    changeWeekdayPrice = (property) => {
        if(this.state.error)
        {
            document.getElementById("weekday-error").innerHTML ="Weekday Price is Invalid."
            return
        }
        console.log(property)
        const weekdayPrice = parseFloat(this.state.weekdayPrice).toFixed(2)
        // const weekendPrice = parseFloat(this.state.weekendPrice).toFixed(2)
        console.log(":changing weekday Price")
        let data;
        if (this.state.changeWeekdayPrice) {
            // this means take the price from state variable
            console.log(" this means take the price from state variable")
            data = {
                weekdayPrice: parseFloat(weekdayPrice).toFixed(2),
                weekendPrice: parseFloat(property.weekendPrice).toFixed(2),
            }
            console.log("===== data to update price =====", data)
            axios.put(`${ROOT_URL}/updatePropertyPrice/${property.id}`, data)
                .then((response) => {
                    console.log("response", response)
                    if (response.status == 200) {
                        swal.fire("Information updated successfully", "Updated", "success")
                    }
                })
                .catch(error => {
                    console.log("error in updating property price", error)
                })
        } else {
            //take the incoming price itself
            console.log("take the incoming price itself")
        }
    }
    changeWeekendPrice = (property) => {
        if(this.state.error)
        {
            document.getElementById("weekend-error").innerHTML ="WeekendPrice is Invalid."
            return
        }
        console.log(property)
        console.log(":changing weekend Price")
        const weekendPrice = parseFloat(this.state.weekendPrice).toFixed(2)

        let data;
        if (this.state.changeWeekendPrice) {
            // this means take the price from state variable
            console.log(" this means take the price from state variable")
            data = {
                weekdayPrice: parseFloat(property.weekdayPrice).toFixed(2),
                weekendPrice: parseFloat(weekendPrice).toFixed(2),
            }
            console.log("===== data to update price =====", data)
            axios.put(`${ROOT_URL}/updatePropertyPrice/${property.id}`, data)
                .then((response) => {
                    console.log("response", response)
                    if (response.status == 200) {
                        swal.fire("Information updated successfully", "Updated", "success")
                            .then(function (isConfirm) {
                                if (isConfirm) {
                                    window.location.reload();
                                }
                            })
                    }
                })
                .catch(error => {
                    console.log("error in updating property price", error)
                })
        } else {
            //take the incoming price itself
            console.log("take the incoming price itself")
        }

    }
    componentDidMount() {

        var userId = sessionStorage.getItem("userId")
        console.log("!!!!!!!!!!1 sessionStorage.getItem('isVerified')", sessionStorage.getItem('isVerified'))
        if ((sessionStorage.getItem('isVerified'))) {
            console.log("itthe")
            axios.get(`${ROOT_URL}/getAllProperties/${userId}`)
                .then((response) => {
                    console.log("response", response)
                    if (response.data.propertyDetails) {
                        this.setState({
                            data: response.data.propertyDetails
                        })
                    } else {
                        console.log(" no property details found")
                    }

                })
                .catch(error => {
                    console.log("=====errror", error)
                })

        } else {
            console.log("user is not verified", sessionStorage.getItem('isVerified'))
        }
    }
    renderRedirect = () => {
        if (!sessionStorage.getItem('userId')) {
            console.log("user not logged in")
            return <Redirect to='/home' />
        }
    }

    render() {
        let propertytList;
        let images = null;

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
                title: 'Refunded',
                dataIndex: 'refund',
                key: 'refund',
            }
            // {
            // 	title: 'Action',
            // 	key: 'action',
            // 	render: (booking) => (
            // 		<button class="btn btn-danger btn-sm" onClick={() => this.cancelReservation(booking)} style={{ fontWeight: "bolder" }} >Cancel Reservation</button>
            // 	)
            // }

        ]

        if (this.state.data.length > 0) {
            console.log("sjdhbfdsjfbjdsb", this.state.data)
            propertytList = this.state.data.map(property => {
                // console.log("````````````property``````", property);
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
                                                // console.log("======picture url ====````````````", picture)
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
                                    <div>
                                        <h2>Property Number #{property.id}</h2>
                                        <div className="float-right">

                                            <Button type="primary" style={{ background: "#ff5a5f", borderColor: "#ff5a5f" }} htmlType="submit" onClick={() => this.removeProperty(property)}> Remove Property </Button>
                                        </div>

                                    </div>
                                    <div>
                                        <h3>{property.description}</h3>
                                    </div>

                                    <div>
                                        <Form >
                                            <Form.Item label="Availability" >
                                                <Select mode="multiple" style={{ width: '100%' }} placeholder="Select Property Availability" defaultValue={[]} onChange={this.handleAvailability} name="availability" optionLabelProp="label">
                                                    <Option value="Monday" label="Monday">Monday</Option>
                                                    <Option value="Tuesday" label="Tuesday">Tuesday</Option>
                                                    <Option value="Wednesday" label="Wednesday">Wednesday</Option>
                                                    <Option value="Thursday" label="Thursday">Thursday</Option>
                                                    <Option value="Friday" label="Friday">Friday</Option>
                                                    <Option value="Saturday" label="Saturday">Saturday</Option>
                                                    <Option value="Sunday" label="Sunday">Sunday</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item >
                                                <Button type="primary" style={{ background: "#ff5a5f", borderColor: "#ff5a5f" }} htmlType="submit" onClick={() => this.changeAvailability(property)} > Change Availability </Button>
                                            </Form.Item>
                                        </Form>
                                        <Form>
                                            <Form.Item >
                                                {/* <PageHeader title="Price of the Property" /> */}

                                                <Form.Item label="Weekday Price" >
                                                    <InputNumber onChange={this.handleWeekdayPrice} defaultValue={property.weekdayPrice} />
                                                    <span className="ant-form-text"> USD</span>
                                                    <div id="weekday-error"></div>
                                                </Form.Item>
                                                <Form.Item >
                                                    <Button type="primary" style={{ background: "#ff5a5f", borderColor: "#ff5a5f" }} htmlType="submit" onClick={() => this.changeWeekdayPrice(property)}> Update Weekday Price </Button>
                                                </Form.Item>
                                                <Form.Item label="Weekend Price" >
                                                    <InputNumber onChange={this.handleWeekendPrice} defaultValue={property.weekendPrice} />
                                                    <span className="ant-form-text"> USD</span>
                                                    <div id="weekend-error"></div>
                                                </Form.Item>
                                                <Form.Item >
                                                    <Button type="primary" style={{ background: "#ff5a5f", borderColor: "#ff5a5f" }} htmlType="submit" onClick={() => this.changeWeekendPrice(property)}> Update Weekend Price </Button>
                                                </Form.Item>

                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                );
            });
        } else {
            console.log("In else!!!!!!!!!")
            propertytList = (<div>
                No property posted by this user
			</div>)
        }


        return (

            <div>
                <NavBarDark />
                {this.renderRedirect()}
                <div className="main-property-div p-3" style={{ backgroundColor: '#f7f7f8' }}>
                    {sessionStorage.getItem('isVerified') == "false"
                        ? <div>
                            <p> Please verify your account! </p>
                        </div>
                        :
                        <div>
                            {propertytList}

                        </div>
                    }
                </div>
            </div >
        )


    }
}