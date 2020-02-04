import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import IncreaseTime from '../TimeAdvancement/IncreaseTime';
import AddPayment from '../Payment/AddPayment';
import './NavBarDark.css'
import { ROOT_URL } from '../constants/constants';


class NavBarDark extends Component {

	handleLogout = () => {
		sessionStorage.clear();
	}

	render() {

		let name = null;
		if (sessionStorage.getItem('email')) {
			console.log("user is logged in", sessionStorage.getItem('email'));
			if (sessionStorage.getItem('type') === "Guest" || sessionStorage.getItem('type') === "guest") {
				name = (
					<div>
						<ul className="nav navbar-nav navbar-right">

							<li>
								<IncreaseTime></IncreaseTime>

							</li>
							
							<li>
								<AddPayment></AddPayment>
								{/* <a className="nav-link active font-weight-bold text-white " href="/home" onClick={this.handleAddPayment}>Add Payment Method</a> */}
							</li>
								
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/home">Search</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/cancelReservation">Cancel Reservation</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/showRatingGuestView">Show My Ratings</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/viewReservations">View Reservations</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/guestBillingSummary">Billing Summary</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/home" onClick={this.handleLogout}>Logout</a>
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
								<a className="nav-link active font-weight-bold text-danger " href="/step1">Post a Property</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/hostReservationHistory">History </a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/showrating">View Reviews</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/viewproperties">View Listed Properties</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/cancelReservationHost">Cancel Reservation</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/hostbillingsummary">Billing Summary</a>
							</li>
							<li>
								<a className="nav-link active font-weight-bold text-danger " href="/home" onClick={this.handleLogout}>Logout</a>
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
							<a className="nav-link active font-weight-bold text-danger " href="/register">Sign Up</a>
						</li>
						<li>
							<a className="nav-link active font-weight-bold text-danger " href="/signIn">Log In</a>
						</li>
					</ul>
				</div>

			)

		}
		return (
			<div>
				<nav className="navbar navbar-default navbar-expand-sm dark-bg">
					<div className="container-fluid ">

						<div className="navbar-header">
							<a href="/home" className="navbar-brand"><h1 className="font-weight-normal text-danger">OpenHome</h1></a>
						</div>
						<div>
							<ul className="nav navbar-nav navbar-right">
								<li>
									<p className="nav-link active font-weight-bold text-danger "> $ USD</p>
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
export default NavBarDark;

