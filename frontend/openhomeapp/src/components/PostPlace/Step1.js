import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Form, Input, Button, Radio, PageHeader, Select, Divider, InputNumber, Icon } from 'antd';
import NavBarDark from '../NavBarDark/NavBarDark';
import swal from 'sweetalert2';
import { ROOT_URL } from '../constants/constants';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';


const { TextArea } = Input
const { Option } = Select;
let id = 0;

class Step1 extends Component {
  constructor() {
    super();
    this.state = {
      formLayout: 'horizontal',
      streetAddress: "",
      city: "",
      state: "California  ",
      zipcode: "",
      sharingType: "",
      propertyType: "",
      bedrooms: 0,
      totalSquareFootage: 0,
      roomSquareFootage: 0,
      privateBathroom: false,
      privateShower: false,
      weekdayPrice: 0,
      weekendPrice: 0,
      phoneNumber: "",
      description: "",
      pictureURLs: [],
      parking: "",
      parkingCharges: "Free",
      parkingFee: 0,
      availability: [],
      error: false
      //region: "California"
    };
    this.handlePostProperty = this.handlePostProperty.bind(this);
  }

  handleStreetAddress = (e) => {
    console.log('Street Address: ', e.target.value);
    this.setState({
      streetAddress: e.target.value
    })
  }

  handleCity = (e) => {
    console.log('City: ', e.target.value);
    this.setState({
      city: e.target.value
    })
  }

  handleState = (e) => {
    console.log('State: ', e.target.value);
    this.setState({
      state: e.target.value
    })
  }

  handleZipcode = (e) => {
    console.log('Zipcode: ', e);
    this.setState({
      zipcode: e
    })
  }

  handleSharingType = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      sharingType: e.target.value
    })
  }

  handlePropertyType = (e) => {
    console.log('Property Type: ', e);
    this.setState({
      propertyType: e
    })
  }

  handleBedrooms = (e) => {
    console.log('No of Bedrooms: ', e);
    if (e < 0 || e > 20) {
      document.getElementById("bedroom-error").innerHTML = "Please enter bedroom between 0 to 20 rooms"
    }
    else {
      document.getElementById("bedroom-error").innerHTML = ""
      this.setState({
        bedrooms: e
      })
    }

  }

  handleTotalSquareFootage = (e) => {
    console.log('Total Square Footage: ', e);
    if (e < 50 || e > 2000) {
      document.getElementById("ft-error").innerHTML = "Square foot should be atleast 50 and not more than 2000"
    }
    else {
      document.getElementById("ft-error").innerHTML = ""
      this.setState({
        totalSquareFootage: e
      })
    }
  }

  handleRoomSquareFootage = (e) => {
    console.log('Room Square Footage: ', e);
    if (e < 50 || e > 2000) {
      document.getElementById("room-error").innerHTML = "Square foot should be atleast 50 and not more than 2000"

    }
    else {
      document.getElementById("room-error").innerHTML = ""

      this.setState({
        roomSquareFootage: e
      })
    }
  }

  handlePrivateBathroom = (e) => {
    console.log('Private Bathroom: ', e.target.value);
    this.setState({
      privateBathroom: e.target.value
    })
  }

  handlePrivateShower = (e) => {
    console.log('Private Shower: ', e.target.value);
    this.setState({
      privateShower: e.target.value
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
      console.log('Weekday price: ', e);
      this.setState({
        weekdayPrice: e,
        error: false
      })

    }

  }

  handleWeekendPrice = (e) => {
    console.log('Weekend Price: ', e);
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
        error: false
      })
    }
  }

  handlePhoneNumber = (e) => {
    console.log('Phone Number: ', e);
    console.log("String(e).length ,", String (e).length)
    if( String(e).length<10)
    {
      console.log("if")
      document.getElementById("ph-err").innerHTML = "Please enter valid 10 digit Phone number";
      this.setState({ error: true })
    }
    else{
      console.log(" else ")
      document.getElementById("ph-err").innerHTML ="";
      this.setState({
        phoneNumber: e
      })
      this.setState({ error: false })
    }
  }

  handleDescription = (e) => {
    console.log('Description: ', e.target.value);
    this.setState({
      description: e.target.value
    })
  }

  handlePictureURLs = (k, e) => {
    console.log('Picture URLs: ', e.target.value);

    console.log("k::::", k)
    const pictureURLs = this.state.pictureURLs.slice()
    pictureURLs[k] = e.target.value

    console.log(this.state.pictureURLs[k])
    this.setState({
      pictureURLs: pictureURLs
    })
    console.log("Picture URLs:::", this.state.pictureURLs)
  }

  handleParking = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      parking: e.target.value
    }, () => {
      console.log("parking: ", this.state.parking)
      if (e.target.value === "false") {
        console.log("parking: ", this.state.parking)
        this.setState({
          parkingCharges: "Free",
          parkingFee: 0
        }, () => {
          console.log("Parking Charges:", this.state.parkingCharges === "Free")

          console.log("state parking fee", this.state.parkingFee)
        })

      }

    })

  }

  handleParkingCharge = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      parkingCharges: e.target.value
    }, () => {
      if (e.target.value === "Free") {
        this.setState({
          parkingFee: 0
        })
      }
      console.log("Parking Fee", this.state.parkingFee)
    })
  }

  handleParkingFee = (e) => {
    console.log('Parking Fee: ', e);
    this.setState({
      parkingFee: e
    })
  }

  handleInternet = (e) => {
    console.log('Internet: ', e.target.value);
    this.setState({
      internet: e.target.value
    })
  }

  handleAvailability = (e) => {
    console.log(`selected: ${e}`)
    this.setState({
      availability: e
    })
  }

  handleFormLayoutChange = e => {
    this.setState({ formLayout: e.target.value });
  };

  handlePostProperty = async e => {
    e.preventDefault();
    if(this.state.error)
    {
      document.getElementById("submit-err").innerHTML="Please enter valid fields."
      return
    }
    const _this = this
    this.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const pictures = this.state.pictureURLs.join()
      const weekdayPrice = parseFloat(this.state.weekdayPrice).toFixed(2)
      const weekendPrice = parseFloat(this.state.weekendPrice).toFixed(2)
      const parkingFee = parseFloat(this.state.parkingFee).toFixed(2)
      console.log(weekdayPrice)
      console.log(weekendPrice)
      console.log(parkingFee)
      const privateBathroom = (this.state.privateBathroom === "true")
      const privateShower = (this.state.privateShower === "true")
      const parking = (this.state.parking === "true")
      const internet = (this.state.internet === "true")
      const availability = this.state.availability
      const sunday = availability.includes("Sunday") ? -1 : 1
      const monday = availability.includes("Monday") ? -1 : 2
      const tuesday = availability.includes("Tuesday") ? -1 : 3
      const wednesday = availability.includes("Wednesday") ? -1 : 4
      const thursday = availability.includes("Thursday") ? -1 : 5
      const friday = availability.includes("Friday") ? -1 : 6
      const saturday = availability.includes("Saturday") ? -1 : 0
      const data = {
        userId: Number(sessionStorage.getItem("userId")),
        streetAddress: this.state.streetAddress,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
        sharingType: this.state.sharingType,
        propertyType: this.state.propertyType,
        totalBedrooms: this.state.bedrooms,
        totalSquareFootage: this.state.totalSquareFootage,
        roomSquareFootage: this.state.roomSquareFootage,
        privateBathroom: privateBathroom,
        privateShower: privateShower,
        weekdayPrice: parseFloat(weekdayPrice).toFixed(2),
        weekendPrice: parseFloat(weekendPrice).toFixed(2),
        // weekdayPrice: this.state.weekdayPrice,
        // weekendPrice: this.state.weekendPrice,        
        phoneNumber: this.state.phoneNumber,
        description: this.state.description,
        pictureUrl: pictures,
        parking: parking,
        dailyParkingFee: parseFloat(parkingFee).toFixed(2),
        internet: internet,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
      };
      console.log("Data::::", data)
      await axios.post(`${ROOT_URL}/postProperty`, data)
        .then(response => {
          console.log("response:", response)
          if (response.status === 200) {
            console.log("Property has been Posted")
            swal.fire("Property has been Posted !", "Successfully", "success").then(function (isConfirm) {
              if (isConfirm) {
                window.location.href = "http://34.230.8.86/:3000/viewproperties"
              } else {
                //if no clicked => do something else
              }
            })
          }
        }).catch(error => {
          console.log("=== error ==", error);
        })
      //     .then(response => {
      //   // Should format date value before submit.
      //   const rangeValue = fieldsValue['rangepicker'];
      //   const values = {
      //     ...fieldsValue,
      //     'rangepicker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
      //   };
      //   console.log('Received values of form: ', values);

      //   sessionStorage.setItem("startDate", values.rangepicker[0]);
      //   sessionStorage.setItem("endDate", values.rangepicker[1]);
      //   const data = {
      //     city: values.location,
      //     startDate: values.rangepicker[0],
      //     //i need to add this to UI, was not sure where is the use of this
      //     endDate: values.rangepicker[1],
      //   }

      //   console.log("data fetched from req: ", data)

      //   await axios.get('/getProperties/search', { params: data })
      //     .then(response => {
      //       console.log(response)
      //       if (response.status === 200)
      //         console.log("Response from java : ", response);
      //       _this.props.history.push({
      //         pathname: '/viewHomes',
      //         search: `?city=${data.city}&startDate=${data.startDate}&endDate=${data.endDate}`,
      //         state: { properties: response.data.propertyDetails }
      //       })
      //     })

    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });

    console.log("KKKKKK:", k)
    const pictureURLs = this.state.pictureURLs.slice()
    pictureURLs.splice(k, 1)
    console.log("After Remove:  ", pictureURLs)
    this.setState({
      pictureURLs: pictureURLs
    })

  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  onRegionChange = (val) => {
    this.setState({
      state: val
    })
  }

  renderRedirect = () => {
    if (!sessionStorage.getItem('userId')) {
      console.log("user not logged in")
      return <Redirect to='/home' />
    }
  }
  render() {

    console.log(new Date())
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 6 },
      },
    };

    const formItemLayoutWithOutLabel = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 9, offset: 0 },
        sm: { span: 6, offset: 3 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (

      <Form.Item
        {...index === 0 ? { ...formItemLayout } : { ...formItemLayoutWithOutLabel }}
        label={index === 0 ? 'Picture URLs' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input picture url or delete this field.",
            },
          ],
        })(<Input placeholder="Picture URL" onChange={(e) => this.handlePictureURLs(index, e)} value={this.state.pictureURLs[k]} style={{ width: '60%', marginRight: 8 }} />)
        }
        {
          keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null
        }
      </Form.Item >
    ));

    var parkingFeeField = null;
    if (this.state.parkingCharges != "Free") {
      parkingFeeField = <Form.Item label="Daily Parking Fee" {...formItemLayout} style={(this.state.parking !== 'true') ? { display: 'none' } : { display: '' }}>
        <InputNumber onChange={this.handleParkingFee} value={this.state.parkingFee} />
        <span className="ant-form-text"> USD</span>
      </Form.Item>
    }

    let viewForm = (<div>
      <Form style={{ marginLeft: 30 }} onSubmit={this.handlePostProperty}>
        <PageHeader title="Address Details" />
        <Form.Item label="Street Address" {...formItemLayout} onChange={this.handleStreetAddress}>
          {getFieldDecorator('streetAddress', {
            rules: [{ required: true, message: 'Please enter property street address!', whitespace: true }],
          })(
            <Input value={this.state.streetAddress} placeholder="Enter property's street address" />
          )}
        </Form.Item>
        <Form.Item label="City" {...formItemLayout} onChange={this.handleCity}>
          {getFieldDecorator(`city`, {
            rules: [
              {
                required: true,
                message: 'Please enter property street address!',
              },
            ],
          })
            (<Input placeholder="Enter property's city" value={this.state.city} />)}
        </Form.Item>
        <Form.Item label="State" {...formItemLayout} onChange={this.handleState}>

          <div>
            {/* <CountryDropdown
                value={country}
                onChange={(val) => this.selectCountry(val)} /> */}
            {getFieldDecorator(`state`, {
              rules: [
                {
                  required: true,
                  message: 'Please Select property state!',
                },
              ],
            })
              (<RegionDropdown
                country={"United States"}
                value={this.state.state}
                onChange={(val) => this.onRegionChange(val)}
              />)}
          </div>
          {/* <Input placeholder="Enter your state" value={this.state.state} /> */}
        </Form.Item>


        <Form.Item label="Zipcode" {...formItemLayout} >
          {getFieldDecorator(`zipcode`, {
            rules: [
              {
                required: true,
                message: 'Please enter property zipcode!',
              },
            ],
          })
            (<InputNumber style={{ width: '50%' }} placeholder="Enter property's zipcode" onChange={this.handleZipcode} value={this.state.zipcode} />)}
        </Form.Item>

        <Divider />

        <PageHeader title="Kind of Property" />
        <Form.Item label="Sharing Type" {...formItemLayout}>
          {getFieldDecorator("sharing", {
            rules: [{ required: true, message: "Please Select a Sharing Type!" }]
          })(
            <Radio.Group onChange={this.handleSharingType} value={this.state.sharingType}>
              <Radio value="Entire Place" wrapperCol={{ span: 3 }}>Entire Place</Radio>
              <Radio value="Private Room" warpperCol={{ span: 3 }}>Private Room</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Property Type" {...formItemLayout}>
          {/* Property Type */}
          {getFieldDecorator(`propertyType`, {
            rules: [
              {
                required: true,
                message: 'Please Select a Property Type!',
              },
            ],
          })
            (<Select style={{ width: '100%' }} placeholder="Select Property Type" onChange={this.handlePropertyType} name="propertyType" optionLabelProp="label" value={this.state.propertyType}>
              <Option value="House" label="House">House</Option>
              <Option value="Townhouse" label="Townhouse">Townhouse</Option>
              <Option value="Apartment" label="Condo/Apartment">Condo/Apartment</Option>
            </Select>)}
        </Form.Item>
        <Form.Item label="No. of Bedrooms" {...formItemLayout} style={(this.state.sharingType !== 'Entire Place') ? { display: 'none' } : { display: '' }}>
           
          {/* {getFieldDecorator(`bedrooms`, {
            rules: [
              {
                required: true,
                message: 'Please Enter Number of Bedrooms!',
              },
            ],
          }) */}
          <InputNumber onChange={this.handleBedrooms} value={this.state.bedrooms} placeholder="Enter No of Bedrooms" />
          <div id="bedroom-error" style={{ color: "red" }}></div>
        </Form.Item>
        <Form.Item label="Total Square Footage" {...formItemLayout} style={(this.state.sharingType !== 'Entire Place') ? { display: 'none' } : { display: '' }}>
          {/* {getFieldDecorator(`totalSquareFootage`, {
            rules: [
              {
                required: true,
                message: 'Please Enter Total Square Footage!',
              },
            ],
          }) */}
          <InputNumber onChange={this.handleTotalSquareFootage} value={this.state.totalSquareFootage} placeholder="Enter Total Square Footage" />
          <div id="ft-error" style={{ color: "red" }}> </div>
        </Form.Item>
        <Form.Item label="Room Square Footage" {...formItemLayout} style={(this.state.sharingType !== 'Private Room') ? { display: 'none' } : { display: '' }}>
          {/* {getFieldDecorator(`roomSquareFootage`, {
            rules: [
              {
                required: true,
                message: 'Please Enter Room Square Footage!',
              },
            ],
          }) */}
          <InputNumber onChange={this.handleRoomSquareFootage} value={this.state.roomSquareFootage} placeholder="Enter Room Square Footage" />
          <div id="room-error" style={{ color: "red" }}></div>
        </Form.Item>
        <Form.Item label="Private Bathroom" {...formItemLayout} style={(this.state.sharingType !== 'Private Room') ? { display: 'none' } : { display: '' }}>
          {/* {getFieldDecorator(`privateBathroom`, {
            rules: [
              {
                required: true,
                message: 'Please Select one Option!',
              },
            ],
          }) */}
          <Radio.Group onChange={this.handlePrivateBathroom} value={this.state.privateBathroom}>
            <Radio value="true" wrapperCol={{ span: 3 }}>Yes</Radio>
            <Radio value="false" warpperCol={{ span: 3 }}>No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Private Shower" {...formItemLayout} style={(this.state.sharingType !== 'Private Room') ? { display: 'none' } : { display: '' }}>
          {/* {getFieldDecorator(`privateShower`, {
            rules: [
              {
                required: true,
                message: 'Please Select one Option!',
              },
            ],
          }) */}
          <Radio.Group onChange={this.handlePrivateShower} value={this.state.privateShower}>
            <Radio value="true" wrapperCol={{ span: 3 }}>Yes</Radio>
            <Radio value="false" warpperCol={{ span: 3 }}>No</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider />

        <PageHeader title="Price of the Property" />
        <Form.Item label="Weekday Price" {...formItemLayout} >
          {getFieldDecorator(`weekdayPrice`, {
            rules: [
              {
                required: true,
                message: 'Please Enter Weekday Price!',
              },
            ],
          })
            (<InputNumber onChange={this.handleWeekdayPrice} value={this.state.weekdayPrice} />)}
          <span className="ant-form-text"> USD</span>
          <div id="weekday-error" style={{ color: "red" }}></div>
        </Form.Item>
        <Form.Item label="Weekend Price" {...formItemLayout}>
          {getFieldDecorator(`weekendPrice`, {
            rules: [
              {
                required: true,
                message: 'Please Enter Weekend Price!',
              },
            ],
          })
            (<InputNumber onChange={this.handleWeekendPrice} value={this.state.weekendPrice} />)}
          <span className="ant-form-text"> USD</span>
          <div id="weekend-error" style={{ color: "red" }}></div>
        </Form.Item>

        <Divider />

        <PageHeader title="About Property and Contact" />
        <Form.Item label="Phone Number" {...formItemLayout}>
          {getFieldDecorator(`phoneNumber`, {
            rules: [
              {
                required: true,
                message: '',
              },
            ],
          })
            (<InputNumber minLength={10} maxLength={10} style={{ width: '50%' }} onChange={this.handlePhoneNumber} value={this.state.phoneNumber} />)}
            <div id="ph-err" style={{ color: "red" }}></div>
        </Form.Item>
        <Form.Item label="Description" {...formItemLayout}>
          {getFieldDecorator(`description`, {
            rules: [
              {
                required: true,
                message: 'Please Enter Description!',
              },
            ],
          })
            (<TextArea autoSize={{ minRows: 2, maxRows: 6 }} onChange={this.handleDescription} value={this.state.description} />)}
        </Form.Item>

        <Divider />

        <PageHeader title="Photos" />
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add More Picture URLs
          </Button>
        </Form.Item>

        <Divider />

        <PageHeader title="Additional Details" />
        <Form.Item label="Parking" {...formItemLayout}>
          {getFieldDecorator("parking", {
            rules: [{ required: true, message: "Please Select a Parking Radio!" }]
          })(
            <Radio.Group onChange={this.handleParking} value={this.state.parking}>
              <Radio value="true" wrapperCol={{ span: 3 }}>Yes</Radio>
              <Radio value="false" warpperCol={{ span: 3 }}>No</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="Charges" {...formItemLayout} style={(this.state.parking !== 'true') ? { display: 'none' } : { display: '' }}>
          {/* {getFieldDecorator("charges", {
            rules: [{ required: true, message: "Please Select a Parking Charges!" }]
          })( */}
          <Radio.Group onChange={this.handleParkingCharge} value={this.state.parkingCharges}>
            <Radio value="Free" wrapperCol={{ span: 3 }} >Free</Radio>
            <Radio value="Extra Pay" warpperCol={{ span: 3 }}>Extra Pay</Radio>
          </Radio.Group>
          {/* )} */}
        </Form.Item>
        {parkingFeeField}
        <Form.Item label="Free Wifi" {...formItemLayout}>
          {getFieldDecorator("internet", {
            rules: [{ required: true, message: "Please Select Internet Option!" }]
          })(
            <Radio.Group onChange={this.handleInternet} value={this.state.internet}>
              <Radio value="true" wrapperCol={{ span: 3 }}>Yes</Radio>
              <Radio value="false" warpperCol={{ span: 3 }}>No</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {/* <Form.Item label="Checkin-Checkout" onChange={this.dateChangeHandler} >
            {getFieldDecorator('rangepicker', rangeConfig)(<RangePicker />)}
          </Form.Item> */}

        <Divider />

        <PageHeader title="Availability" />
        <Form.Item label="Availability" {...formItemLayout}>
          {/* Property Availability */}
          {getFieldDecorator("availability", {
            rules: [{ required: true, message: "Please Select Availability!" }]
          })(
            <Select mode="multiple" style={{ width: '100%' }} placeholder="Select Property Availability" defaultValue={[]} onChange={this.handleAvailability} name="availability" optionLabelProp="label">
              <Option value="Monday" label="Monday">Monday</Option>
              <Option value="Tuesday" label="Tuesday">Tuesday</Option>
              <Option value="Wednesday" label="Wednesday">Wednesday</Option>
              <Option value="Thursday" label="Thursday">Thursday</Option>
              <Option value="Friday" label="Friday">Friday</Option>
              <Option value="Saturday" label="Saturday">Saturday</Option>
              <Option value="Sunday" label="Sunday">Sunday</Option>
            </Select>)}
        </Form.Item>

        <Form.Item {...formItemLayout}>
          <Button type="primary" htmlType="submit"> Post Property </Button>
          <div id="submit-err" style={{ color: "red" }}></div>
        </Form.Item>
      </Form>
    </div>)
    return (

      <div>

        <NavBarDark />
        {this.renderRedirect()}

        <h3 className="ml-5 mt-2">Add a Listing</h3>
        {sessionStorage.getItem('isVerified') == "false"
          ? <div>
            <p> Please verify your account! </p>
          </div>
          :
          <div>
            {viewForm}

          </div>}


      </div>
    );
  }
}

Step1 = Form.create({ name: 'dynamic_form_item' })(Step1);
export default Form.create({ name: 'time_related_controls' })(Step1);