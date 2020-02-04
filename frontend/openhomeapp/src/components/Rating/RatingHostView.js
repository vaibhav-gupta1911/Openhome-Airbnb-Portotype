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
  
class RatingHostView extends Component {
    constructor() {
        super();
        this.state = {
         reviews :[],
         reviewsBy:[],
         reviewMapping :[],
         avgRating: 0,
         hostRating:0,
         hostReview:"",
         totalRating:0
        };
    }
    ratingHandler = (bookingId, e) =>{
		console.log("rating",e)
		console.log("clicked property" , bookingId)
		this.setState({
			hostRating:e
		})
		const data= {
			hostRating:e
		}
		 axios.put(`${ROOT_URL}/updatePropertyRatingByHost/${bookingId}`, data)
		.then((response) => {
			console.log("response", response)
		})
	}
	reviewHandler = (e) =>
	{
		console.log("this target" , e.target.value)
		this.setState ({
			hostReview : e.target.value
		})
    }
    
    submitReview = (bookingId) =>
	{
	console.log("clicked property" , bookingId)
		
		const data= {
			hostReview:this.state.hostReview
		}
		axios.put(`${ROOT_URL}/updatePropertyReviewByHost/${bookingId}`, data)
		.then((response) => {
			console.log("response", response)
			if(response.status==200)
			{
				swal.fire("Review submitted", "success" , "success")
			}
		})

		
	}
    componentDidMount()
    {
        var userId=sessionStorage.getItem("userId");
        axios.get(`${ROOT_URL}/fetchAverageRating/${userId}`)
		.then((response) => {
            console.log("response", response)
            for(var i=0; i<response.data.bookingDetails.length; i++)
            {
            if(response.data.bookingDetails[i].review !=null)
            {
                var reviews = this.state.reviews.concat(response.data.bookingDetails[i].review );
                var reviewsBy = this.state.reviewsBy.concat(response.data.bookingDetails[i].guestId);
                var mapping = this.state.reviewMapping.concat(response.data.bookingDetails[i])
                this.setState({
                    reviews: reviews,
                    reviewsBy: reviewsBy,
                    reviewMapping : mapping,
                    avgRating: response.data.avgRating,
                    totalRating :response.data.totalRating
                })

            }
        }
            console.log("reviws" , this.state.reviews)
            console.log("reviewsBy" , this.state.reviewsBy)
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
                <div> <Rate defaultValue={property.rating} disabled/> {property.review} </div>
                                </div>
                                <div className="displayRow">
                                    {/* <div id="below">{property.headline}</div>
                                    <div className="belowTitleView"><strong>{property.bedroom}</strong> BA|</div> */}
                                  <div></div>
                                </div>
                                <div className="float-right float-below ml-3">
									Rate Your Customer
									<Rate onChange={(e) => this.ratingHandler(property.id,e)}  defaultValue={property.hostrating} />
									<div>
                                        <TextArea rows={4} placeholder="write review" onChange={this.reviewHandler} defaultValue={property.hostreview}/>
                                        </div>
								
										<div className="float-left float-below ml-3">
										<button class="btn btn-success btn-sm"  style={{ fontWeight: "bolder" }} onClick={()=>this.submitReview(property.id)} >Review</button>
									
									</div>
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
                       <h2 align="center">Customer Reviews </h2>
            <h6>Average Rating Stars:  {this.state.avgRating}</h6>
            <h6>Total No of Ratings Recieved:  {this.state.totalRating}</h6>
                        {propertytList}
                    </div>
                </div >
            )

        }

    }
}

export default RatingHostView;