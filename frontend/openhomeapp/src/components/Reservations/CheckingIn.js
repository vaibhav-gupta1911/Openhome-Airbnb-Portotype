import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import NavBar from '../NavBar/NavBar'
import swal from 'sweetalert2';
import { BrowserRouter as Router } from 'react-router-dom'
import NavBarDark from '../NavBarDark/NavBarDark';
import { Form, DatePicker, TimePicker, Button, Input, InputNumber, Radio, Modal, Select, Switch, Icon } from 'antd';
import { ROOT_URL } from '../constants/constants';
import PaymentTxn from '../Payment/PaymentTxn'
import Moment from 'react-moment';
var moment = require('moment');
var momentb = require('moment-business-days')

export default class CheckingIn extends Component {
    constructor(props) {
        super(props);
        if (this.props.sendPropertyAsProps != null) {
            this.state = {
                data: this.props.sendPropertyAsProps,
                penalty: 0,
                weekendPrice: 0,
                weekdayPrice: 0,
                curSysTime: "",

            };
            // this.checkDateIsBetween = this.checkDateIsBetween.bind(this);
        }

        console.log("checking data here through props ", this.props.sendPropertyAsProps)
    }


    guestCheckIn = async (dataProps) => {
        var booking = dataProps.bookingDetails
        console.log("clicked booking details : ", booking)
        axios.get(`${ROOT_URL}/systemdate`)
            .then( async (response) => {
                console.log("response", response)
                if (response.data) {

                    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

                    // var currentDate = moment((new Date(response.data)).toLocaleString());
                    var currentDate = moment(response.data);

                    var startDate = moment(booking.startDate).format();
                    var endDate = moment(booking.endDate).format();;

                    console.log("*******************************check case 1: check date is between 3 pm of startdate to 3 am of next date *********************")
                    //test your custom date here in below line by adding hours in current date,**** testing purpose only ***** since you can't modify current system date
                    //    var checkInTime = moment(currentDate, 'YYYY-MM-DD h:mm a').add('hours',24); 
                    var checkInTime = moment(currentDate, 'YYYY-MM-DD h:mm a');
                    var startDate3PM = moment(startDate, 'YYYY-MM-DD h:mm a');
                    var nextDay3AM = moment(startDate3PM, 'YYYY-MM-DD h:mm a').add('hours', 12);
                    var isBetween = checkInTime.isBetween(startDate3PM, nextDay3AM);
                    console.log("CheckinTime: ", checkInTime)
                    console.log("startDate3PM: ", startDate3PM)
                    console.log("nextDay3AM: ", nextDay3AM)
                    console.log("isBetween : ", isBetween);
                    console.log("*******ENDS**********************check date is between 3 pm of startdate to 3 am of next date ***************ENDS*****")

                    console.log("==================================check case 2:  no show =========================================================")
                    if (!isBetween) {
                        console.log("You have not checked in into the specified time, no show charges will be applied")
                        //var isSame = startDate.startOf('day').isSame(endDate.startOf('day'));
                        var dateToCompare = moment(startDate);
                        var withEndDate = moment(endDate);
                        var nextDateFromStart = moment(startDate, 'YYYY-MM-DD h:mm a').add('hours', 12);
                        console.log("startdate", startDate.toString())
                        console.log("dateToCompare", dateToCompare.toString())
                        console.log("nextDateFromStart", nextDateFromStart.toString())
                        console.log("withEndDate", withEndDate.toString())
                        console.log("nextDay3AM", nextDay3AM.toString())
                        console.log("With end Date start of::::", withEndDate.startOf('day').toString())
                        console.log(withEndDate.startOf('day').isSame(nextDay3AM.startOf('day')))
                        // if enddate is same as nextdate of startdate
                        if (withEndDate.startOf('day').isSame(nextDay3AM.startOf('day'))) {
                            console.log("1. checkin and checkout dates are same, 1.	30% of the reservation price for that day is charged for the current day.")
                            //apply charges code here, not sure what is reservation price, will discuss it tmrw
                            var isbussday = momentb(dateToCompare, 'YYYY-MM-DD').isBusinessDay();
                            console.log("is buss day? ", isbussday)
                            if (isbussday) {
                                this.setState({
                                    penalty: booking.weekdayPrice * 0.30
                                })
                            }
                            else {
                                this.setState({
                                    penalty: booking.weekendPrice * 0.30
                                })
                            }

                        }
                        else {
                            console.log("2.	If the current reservation includes the next day, 30% of the reservation price for that day will be charged for forced late cancellation as well.")
                            //ask to mili
                            var isStartDateBussDay = momentb(startDate, 'YYYY-MM-DD').isBusinessDay();
                            var isnextDateFromStartBussDay = momentb(nextDateFromStart, 'YYYY-MM-DD').isBusinessDay();
                            if (isStartDateBussDay && isnextDateFromStartBussDay) {
                                this.setState({
                                    penalty: booking.weekdayPrice * 0.30 * 2
                                })
                            }
                            else if (!isStartDateBussDay && !isnextDateFromStartBussDay) {
                                this.setState({
                                    penalty: booking.weekendPrice * 0.30 * 2
                                })
                            }
                            else {
                                this.setState({
                                    penalty: (booking.weekdayPrice + booking.weekendPrice) * 0.30
                                })
                            }


                        }

                        console.log("3.	For reservations longer than 2 days, no further charges will be placed. ")

                        console.log("before data to send ......")

                        var dataToSend = {
                            noShowPenalty: this.state.penalty,
                            status: "noshow",
                            checkedInDate: currentDate,
                        }
                        console.log("Data:::::::::::", dataToSend)
                        console.log("Booking Status: ", booking.status)
                        if (booking.status == "noshow") {
                            swal.fire("You did not check in between 3 pm to 3 am, no show charges already applied", "no show", "error")
                        } else if (booking.status == "checkedin") {
                            swal.fire("You have already checked-in successfully", "Checked-in", "error")
                        } else {
                            await axios.put(`${ROOT_URL}/updateNoShowPenalty/${booking.id}`, dataToSend)
                                .then((response) => {
                                    console.log("response", response)
                                    if (response.status == 200) {
                                        swal.fire({
                                            title: "No show penalty charged",
                                            text: "You should have checkedin between 3 PM to 3 AM from date : \n\n" + new Date(startDate).toString() +
                                                "\n\nNo show penalty:" + this.state.penalty,
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
                                    console.log("error in iupdating `````````````````````", error)
                                })
                        }
                    }
                    //else user has checkin successfully , store checkin time and show successfull pop up
                    else {
                        // if (booking.status == "noshow") {
                        //     swal.fire("You did not check in between 3 pm to 3 am, no show charges already applied", "no show", "error")
                        // }

                        if (booking.status == "checkedin") {
                            swal.fire("You have already checked-in successfully", "Checked-in", "error")
                        }
                        else {

                            var dataToSend = {
                                status: "checkedin",
                                checkedInDate: checkInTime,
                            }
                            console.log("Data to send:", dataToSend)
                            await axios.put(`${ROOT_URL}/updateBookingCheckedIn/${booking.id}`, dataToSend)
                                .then((response) => {
                                    console.log("response", response)
                                    if (response.status == 200) {

                                        swal.fire({
                                            title: "You have checked-in successfully",
                                            text: "Checked-in",
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
                        }

                        //  swal.fire("You have checked-in successfully", "Checked-in", "success")

                        //axios call and save data, ask dhruvil or mili


                    }
                    console.log("================ENDS================check case 2:  no show ====================================ENDS=====")

                    console.log("=================case 3: checkout ======================")
                    //work here
                    console.log("========ENDS=========case 3: checkout ==================ENDS====")

                    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa






                    this.setState({
                        curSysTime: (new Date(response.data)).toLocaleString()
                    })

                    console.log(response.data);
                    console.log(moment(response.data));
                    console.log("CURRENT JAVASCRIPT TIME", moment());
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
                    {/* {(this.props.sendPropertyAsProps.bookingDetails.status === "checkedin" || this.props.sendPropertyAsProps.bookingDetails.status === "checkedout") ?
                        <div>
                            {this.props.sendPropertyAsProps.bookingDetails.status === "checkedin" ?
                                <div>
                                    when checked in
                                    <div>
                                        <PaymentTxn amt={this.state.data.bookingDetails.price + this.state.data.bookingDetails.noShowPenalty}
                                            propertyid={this.state.data.bookingDetails.propertyId}
                                            bookingid={this.state.data.bookingDetails.id}
                                        ></PaymentTxn>
                                    </div>
                                </div>
                                :
                                <div>
                                    when checkout
                                </div>}
                            <button class="btn btn-success btn-sm" disabled style={{ fontWeight: "bolder" }} >CheckIn</button>

                        </div>
                        :
                        <div>
                            when status is reserved or paid
                            {this.props.sendPropertyAsProps.bookingDetails.status === "paid" ?
                                <div> */}
                    {/* this means paid */}
                    {/* </div>
                                :
                                <div> */}
                    {/* when it is reserved */}
                    {/* 
                                    <button class="btn btn-success btn-sm" onClick={() => this.guestCheckIn(this.props.sendPropertyAsProps)} style={{ fontWeight: "bolder" }} >CheckIn</button>
                                </div>}
                        </div>
                    }

                </div> */}
                    <button class="btn btn-success btn-sm" onClick={() => this.guestCheckIn(this.props.sendPropertyAsProps)} style={{ fontWeight: "bolder" }} >CheckIn</button>
                </div>
            </div>
        )
    }
}