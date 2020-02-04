import { render } from 'react-dom';
import React, { Component } from 'react';
import CreditCard from './CreditCard';
import NumericInput from './NumericInput';
import { Tabs, Icon, Modal, Button, Checkbox, InputNumber, Alert } from 'antd';
import { ROOT_URL } from '../constants/constants';
import axios from 'axios';
import CreditCardInput from 'react-credit-card-input';


const NumberFormat = require('react-number-format');
const { TabPane } = Tabs;


class AddPayment extends Component {
    state = {
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
        })
        
        console.log('FETCHING CARDS');
        var user = sessionStorage.getItem('userId');
        console.log(user);

        axios.get(`${ROOT_URL}/cards/${user}`)
            .then((response) => {
                console.log("response", response);
                if (response.status === 200) {
                    if (response.data.cardNo) {
                        console.log("success get cards");
                        var card = response.data.cardNo.toString();

                        this.setState({
                            sid: response.data.id,
                            scardNo: response.data.cardNo,
                            sname: response.data.userName,
                            sexpiryMonth: response.data.expiryMonth,
                            sexpiryYear: response.data.expiryYear,
                            ssavecard: response.data.ssavecard,
                            scvv: response.data.cvv
                        });

                        if (card.charAt(0) == '4') {
                            this.setState({
                                stype: 'VISA'
                            });
                        }
                        else if (card.charAt(0) == '2') {
                            this.setState({
                                stype: 'MASTERCARD'
                            });
                        }
                        else {
                            this.setState({
                                stype: 'DISCOVER'
                            });
                        }

                    } else if (response.data.error) {
                        console.log("there is some error in fetching cards details");
                        console.log(response.data.error);
                    }
                }
            })
            .catch(error => {
                console.log("error", error);
                this.setState({
                    scardNo: "NO-CARD",
                });
            })


    }

    onNumberChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            //this.props.onChange(value);
            this.setState({
                cardNo: e.target.value
            });
            if (e.target.value.toString().charAt(0) == '4') {
                this.setState({
                    type: 'VISA'
                });
            }
            else if (e.target.value.toString().charAt(0) == '2') {
                this.setState({
                    type: 'MASTERCARD'
                });
            }
            else {
                this.setState({
                    type: 'DISCOVER'
                });
            }

        }
    };

    onNameChange = e => {
        const { value } = e.target;
        var reg = /^[a-zA-Z ]{1,30}$/;
        if (reg.test(value)) {
            this.setState({
                name: e.target.value
            });
        }
    };

    onexpiryMonthChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            //this.props.onChange(value);
            if (e.target.value <= 12) {
                this.setState({
                    expiryMonth: e.target.value
                });
            }
        }
    };

    onexpiryYearChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            //this.props.onChange(value);
            if (e.target.value <= 9 || (e.target.value >= 20 && e.target.value <= 30)) {
                this.setState({
                    expiryYear: e.target.value
                });
            }
        }
    };

    oncvvChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            //this.props.onChange(value);
            this.setState({
                cvv: e.target.value
            });
        }
    };

    onSaveCardChange = e => {
        this.setState({ savecard: e.target.checked });
    };


    paySubmit = (e) => {

        console.log("TEST PAY SUBMIT");
        console.log(sessionStorage.getItem('userId'));
        console.log(sessionStorage.getItem('email'));

        this.setState({ loading: true });
        //prevent page from refresh
        //e.preventDefault();

        if (this.state.tab == 1) {

            if (
                this.state.cardNo.toString().length != 16 ||
                this.state.cvv.toString().length != 3 ||
                this.state.name.toString().length < 2 ||
                this.state.expiryMonth.toString().length != 2 ||
                this.state.expiryYear.toString().length != 2
            ) {
                this.setState({
                    visible2: "visible",
                    aleart: "error",
                    msg: "Please fill proper values.",
                    icon: "true"
                })

                setTimeout(() => {
                    this.setState({ loading: false });
                }, 1000);

                return;
            }
            else {

                this.setState({
                    visible2: "visible",
                    aleart: "success",
                    msg: "Thanks for processing!!",
                    icon: "true"
                })

            }

            console.log("Adding card");
            var data = {
                owner:sessionStorage.getItem('userId'),
                email:sessionStorage.getItem('email'),
                userName: this.state.name,
                cardNo: this.state.cardNo,
                expiryMonth: this.state.expiryMonth,
                expiryYear: this.state.expiryYear,
                cvv: this.state.cvv,
            }

            var request = axios.post(`${ROOT_URL}/addcard`, data)
                .then((response) => {
                    console.log("response", response);
                    if (response.status === 200) {
                        if (response.data.userDetails) {
                            console.log("SUCCESS CARA ADD");
                            this.props.history.push("/home")
                        } else if (response.data.error) {
                            console.log("FAILED CARD ADD");
                            //document.getElementById("signIn-error").innerHTML = response.data.error;
                            console.log(response.data.error);
                        }
                    }
                })
                .catch(error => {
                    console.log("error", error);
                })

        }
        else {

            console.log("Deleteing card");
            var data = {
                id: this.state.sid,
                userName: this.state.sname,
                cardNo: this.state.scardNo,
                expiryMonth: this.state.sexpiryMonth,
                expiryYear: this.state.sexpiryYear,
                cvv: this.state.scvv,
                owner:sessionStorage.getItem('userId'),
                email:sessionStorage.getItem('email'),
            }

            var request = axios.post(`${ROOT_URL}/deletecard`, data)
                .then((response) => {
                    console.log("response", response);
                    if (response.status === 200) {
                        if (response.data.userDetails) {
                            console.log("success payment");
                            this.props.history.push("/home")
                        } else if (response.data.error) {
                            console.log("there is some error in sign in which needs to be displayed to the user");
                            //document.getElementById("signIn-error").innerHTML = response.data.error;
                            console.log(response.data.error);
                        }
                    }
                })
                .catch(error => {
                    console.log("error", error);
                })
        }


        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);

        //}
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onTabChange = e => {
        if (this.state.tab == 2) {
            var tb = 'Add';
            var c = 1;
        }
        else {
            var c = 2;
            var tb = 'Remove';
        }


        this.setState({
            tab: c,
            tabbtn: tb
        });


        console.log("TAB Change", c)
    }

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


    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <a className="nav-link active font-weight-bold text-red " onClick={this.showModal}>Manage Payment Options</a>
                <Modal
                    visible={visible}
                    title="Payment Options"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Cancel
            </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.paySubmit}>
                            {this.state.tabbtn}
                        </Button>,
                    ]}
                >
                    <div className='demo-container'>
                        <div>
                            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="bank" />
                                            Add Card Details
              </span>
                                    }
                                    key="1"
                                >
                                    <div>

                                        <div class="block">
                                            <label>Name:</label>
                                            <input type="text" maxlength="50" size="16" value={this.state.name} name="name" onChange={this.onNameChange} />
                                        </div>


                                        <div class="block">
                                            <label>CardNo:</label>
                                            <input type="text" maxlength="16" size="16" value={this.state.cardNo} name="cardNo" onChange={this.onNumberChange} />
                                        </div>


                                        <div class="block">
                                            <label>Expiry:</label>
                                            <input type="text" maxlength="2" size="2" value={this.state.expiryMonth} name="expiryMonth" onChange={this.onexpiryMonthChange} />
                                            <input type="text" maxlength="2" size="2" value={this.state.expiryYear} name="expiryYear" onChange={this.onexpiryYearChange} />
                                        </div>

                                        <div class="block">
                                            <label>CVV:</label>
                                            <input type="text" maxlength="3" size="3" value={this.state.cvv} name="cvv" onChange={this.oncvvChange} />

                                        </div>

                                        <div >
                                            <Alert style={{ visibility: this.state.visible2 }} message={this.state.msg} type={this.state.aleart} showIcon={this.state.icon} />
                                        </div>

                                    </div>


                                    <div>
                                        <div>
                                            <CreditCard
                                                type={this.state.type}
                                                name={this.state.name}
                                                number={this.state.cardNo}
                                                cvv={this.state.cvv}
                                                expiry={this.state.expiryMonth + "/" + this.state.expiryYear}
                                            />
                                        </div>

                                    </div>

                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="wallet" />
                                            Saved Card
              </span>
                                    }
                                    key="2"
                                >
                                    <div>
                                        <CreditCard
                                            type={this.state.stype}
                                            name={this.state.sname}
                                            number={ this.state.scardNo.toString() == "NO-CARD"? '**NO CARD**' : '************' + this.state.scardNo.toString().substr(this.state.scardNo.toString().length - 4)}
                                            cvv={this.state.scvv}
                                            expiry={this.state.sexpiryMonth + "/" + this.state.sexpiryYear}
                                        />
                                    </div>

                                </TabPane>
                            </Tabs>
                        </div>

                    </div>

                </Modal>
            </div>
        );
    }
}

export default AddPayment;


