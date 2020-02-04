import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'
import { ROOT_URL } from '../constants/constants';
import AddPayment from '../Payment/AddPayment';
import IncreaseTime from '../TimeAdvancement/IncreaseTime';
import * as firebase from 'firebase/app';
import config from '../Firebase/firebaseConfig';
import 'firebase/auth';
import firebaseApp from '../Firebase/SignIn'

// const firebaseApp = firebase.initializeApp(config);

class NavBar extends Component {

	handleLogout = () => {
		// if(sessionStorage.getItem('userFromGoogleLogin')){
		// 	console.log("user from google ")
		// 	firebaseApp.auth().signOut().then(function () {
		// 		// Sign-out successful.
		// 		sessionStorage.clear();
		// 		console.log("signed out successfully");
		// 	  }).catch(function (error) {
		// 		// An error happened.
		// 		console.log(error)
		// 	  });
		// }
		sessionStorage.clear();

	}


	handleAddPayment = () => {
		this.props.history.push(`http://34.230.8.86:3000/payment`);
		// <Route path="/payment" component={Payment}/>
	}

	render() {
		let name = null;
		if (sessionStorage.getItem('email')) {
			console.log("user is logged in", sessionStorage.getItem('email'));
			let a = sessionStorage.getItem('email');

			console.log("show logout button , add payment button");
			if (sessionStorage.getItem('type') === "Guest" || sessionStorage.getItem('type') === "guest") {
				name = (
					<div>
						<ul className="nav navbar-nav navbar-right">
							<li>
								<IncreaseTime></IncreaseTime>
								{/* <a className="nav-link active font-weight-bold text-white " href="/home" onClick={this.handleAddPayment}>Add Payment Method</a> */}
							</li>
							<li>
								<AddPayment></AddPayment>
								{/* <a className="nav-link active font-weight-bold text-white " href="/home" onClick={this.handleAddPayment}>Add Payment Method</a> */}
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/home">Search</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/cancelReservation">Cancel Reservation</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/showRatingGuestView">Show My Ratings</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/viewReservations">View Reservations</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/guestBillingSummary">Billing Summary</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/home" onClick={this.handleLogout}>Logout</a>
							</li>
						</ul>
					</div>
				)
			} else if (sessionStorage.getItem('type') === "Host" || sessionStorage.getItem('type') === "host") {
				name = (
					<div>
						<ul className="nav navbar-nav navbar-right">
							<li>
								<IncreaseTime></IncreaseTime>

							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/step1">Post a Property</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/hostReservationHistory">History </a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/showrating">View Reviews </a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/viewproperties">View Listed Properties</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/cancelReservationHost">Cancel Reservation</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/hostbillingsummary">Billing Summary</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-white " href="/home" onClick={this.handleLogout}>Logout</a>
							</li>
						</ul>
					</div>
				)
			} else {
				console.log("unknown user type");
			}
		} else {
			console.log("show login button");
			name = (
				<div>
					<ul className="nav navbar-nav navbar-right">
						<li>
							<a className="nav-link active font-weight-bold text-white " href="/register">Sign Up</a>
						</li>
						<li>
							<a className="nav-link active font-weight-bold text-white " href="/signIn">Log In</a>
						</li>
					</ul>
				</div>

			)

		}
		return (

			<div>
				<nav className="navbar navbar-default navbar-expand-sm">
					<div className="container-fluid ">

						<div className="navbar-header">
							<a href="/home" className="navbar-brand"><h1 className="font-weight-normal text-white">OpenHome</h1></a>
						</div>
						<div>
							<ul className="nav navbar-nav navbar-right">
								<li>
									<p className="nav-link active font-weight-bold text-white "> $ USD</p>
								</li>
								{name}
							</ul>
						</div>
					</div>
				</nav>
			</div>

			// main content

		)
	}
}


//export Login Component
export default NavBar;

