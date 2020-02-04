import { render } from 'react-dom';
import React, { Component } from 'react';
import CreditCard from './CreditCard';
import NumericInput from './NumericInput';
import { Tabs, Icon, Modal, Button, Checkbox, InputNumber, Alert } from 'antd';
import { ROOT_URL } from '../constants/constants';
import axios from 'axios';
import CreditCardInput from 'react-credit-card-input';
var moment = require('moment');

const NumberFormat = require('react-number-format');
const { TabPane } = Tabs;


class PaymentTxn extends Component {
  state = {
    loading: false,
    visible: false,
    name: '',
    cardNo: '',
    expiryMonth: '',
    expiryYear: '',
    savecard: false,
    cvv: '',
    sname: '',
    scardNo: '',
    sexpiryMonth: '',
    sexpiryYear: '',
    ssavecard: false,
    scvv: '',
    type: '',
    stype: '',
    amount: this.props.amt,
    propertyid: this.props.propertyid,
    bookingid: this.props.bookingid,
    tab: 1,
    aleart: '',
    msg: '',
    icon: '',
    visible2: "hidden",
    payvisible: false,

  };




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
      //amount: '10.00',
      // tab: 1,
      aleart: '',
      msg: '',
      icon: '',
      visible2: "hidden",
      tabbtn: 'Add',
      payvisible: false
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
          scardNo: "NO-CARD"
        });
      })


  }


  // componentDidMount() {
  //   console.log('FETCHING CARDS');
  //   var user = sessionStorage.getItem('userId');
  //   console.log(user);

  //   axios.get(`${ROOT_URL}/cards/${user}`)
  //     .then((response) => {
  //       console.log("response", response);
  //       if (response.status === 200) {
  //         if (response.data.cardNo) {
  //           console.log("success get cards");
  //           var card = response.data.cardNo.toString();


  //           this.setState({
  //             sid: response.data.id,
  //             scardNo: response.data.cardNo,
  //             sname: response.data.userName,
  //             sexpiryMonth: response.data.expiryMonth,
  //             sexpiryYear: response.data.expiryYear,
  //             ssavecard: response.data.ssavecard,
  //             scvv: response.data.cvv
  //           });


  //           if (card.charAt(0) == '4') {
  //             this.setState({
  //               stype: 'VISA'
  //             });
  //           }
  //           else if (card.charAt(0) == '2') {
  //             this.setState({
  //               stype: 'MASTERCARD'
  //             });
  //           }
  //           else {
  //             this.setState({
  //               stype: 'DISCOVER'
  //             });
  //           }

  //         } else if (response.data.error) {
  //           console.log("there is some error in fetching cards details");
  //           console.log(response.data.error);
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.log("error", error);
  //     })


  // }

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


  // paySubmit = (e) => {

  //   this.setState({ loading: true });
  //   //prevent page from refresh
  //   e.preventDefault();

  //   if (
  //     this.state.cardNo.toString().length != 16 ||
  //     this.state.cvv.toString().length != 3 ||
  //     this.state.name.toString().length < 2 ||
  //     this.state.expiryMonth.toString().length != 2 ||
  //     this.state.expiryYear.toString().length != 2
  //   ) {
  //     this.setState({
  //       visible2: "visible",
  //       aleart: "error",
  //       msg: "Please fill proper values.",
  //       icon: "true"
  //     })

  //     setTimeout(() => {
  //       this.setState({ loading: false });
  //     }, 1000);

  //     return;
  //   }
  //   else {

  //     this.setState({
  //       visible2: "visible",
  //       aleart: "success",
  //       msg: "Thanks for processing!!",
  //       icon: "true"
  //     })

  //   }

  //   var user = sessionStorage.getItem('userId');
  //   var mail = sessionStorage.getItem('email');

  //   if (this.state.tab == 1) {
  //     var data = {
  //       userName: this.state.name,
  //       cardNo: this.state.cardNo,
  //       expiryMonth: this.state.expiryMonth,
  //       expiryYear: this.state.expiryYear,
  //       saveCard: this.state.savecard,
  //       cvv: this.state.cvv,
  //       amount: this.state.amount,
  //       owner: user,
  //       email: mail
  //     }
  //   }
  //   else {
  //     var data = {
  //       userName: this.state.sname,
  //       cardNo: this.state.scardNo,
  //       expiryMonth: this.state.sexpiryMonth,
  //       expiryYear: this.state.sexpiryYear,
  //       saveCard: false,
  //       cvv: this.state.scvv,
  //       amount: this.state.amount,
  //       owner: user,
  //       email: mail
  //     }
  //   }

  //   const request = axios.post(`${ROOT_URL}/payments`, data)
  //     .then((response) => {
  //       console.log("response", response);
  //       if (response.status === 200) {
  //         if (response.data.userDetails) {
  //           console.log("success payment");
  //           this.props.history.push("/home")
  //         } else if (response.data.error) {
  //           console.log("there is some error in sign in which needs to be displayed to the user");
  //           //document.getElementById("signIn-error").innerHTML = response.data.error;
  //           console.log(response.data.error);
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.log("error", error);
  //     })

  //   setTimeout(() => {
  //     this.setState({ loading: false, visible: false });
  //   }, 3000);

  //   //}
  // }



  paySubmit = (e) => {
    axios.get(`${ROOT_URL}/systemdate`)
      .then((response) => {
        console.log("response", response)
        if (response.data) {

          //aaaaaaaaaaaaaaaaaaaaaaaaaaaa


          this.setState({ loading: true });
          //prevent page from refresh
          var user = sessionStorage.getItem('userId');
          var mail = sessionStorage.getItem('email');
          console.log("inside payment");

          var currentDate = moment(response.data);


          if (this.state.tab == 1) {
            console.log("inside payment 1");
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
              });

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
              });

              var data = {
                userName: this.state.name,
                entryDate: currentDate,
                cardNo: this.state.cardNo,
                expiryMonth: this.state.expiryMonth,
                expiryYear: this.state.expiryYear,
                saveCard: this.state.savecard,
                cvv: this.state.cvv,
                amount: this.state.amount,
                propertyid: this.state.propertyid,
                bookingid: this.state.bookingid,
                owner: user,
                email: mail,
                reason: "BOOKING"
              };

            }

          }
          else {
            console.log("inside payment 2");
            var data = {
              userName: this.state.sname,
              entryDate: currentDate,
              cardNo: this.state.scardNo,
              expiryMonth: this.state.sexpiryMonth,
              expiryYear: this.state.sexpiryYear,
              saveCard: false,
              cvv: this.state.scvv,
              amount: this.state.amount,
              propertyid: this.state.propertyid,
              bookingid: this.state.bookingid,
              owner: user,
              email: mail,
              reason: "BOOKING"
            };

          }


          e.preventDefault();


          const request = axios.post(`${ROOT_URL}/payments`, data)
            .then((response) => {
              console.log("response", response);
              if (response.status === 200) {
                if (response.data.userDetails) {
                  console.log("success payment for user ", response.data.userDetails);
                  //this.props.history.push("/home")
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

          setTimeout(() => {
            this.setState({ loading: false, visible: false });
            window.location.reload();
          }, 3000);



          //aaaaaaaaaaaaaaaaaaaaaaaaaaaa

          
          console.log(response.data);
          // console.log(moment(response.data));
          // console.log("CURRENT JAVASCRIPT TIME", moment());
        }
      })
      .catch(error => {
        console.log("=====errror", error)
      });



  }



  onTabChange = e => {
    if (this.state.tab == 2)
      var c = 1;
    else
      var c = 2;

    this.setState({
      tab: c
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
        <Button type="primary" onClick={this.showModal}>
          Make Payment
        </Button>
        <Modal
          visible={visible}
          title="Payment Gateway"
          onOk={this.handleOk}
          onCancel={this.handleCancel}

          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button disabled={this.state.payvisible} key="submit" type="primary" loading={loading} onClick={this.paySubmit}>
              Pay
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
                      Card Details
              </span>
                  }
                  key="1"
                >

                  <div>
                    {/* 
                    <CreditCardInput
                      cardNumberInputProps={{ value: this.state.cardNo, onChange: this.onNumberChange }}
                      cardExpiryInputProps={{ value: this.state.expiryMonth, onChange: this.onexpiryYearChange }}
                      cardCVCInputProps={{ value: this.state.cvv, onChange: this.oncvvChange }}
                      fieldClassName="input"
                    /> */}

                    {/* <div>
                      <InputNumber
                        defaultValue={100}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        // onChange={onChange}
                        disabled
                      />
                    </div> */}

                    <div class="block">
                      <label>Amount:</label>
                      <input displayType={'text'} maxlength="50" size="10" value={'$ ' + this.state.amount} name="amount" />
                    </div>



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
                        number={this.state.cardNo}//toString() == "NO-CARD" ? '**NO CARD**' : '************' + this.state.scardNo.toString().substr(this.state.scardNo.toString().length - 4)}
                        cvv={this.state.cvv}
                        expiry={this.state.expiryMonth + "/" + this.state.expiryYear}
                      />
                    </div>
                    <div>
                      Save Card
                    <Checkbox checked={this.state.savecard} onChange={this.onSaveCardChange}></Checkbox>
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

                  <div class="block">
                    <label>Amount:</label>
                    <input displayType={'text'} maxlength="50" size="10" value={'$ ' + this.state.amount} name="amount" />
                  </div>

                  <div>
                    <CreditCard
                      type={this.state.stype}
                      name={this.state.sname}
                      number={this.state.scardNo.toString() == "NO-CARD" ? '**NO CARD**' : '************' + this.state.scardNo.toString().substr(this.state.scardNo.toString().length - 4)}
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

export default PaymentTxn;


