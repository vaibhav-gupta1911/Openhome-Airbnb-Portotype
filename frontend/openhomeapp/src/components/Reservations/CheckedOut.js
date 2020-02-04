import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../NavBar/NavBar'
import swal from 'sweetalert2';
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../NavBarDark/NavBarDark';
import { Form, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import { ROOT_URL } from '../constants/constants';
import Moment from 'react-moment';
var moment = require('moment');
var momentb = require('moment-business-days');

export default class CheckedOut extends Component {
    constructor(props) {
        super(props);
        if (this.props.sendPropertyAsProps != null) {
            this.state = {
                data: this.props.sendPropertyAsProps,
                penalty: 0,
                weekendPrice: 0,
                weekdayPrice: 0,
            };

        }

        console.log("checking data here through props ", this.props.sendPropertyAsProps)
    }

    guestCheckOut = async (booking) => {
        console.log("props data : ", booking)

        axios.get(`${ROOT_URL}/systemdate`)
            .then(async (response) => {
                console.log("response", response)
                if (response.data) {

                    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

                    var currentDate = moment(response.data);
                    console.log("curr date ", currentDate.toString())


                    var startDate = moment(booking.bookingDetails.startDate).format();
                    console.log("weekend or week? ", moment(startDate).isoWeekday());
                    console.log("startDate : ", startDate.toString())

                    var endDate = moment(booking.bookingDetails.endDate);
                    console.log("enddate : ", endDate.toString())

                    var tomorrow = moment(startDate, 'YYYY-MM-DD h:mm a').add('hours', 24)
                    console.log("Tomorrow Date:::: ", tomorrow.toString())

                    // var tomorrow = currentDate.add('hours', 12)
                    // var hoursCurrentStart = today.diff(dateToCompare, 'hours')
                    // var hoursEndStart = moment(endDate).diff(dateToCompare, 'hours')
                    var hoursCurrentEnd = moment(endDate).diff(currentDate, 'hours')
                    console.log("Hours current to end::: ", hoursCurrentEnd)

                    if (booking.bookingDetails.status === "paid") {
                        if (hoursCurrentEnd < 24) {
                            startDate = moment(startDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                            endDate = moment(endDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                            // console.log("My Time:::::::::::",moment.tz(startDate, "America/Los_Angeles").toString())
                            const data = {
                                penalty: this.state.penalty.toString(),
                                status: "checkedout",
                                checkedOutDate: currentDate,
                                startDate: startDate,
                                endDate: endDate,
                                propertyId: booking.id
                            }
                            console.log("Dta:::::::::::::::::", data)
                            await axios.put(`${ROOT_URL}/updateBookingCheckedOut/${booking.bookingDetails.id}`, data)
                                .then((response) => {
                                    console.log("response", response)
                                    if (response.status == 200) {
                                        swal.fire({
                                            title: "You have checked-out successfully",
                                            text: "Checked-out",
                                            type: "success",
                                            buttons: ['OK']
                                        }).then(function (isConfirm) {
                                            if (isConfirm) {
                                                window.location.reload();
                                            } else {
                                                //if no clicked => do something else
                                            }
                                        })
                                    }
                                }).catch(error => {
                                    console.log("Error in Updating status to checked in", error)
                                })
                            swal.fire({
                                title: "Successfully Checked out",
                                text: "No Penalty Charged",
                                buttons: ['OK']
                            }).then(function (isConfirm) {
                                if (isConfirm) {
                                    window.location.reload();
                                } else {
                                    //if no clicked => do something else
                                }
                            })
                            console.log("No Charges on Checking out.")
                        }
                        else if (hoursCurrentEnd >= 24) {
                            var isWeekDayNextDayOfCheckout = momentb(tomorrow, 'YYYY-MM-DD').isBusinessDay();
                            console.log("isWeekDayNextDayOfCheckout", isWeekDayNextDayOfCheckout)
                            if (isWeekDayNextDayOfCheckout) {
                                this.setState({
                                    penalty: (booking.bookingDetails.weekdayPrice) * 0.30
                                }, () => {
                                    console.log("Penalty:::::::", this.state.penalty)
                                    startDate = moment(startDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                                    endDate = moment(endDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                                    const data = {
                                        penalty: this.state.penalty.toString(),
                                        status: "checkedout",
                                        checkedOutDate: currentDate,
                                        startDate: startDate,
                                        endDate: endDate,
                                        propertyId: booking.id
                                    }
                                    console.log("Dta:::::::::::::::::", data)
                                    axios.put(`${ROOT_URL}/updateBookingCheckedOut/${booking.bookingDetails.id}`, data)
                                        .then((response) => {
                                            console.log("response", response)
                                            if (response.status == 200) {
                                                swal.fire({
                                                    title: "You have checked-out successfully",
                                                    text: "Checked-out",
                                                    type: "success",
                                                    buttons: ['OK']
                                                }).then(function (isConfirm) {
                                                    if (isConfirm) {
                                                        window.location.reload();
                                                    } else {
                                                        //if no clicked => do something else
                                                    }
                                                })
                                            }
                                        }).catch(error => {
                                            console.log("Error in Updating status to checked in", error)
                                        })
                                })
                            }
                            else {
                                this.setState({
                                    penalty: (booking.bookingDetails.weekendPrice) * 0.30
                                }, () => {
                                    console.log("Penalty:::::::", this.state.penalty)
                                    startDate = moment(startDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                                    endDate = moment(endDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                                    const data = {
                                        penalty: this.state.penalty.toString(),
                                        status: "checkedout",
                                        checkedOutDate: currentDate,
                                        startDate: startDate,
                                        endDate: endDate,
                                        propertyId: booking.id
                                    }
                                    console.log("Dta:::::::::::::::::", data)
                                    axios.put(`${ROOT_URL}/updateBookingCheckedOut/${booking.bookingDetails.id}`, data)
                                        .then((response) => {
                                            console.log("response", response)
                                            if (response.status == 200) {
                                                swal.fire({
                                                    title: "You have checked-out successfully",
                                                    text: "Checked-out",
                                                    type: "success",
                                                    buttons: ['OK']
                                                }).then(function (isConfirm) {
                                                    if (isConfirm) {
                                                        window.location.reload();
                                                    } else {
                                                        //if no clicked => do something else
                                                    }
                                                })
                                            }
                                        }).catch(error => {
                                            console.log("Error in Updating status to checked in", error)
                                        })
                                })
                            }
                            // console.log("Penalty:::::::", this.state.penalty)
                            // startDate = moment(startDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                            // endDate = moment(endDate, 'YYYY-MM-DD h:mm a').add('hours', -8)
                            // // console.log("My Time:::::::::::",moment.tz(startDate, "America/Los_Angeles").toString())
                            // const data = {
                            //     penalty: this.state.penalty.toString(),
                            //     status: "checkedout",
                            //     checkedOutDate: currentDate,
                            //     startDate: startDate,
                            //     endDate: endDate,
                            //     propertyId: booking.id
                            // }
                            // console.log("Dta:::::::::::::::::", data)
                            // await axios.put(`${ROOT_URL}/updateBookingCheckedOut/${booking.bookingDetails.id}`, data)
                            //     .then((response) => {
                            //         console.log("response", response)
                            //         if (response.status == 200) {
                            //             swal.fire({
                            //                 title: "You have checked-out successfully",
                            //                 text: "Checked-out",
                            //                 type: "success",
                            //                 buttons: ['OK']
                            //             }).then(function (isConfirm) {
                            //                 if (isConfirm) {
                            //                     window.location.reload();
                            //                 } else {
                            //                     //if no clicked => do something else
                            //                 }
                            //             })
                            //         }
                            //     }).catch(error => {
                            //         console.log("Error in Updating status to checked in", error)
                            //     })
                        } else {
                            console.log("```````in trailing else")
                        }
                    }

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

    render() {
        return (
            <div>

                <div>
                    <button class="btn btn-success btn-sm" onClick={() => this.guestCheckOut(this.props.sendPropertyAsProps)} style={{ fontWeight: "bolder" }} >Check out</button>

                </div>
            </div>
        )
    }
}