import React, { Component } from 'react';

//import logo from './logo.svg';
import './App.css';
//import ReactSignupLoginComponent from 'react-signup-login-component';
import axios from 'axios'

class App extends Component {

	state = {};

	componentDidMount() {
		setInterval(this.hello, 250);
	}

	hello = () => {
		this.setState({ message: "test" });
	};

	render() {
		return (
			<div className="App">
				<header className="App-header">
					{/* <img src={logo} className="App-logo" alt="logo"/> */}
					<h1 className="App-title">{this.state.message}</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
              </p>
			</div>
		);
	}
}

export default App;


