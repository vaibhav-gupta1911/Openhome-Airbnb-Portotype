import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import { Tabs, Icon, Modal, Button, Checkbox, InputNumber, Alert } from 'antd';
import Moment from 'react-moment';
import DateTimePicker from 'react-datetime-picker';
import { ROOT_URL } from '../constants/constants';
import Datetime from 'react-datetime'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimeField from 'react-simple-timefield';
//import TimePicker from 'react-time-picker';
import TimePicker from 'react-time-picker/dist/entry.nostyle'
//import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import NavBarDark from '../NavBarDark/NavBarDark';


require('react-datetime');
var moment = require('moment');
moment().format();


const NumberFormat = require('react-number-format');
const { TabPane } = Tabs;


class IncreaseTIme extends Component {
    state = {
        curTime: new Date(),
        timediff: '',
        curSysTime: '',
        startDate: new Date(),
        time: '10:00',
        milsec: 0,

        loading: false,
        visible: false,
        name: '',
        cardNo: '',
        expiryMonth: '',
        expiryYear: '',
        savecard: false,
        cvv: '',
        sid: '',
        sname: '',
        scardNo: '',
        sexpiryMonth: '',
        sexpiryYear: '',
        ssavecard: false,
        scvv: '',
        type: '',
        stype: '',
        amount: '10.00',
        tab: 1,
        aleart: '',
        msg: '',
        icon: '',
        visible2: "hidden",
        tabbtn: 'Add'
    };

    componentDidMount() {
    }

    FetchSavedCard() {

        this.setState({
            loading: false,
            name: '',
            cardNo: '',
            expiryMonth: '',
            expiryYear: '',
            savecard: false,
            cvv: '',
            sid: '',
            sname: '',
            scardNo: '',
            sexpiryMonth: '',
            sexpiryYear: '',
            ssavecard: false,
            scvv: '',
            type: '',
            stype: '',
            amount: '10.00',
            // tab: 1,
            aleart: '',
            msg: '',
            icon: '',
            visible2: "hidden",
            tabbtn: 'Add'
        });
    }



    // onNameChange = e => {
    //     const { value } = e.target;
    //     var reg = /^[a-zA-Z ]{1,30}$/;
    //     if (reg.test(value)) {
    //         this.setState({
    //             name: e.target.value
    //         });
    //     }
    // };



    showModal = () => {
        this.setState({
            visible: true,
        });

        this.FetchSavedCard();

    };

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };


    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    onChange = time => this.setState({ time })


    onTimeChange = (event, time) => {
        this.setState({ time });
    }


    componentDidMount() {
        this.getSystemTime();

        console.log("/////////////////", this.state.curSysTime);


        setInterval(() => {
            this.setState({
                curTime: new Date((new Date()).getTime() + this.state.milsec).toLocaleString()
            })
        }, 1000)

    }

    getSystemTime = () => {

        axios.get(`${ROOT_URL}/systemdate`)
            .then((response) => {
                console.log("response", response)
                if (response.data) {

                    this.setState({
                        curSysTime: (new Date(response.data)).toLocaleString()
                    })

                    var mils = (new Date(this.state.curSysTime)).getTime() - (new Date()).getTime();

                    this.setState({
                        milsec: mils
                    })


                    console.log("/////////////////MILS", mils);

                    console.log(response.data);
                    console.log(moment(response.data));
                    console.log("CURRENT JAVASCRIPT TIME", moment());
                }
            })
            .catch(error => {
                console.log("=====errror", error)
            });
    }

    setSystemTime = () => {

        //this.setState({ loading: true });
        var d = this.state.startDate;
        var t = this.state.time.split(":");

        console.log("TIMEEEE", d.getFullYear());
        console.log("TIMEEEE", d.getMonth());
        console.log("TIMEEEE", d.getDate());

        var date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t[0], t[1], 0);

        console.log("DATE - ", this.state.startDate);
        console.log("Advance DATE - ", date);

        // var d = new Date().getTime() + 60000;
        // var d = new Date();
        // var d = moment(currentDate, 'YYYY-MM-DD h:mm A') ;
        // d.add(1, 'days');

        this.setState({
            curSysTime: date,
            milsec: date.getTime() - (new Date()).getTime()
        })

        var data = {
            "date": date.getTime()
        }


        axios.post(`${ROOT_URL}/systemdate`, data)
            .then((response) => {
                console.log("response", response)
                if (response.data) {
                    console.log("dddddddddddd", d);
                    console.log(response.data);
                    console.log(moment(response.data));
                    console.log("CURRENT JAVASCRIPT TIME", moment());
                }
                if(response.status === 200){
                    this.setState({visible: false})
                }
            })
            .catch(error => {
                console.log("=====errror", error)
            })

        // setTimeout(() => {
        //     this.setState({ loading: false });
        // }, 2000);
    }


    setCurrent = () => {

       // this.setState({ loading: true });
        var date = new Date();

        this.setState({
            curSysTime: date,
            milsec: 0
        })

        var data = {
            "date": date.getTime()
        }

        axios.post(`${ROOT_URL}/systemdate`, data)
            .then((response) => {
                console.log("response", response)
                if (response.data) {

                }
            })
            .catch(error => {
                console.log("=====errror", error)
            })


        // setTimeout(() => {
        //     this.setState({ loading: false });
        // }, 2000);
    }


    render() {
        const { visible, loading } = this.state;
        const { time } = this.state;
        return (
            <div>
                <a className="nav-link active font-weight-bold text-red " onClick={this.showModal}>Time Advancement</a>
                <Modal
                    visible={visible}
                    title="TIME ADVANCEMENT"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.setSystemTime}>
                            Modify
                        </Button>,
                        // <Button key="submit" type="primary" loading={loading} onClick={this.setCurrent}>
                        //     Current
                        // </Button>,
                    ]}
                >
                    <div className='demo-container'>
                        <div>
                            <div class="block">
                                <label>Select Date:</label>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleChange}
                                    minDate={new Date()}
                                />
                            </div>

                            <div class="block">
                                <label>Select Time:</label>
                                <TimeField
                                    input={<input type="text" maxlength="10" size="5" />}
                                    value={this.state.time}
                                    onChange={this.onTimeChange} />
                            </div>

                            <div>
                                <p style={{ color: "red" }}>Current Time:</p>
                                <input style={{ color: "red" }} type="text" maxlength="50" size="20" value={this.state.curTime} />
                            </div>


                        </div>

                    </div>

                </Modal>
            </div>
        );
    }
}

export default IncreaseTIme;
