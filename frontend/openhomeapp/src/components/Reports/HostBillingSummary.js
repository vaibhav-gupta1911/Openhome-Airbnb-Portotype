import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './css/HostBillingSummary.css';
import { Tag, Table, Button } from 'antd';
import { ROOT_URL } from '../constants/constants';
import axios from 'axios';
import NavBarDark from '../NavBarDark/NavBarDark'
import { Select } from 'antd';
import { Redirect } from 'react-router';

const { Option } = Select;

var data3 = [];
var data4 = [];
var statefilter = [];
var months = [];
var data6 = [];

class HostBillingSummary extends React.Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        data5: []
    };

    getMonths() {
        var monthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var d = new Date();
        d.setDate(1);
        for (var i = 0; i <= 11; i++) {

            var m = {
                'key': d.getMonth() + ' ' + d.getFullYear(),
                'val': monthName[d.getMonth()] + ' ' + d.getFullYear()
            }

            months.push(m);
            console.log();
            d.setMonth(d.getMonth() - 1);
        }
    }




    componentDidMount() {

        this.fetchHostBillingSummary()
    }



    fetchHostBillingSummary() {

        console.log("USER", sessionStorage.getItem("userId"));

        var data = {
            userId: sessionStorage.getItem("userId")
        }


        var request = axios.post(`${ROOT_URL}/hostbillingsummary`, data)
            .then((response) => {
                console.log("response", response);
                if (response.status === 200) {
                    if (response.data) {
                        console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111111111")
                        data3 = response.data;



                        data3.forEach(v => {
                            console.log("ffffffffffffffffffffffffff",v)
                            var x = {
                                bookingid: v[0],
                                amount: v[1],
                                entrydate: new Date(v[2]).toString(),
                                key: v[3],
                                propertyid: v[4],
                                description: v[5],
                                address: v[8] + ", " + v[7] + ", " + v[6],
                                comment: v[9]
                            }

                            data4.push(x);

                        });

                        this.setState({
                            data5: data4
                        })


                        this.clearFilters();
                        console.log("success hostbillingsummary");
                        console.log(data4);
                        console.log("222222222222222222222222222222222222222222222222222222222222222222222222222222222222")

                    } else if (response.data.error) {
                        console.log("there is some error in fetching hostbillingsummary");
                        //document.getElementById("signIn-error").innerHTML = response.data.error;
                        console.log(response.data.error);
                    }
                }
            })
            .catch(error => {
                console.log("error", error);
            })
    }


    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };


    handleChange2 = (value) => {

        if (value === "All") {

            data6 = [];
            data3.forEach(v => {
                var x = {
                    bookingid: v[0],
                    amount: v[1],
                    entrydate: new Date(v[2]).toString(),
                    key: v[3],
                    propertyid: v[4],
                    description: v[5],
                    address: v[8] + ", " + v[7] + ", " + v[6],
                    comment: v[9]
                }

                data6.push(x);

            });


            this.setState({
                data5: data6
            })

            return;
        }

        console.log(`selected ${value}`);
        var m = value.split(" ");

        var v = parseInt(m[0]);
        var y = parseInt(m[1]);

        var start = new Date(y, v, 1);
        var end = new Date(y, v + 1, 0);

        console.log("start", start);
        console.log("end", start);

        data6 = [];
        data3.forEach(v => {
            var x = {
                bookingid: v[0],
                amount: v[1],
                entrydate: new Date(v[2]).toString(),
                key: v[3],
                propertyid: v[4],
                description: v[5],
                address: v[8] + ", " + v[7] + ", " + v[6],
                comment: v[9]
            }

            if (new Date(x.entrydate) >= start && new Date(x.entrydate) <= end)
                data6.push(x);

        });


        this.setState({
            data5: data6
        })

    }

    clearFilters = () => {
        this.setState({ filteredInfo: null });
    };

    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    };

    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    };
    renderRedirect = () => {
        if(!sessionStorage.getItem('userId')){
        console.log("user not logged in")
        return <Redirect to='/home' />      
        }
    }
    render() {
        var monthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var d = new Date();
        d.setDate(1);
        data3.forEach(v => {

            var x = {
                'text': v[6],
                'value': v[6]
            }
            statefilter.push(x);
        });

        var obj = {};

        for (var i = 0, len = statefilter.length; i < len; i++)
            obj[statefilter[i]['text']] = statefilter[i];

        statefilter = new Array();
        for (var key in obj)
            statefilter.push(obj[key]);



        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            
            
            
            
            {
                title: 'Txn Date',
                dataIndex: 'entrydate',
                key: 'entrydate',
                filters: [{ text: 'London', value: 'London' }, { text: 'New York', value: 'New York' }],
                filteredValue: filteredInfo.entrydate || null,
                onFilter: (value, record) => record.address.includes(value),
                sorter: (a, b) => a.address.length - b.address.length,
                sortOrder: sortedInfo.columnKey === 'entrydate' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                // sorter: (a, b) => a.amount - b.amount,
                // sortOrder: sortedInfo.columnKey === 'amount' && sortedInfo.order,
                // ellipsis: true
            },
            {
                title: 'Comment',
                dataIndex: 'comment',
                key: 'comment'
            },
            {
                title: 'Booking id',
                dataIndex: 'bookingid',
                key: 'bookingid',
                sorter: (a, b) => a.bookingid - b.bookingid,
                sortOrder: sortedInfo.columnKey === 'bookingid' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Propertyid',
                dataIndex: 'propertyid',
                key: 'propertyid',
                sorter: (a, b) => a.propertyid - b.propertyid,
                sortOrder: sortedInfo.columnKey === 'propertyid' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                filters: statefilter,//[{ text: 'Dallas', value: 'Dallas' }, { text: 'New York', value: 'New York' }],
                filteredValue: filteredInfo.address || null,
                onFilter: (value, record) => record.address.includes(value),
                sorter: (a, b) => a.address.length - b.address.length,
                sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
                ellipsis: true,
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                //filters: [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }],
                //filteredValue: filteredInfo.description || null,
                //onFilter: (value, record) => record.description.includes(value),
                sorter: (a, b) => a.description.length - b.description.length,
                sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
                ellipsis: true,
            },
        ];
        return (
            <div>
                <NavBarDark />
                {this.renderRedirect()}

                <div>

                    <div className="table-operations">
                        <Button onClick={this.clearFilters}>Clear filters</Button>
                        <Button onClick={this.clearAll}>Clear filters and sorters</Button>
                    </div>
                    <div>

                        <Select defaultValue="All" style={{ width: 120 }} onChange={this.handleChange2}>
                            <Option value="All">All</Option>
                            <Option value={d.getMonth() + ' ' + d.getFullYear()}>{monthName[d.getMonth()] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 1) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 1] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 2) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 2] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 3) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 3] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 4) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 4] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 5) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 5] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 6) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 6] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 7) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 7] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 8) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 8] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 9) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 9] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 10) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 10] + ' ' + d.getFullYear()}</Option>
                            <Option value={(d.getMonth() - 11) + ' ' + d.getFullYear()}>{monthName[d.getMonth() - 11] + ' ' + d.getFullYear()}</Option>

                        </Select>

                    </div>
                    <Table columns={columns} dataSource={this.state.data5} onChange={this.handleChange} />
                </div>
            </div>
        );
    }
}

export default HostBillingSummary;
