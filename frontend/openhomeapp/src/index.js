import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Register from './components/SignUp/register'

import SignIn from './components/Firebase/SignIn';
import HomePage from './components/HomePage/HomePage';
import Payment from './components/Payment/PaymentTxn';
import NewPayment from './components/Payment/NewPayment';
import ViewHomes from './components/Search/ViewHomes';
import HomeDetails from './components/Search/HomeDetails';
import CancelReservationGuest from './components/Reservations/CancelReservationGuest';
import Step1 from './components/PostPlace/Step1'
import CancelReservationHost from './components/Host/Reservation/CancelReservationHost';
import ViewProperties from './components/Host/Reservation/ViewPropertiesHost';
import ViewReservationGuest from './components/Reservations/ViewReservationGuest';
import HostBillingSummary from './components/Reports/HostBillingSummary';
import GuestBillingSummary from './components/Reports/GuestBillingSummary';
import SimpleMaps from './components/Maps/SimpleMap';
import TimeAdvancement from './components/TimeAdvancement/IncreaseTime';
import HistoryHost from './components/Host/Reservation/History';
import RatingHostView from './components/Rating/RatingHostView'
import RatingGuestView from './components/Rating/RatingGuestView'

ReactDOM.render(
	<Router>
		<Route exact path="/" component={HomePage} />
		<Route path="/register" component={Register} />
		{/* <Route path="/search" component={SearchBar} /> */} 
		<Route path="/signIn" component={SignIn} />
		<Route path="/home" component={HomePage}/>
		<Route path="/payment" component={Payment}/>
		<Route path="/newpayment" component={NewPayment}/>
		<Route path="/firebase" component={SignIn} />
		<Route path="/viewHomes" component={ViewHomes} />
		<Route path="/homedetails" component={HomeDetails} />
		<Route path="/cancelReservation" component={CancelReservationGuest} />
		<Route path="/step1" component={Step1} />
		<Route path="/cancelreservationhost" component={CancelReservationHost} />
		<Route path="/viewproperties" component={ViewProperties} />
		<Route path="/viewReservations" component={ViewReservationGuest} />
		<Route path="/hostbillingsummary" component={HostBillingSummary} />
		<Route path="/guestBillingSummary" component={GuestBillingSummary} />
		<Route path="/maps" component={SimpleMaps} />
		<Route path="/systemtime" component={TimeAdvancement} />
		<Route path="/hostReservationHistory" component={HistoryHost} />
		<Route path="/showrating" component={RatingHostView} />
		<Route path="/showRatingGuestView" component={RatingGuestView} />
			
		
		{/* <Route path="/search" component={Search} /> */}
		<Route path="/firebase" component={SignIn} />
		{/* <Route path="/listHomes" component={ListHomes} />
		<Route path="/viewHomes" component={ViewHomes} /> */}
	</Router>,
	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
