import React, { Component } from 'react'
import '../../App.css';
import axios from 'axios';
import Swal from 'sweetalert2'
import NavBar from '../NavBar/NavBar';
import { ROOT_URL } from '../constants/constants';

import './register.css';


export default class SignUp extends Component {

	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			emailAlreadyPresent: false,
			firstNameError: true,
			lastNameError: true,
			emailError: true,
			passwordError: true
		};
		// this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		// this.handleLastNameChange = this.handleLastNameChange.bind(this);
		// this.handlePasswordChange = this.handlePasswordChange.bind(this);
		// this.handleEmailChange = this.handleEmailChange.bind(this);
		// this.handleRegistration = this.handleRegistration.bind(this);

	}

	handleFirstNameChange = (e) => {
		if (e.target.value) {
			document.getElementById("fname-error").innerHTML = "";
			this.setState({ firstName: e.target.value });
			this.setState({ firstNameError: false })
		} else{
			document.getElementById("fname-error").innerHTML = "Please enter your firstname";
			this.setState({ firstNameError: true })
		}
	}

	handleLastNameChange = (e) => {
		if (e.target.value) {
			document.getElementById("lname-error").innerHTML = "";
			this.setState({ lastName: e.target.value });
			this.setState({ lastNameError: false })
		} else{
			document.getElementById("lname-error").innerHTML = "Please enter your last name"
			this.setState({ lastNameError: true })
		}
		

	}


	handlePasswordChange = (e) => {

		console.log("inside password")
		if (e.target.value) {

			document.getElementById("password-error").innerHTML = "";
			this.setState({ password: e.target.value });
			this.setState({ passwordError: false })
		} else {
			document.getElementById("password-error").innerHTML = "Please enter your password";
			this.setState({ passwordError: true })

		}
	}
	handleEmailChange = (e) => {
		// this.setState({ email: e.target.value });
		console.log("=====e ", e)
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (e.target.value == "") {
			document.getElementById("email-error").innerHTML = "Please enter valid email address";
			this.setState({ emailError: true })
		} else {
			document.getElementById("email-error").innerHTML = "";
			//put check for correct format
			this.setState({ email: e.target.value });
			if (!regex.test(String(this.state.email).toLowerCase()))
			{

				 document.getElementById("email-error").innerHTML = "Please enter valid email address";
				 this.setState({ emailError: true })
			} else
				this.setState({ emailError: false })

		}
	}

	handleRegistration = (e) => {
		e.preventDefault();
		if (!this.state.firstNameError && !this.state.lastNameError && !this.state.emailError && !this.state.passwordError) {

			const data = { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password };
			console.log("data :", data)
			axios.post(`${ROOT_URL}/register`, data)
				.then((response) => {
					console.log("response: ", response)
					this.props.history.push("/home")
					// if (response.status === 200) {
					//     Swal('Registered succesfully!', "You have been successfully registered.", 'success');
					// }
					// if (response.status === 204) {
					//     console.log(response)
					//     Swal('Email already exist!', "You have been already registered", 'error');
					// }
				})
				.catch(error => {
					console.log("===== error in registering the user ", error)
				});
		} else {
			console.log("Fill Required Info")
			document.getElementById("fill-error").innerHTML = "Please Fill Required Fields";
		}
	}

	// validateFirstNameFormat(firstName) {
	// 	if (firstName.trim() == "") {
	// 		document.getElementById("name-error").innerHTML = "Please enter your first name";
	// 		return false;
	// 	}
	// 	return true;
	// }
	// validateLastNameFormat(lastName) {
	// 	if (lastName.trim() == "") {
	// 		document.getElementById("name-error").innerHTML = "Please enter your last name";
	// 		return false;
	// 	}
	// 	return true;
	// }



	render() {
		return (
			<div>
				<div id="intro" >
					<div className="content">
						<NavBar />
						<div>
							<div className="jumbotron">
								<div className="Jumbotron__wrapper">
									<div class="ValueProps hidden-xs">
										<form>
											<div class="container">
												<p></p>
												<div align="center"></div>
												<div class="login-form">
													<div class="main-div">
														<p>JOIN US</p>
														<div class="form-group">
															<input onChange={this.handleFirstNameChange} type="text" class="form-control" name="firstName"
																placeholder="First Name" required />
														</div>
														<div id="fname-error" class="error"></div>
														<div class="form-group">
															<input onChange={this.handleLastNameChange} type="text" class="form-control" name="lastName"
																placeholder="Last Name" required/>
														</div>
														<div id="lname-error" class="error"></div>
														<div class="form-group">
															<input onChange={this.handleEmailChange} type="email" class="form-control" name="email"
																placeholder="Email Address" required />
														</div>
														<div id="email-error" class="error"></div>
														<div class="form-group">
															<input onChange={this.handlePasswordChange} minlength="4" type="password" class="form-control" name="password" placeholder="Password" />
														</div>
														<div id="password-error" class="error"></div>
														<div id="fill-error" class="error"></div>
														<button onClick={this.handleRegistration} class="btn btn-danger">Sign Me Up</button>
														<p align="center">Already have an account?<a href="/signIn" style={{ color: '#007bff' }}>&nbsp;&nbsp;&nbsp;Log in</a></p>
													</div>

												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
}