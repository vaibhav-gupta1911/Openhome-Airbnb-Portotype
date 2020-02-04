import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import NavBarDark from '../NavBarDark/NavBarDark';
import { ROOT_URL } from '../constants/constants';
import { Comment, Tooltip, List } from 'antd';
import moment from 'moment';
import {  Avatar , Rate, Input} from 'antd';
import swal from 'sweetalert2';

const { TextArea } = Input;
  
class RatingGuestView extends Component {
    constructor() {
        super();
        this.state = {
         reviews :[],
        //  reviewsBy:[],
         reviewMapping :[],
         avgRating: 0,
         hostRating:0,
         hostReview:"",
         totalRating:0
        };
    }
    
    componentDidMount()
    {
        var userId=sessionStorage.getItem("userId");
        axios.get(`${ROOT_URL}/fetchGuestAverageRating/${userId}`)
		.then((response) => {
            console.log("response", response)
            for(var i=0; i<response.data.bookingDetails.length; i++)
            {
            if(response.data.bookingDetails[i].hostreview !=null)
            {
                var reviews = this.state.reviews.concat(response.data.bookingDetails[i].hostreview );
                // var reviewsBy = this.state.reviewsBy.concat(response.data.bookingDetails[i].guestId);
                var mapping = this.state.reviewMapping.concat(response.data.bookingDetails[i])
                this.setState({
                    reviews: reviews,
                    // reviewsBy: reviewsBy,
                    reviewMapping : mapping,
                    avgRating: response.data.avgRating,
                    totalRating :response.data.totalRating
                })

            }
        }
            console.log("reviws" , this.state.reviews)
            // console.log("reviewsBy" , this.state.reviewsBy)
           console.log("mapping" , this.state.reviewMapping)
		}) 
    }
  
 
      render(){
        let propertytList;


        propertytList = this.state.reviewMapping.map(property => {

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
                            <div className="col-sm-2" >

                            
                                {/* <img src={this.state.imagesPreview} height="100px" /> */}
                                <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
                            </div>
                            <div className="col-sm-10 nameview">
                                <div>
                                    Booking # {property.id}
                <div> <Rate defaultValue={property.hostrating} disabled/> {property.hostreview} </div>
                                </div>
                                <div className="displayRow">
                                    {/* <div id="below">{property.headline}</div>
                                    <div className="belowTitleView"><strong>{property.bedroom}</strong> BA|</div> */}
                                  <div></div>
                                </div>
                                

                                <div className="priceview">
                                    {/* <span>{property.bathroom}</span> Per night */}
                         </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        });

        if (this.state.reviewMapping != null) {
            return (

                <div>
                    <div className="main-property-div" style={{ backgroundColor: '#f7f7f8' }}>
                       
                       <NavBarDark></NavBarDark>
                       <h2 align="center">Owner Reviews </h2>
                       <h6>Average Rating Stars:  {this.state.avgRating}</h6>
            <h6>Total No of Ratings Received:  {this.state.totalRating}</h6>
                        {propertytList}
                    </div>
                </div >
            )

        }

    }
}

export default RatingGuestView;