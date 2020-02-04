import React, { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';

import config from '../Firebase/firebaseConfig';
import './SignIn.css';
import {
  Button,
  Form, Row, Col
} from 'react-bootstrap';
import { Redirect } from 'react-router'

// component imports
import NavBar from '../NavBar/NavBar'
import { ROOT_URL } from '../constants/constants';

const firebaseApp = firebase.initializeApp(config);

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider().setCustomParameters({
    prompt: 'select_account'
  }),

};


class SignIn extends Component {
  state = {
    email: "",
    // userName:"",
    password: "",
    authFlag: false,
    userFromFirebaseGoogle: ""
  }
  // componentDidMount(){
  //   auth.getAuth().onAuthStateChanged(user => {
  //     if (user) {
  //       this.props.history.push('/dashboard');
  //     }
  //   });
  // }
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value
    })
    if (e.target.value == "") {
      document.getElementById("email-error").innerHTML = "Please enter valid email address";
    } else {
      document.getElementById("email-error").innerHTML = "";
    }
  }
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value
    })
    if (e.target.value == "") {
      document.getElementById("password-error").innerHTML = "Please enter valid Password";
    } else {
      document.getElementById("password-error").innerHTML = "";
    }
  }

  //submit Login handler to send a request to the node backend
  submitLogin = (e) => {

    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    }

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    if (this.state.email === '' || this.state.password === '') {
      if (this.state.email === '') {
        document.getElementById("email-error").innerHTML = "Please enter email";
      }
      if (this.state.password === '') {
        document.getElementById("password-error").innerHTML = "Please enter password";
      }
    } else {
      //make a post request with the user data
      const request = axios.post(`${ROOT_URL}/signIn`, data)
        .then((response) => {
          console.log("response", response);
          if (response.status === 200) {
            if (response.data.userDetails) {
              console.log("the user is logged in");
              sessionStorage.setItem('email', response.data.userDetails.email);
              sessionStorage.setItem('type', response.data.userDetails.type);
              sessionStorage.setItem('isVerified', response.data.userDetails.isVerified);
              sessionStorage.setItem('userId',response.data.userDetails.id);
              this.props.history.push("/home")
            } else if (response.data.error) {
              console.log("there is some error in sign in which needs to be displayed to the user");
              document.getElementById("signIn-error").innerHTML = response.data.error;
              console.log(response.data.error);
            }
          }
        })
        .catch(error => {
          console.log("error", error);
        })
    }
  }



  signOutUser = () => {
    firebaseApp.auth().signOut().then(function () {
      // Sign-out successful.
      sessionStorage.clear();
      console.log("signed out successfully");
    }).catch(function (error) {
      // An error happened.
      console.log(error)
    });
  }
  loginGoogleUser = () => {
    try {

      firebaseApp.auth().signInWithPopup(providers.googleProvider).then(user => {
        console.log("====user in function =====", user)
        this.setState({
          userFromFirebase: user.user
        })
        console.log("======user.user.displayName", user.user.displayName);

        this.setState({ email: user.user.email });
        // make a database call here to add the user to the database with the user signerd in with google flag on 
        // may be I can extract the call in the function and send the paranmeter that shows the user signned with google
        // I will need to check if this is the first time the user is signing in with google as nly the first time the entry needs to be made i the database
        // for that I'll require an api to check if the email exists in the database or not.
        axios.defaults.withCredentials = true;

        axios.get(`${ROOT_URL}/getUser/${user.user.email}`)
          .then((response) => {
            // console.log("=== response ===", response);
            if (response.status === 200) {
              // this means that response is received we need to check if the user is present or not
              if (response.data.userDetails) {
                // this means that data is present in the database and hence the user is not registering for the first time in the system
                sessionStorage.setItem('email', response.data.userDetails.email);
                sessionStorage.setItem('type', response.data.userDetails.type);
                sessionStorage.setItem('isVerified', response.data.userDetails.isVerified);
                sessionStorage.setItem('userId',response.data.userDetails.id);
                sessionStorage.setItem('userFromGoogleLogin',true);
                this.props.history.push("/home")
              } else {
                // need to checkif error is not thrown and make a axios call to put the user into the database system 
                console.log("=== first timeuser put in db")
                let name = user.user.displayName;
                name = name.split(" ");
                // console.log("after split name is", name);
                // console.log("name[0]", name[0]);
                // console.log("name[1]", name[1]);
                const data = {
                  firstName: name[0],
                  lastName: name[1],
                  email: this.state.email,
                  googleSignIn:true
                  // password: this.state.password 
                };
                axios.post(`${ROOT_URL}/register`, data)
                  .then((response) => {
                    console.log("==== response from adding the new user to the database", response);
                    // localStorage.setItem('email', response.data.userDetails.email);
                    sessionStorage.setItem('email', response.data.userDetails.email);
                    sessionStorage.setItem('type', response.data.userDetails.type); 
                    sessionStorage.setItem('isVerified', response.data.userDetails.isVerified);
                    sessionStorage.setItem('userId',response.data.userDetails.id);
                    sessionStorage.setItem('userFromGoogleLogin',true);
                    this.props.history.push("/home")
                  })
                  .catch(error => {
                    console.log("=== error ==", error);
                  })
              }
            }
          })
          .catch(error => {
            console.log("=== error in first catch===", error);
          })

      }).catch(error => {
        console.log("=== error in login using google auth === ", error)
      })

    }
    catch (error) {
      console.log(error)
      console.log("---in catch-here")

    }
  }
  render() {
    const {
      user,
      // signInWithGoogle,
    } = this.props;
    console.log("=======user=========", user);
    // console.log("======= signInWithGoogle=========", signInWithGoogle);
    let redirect = null
    if (sessionStorage.getItem("email")) {
      console.log("=============should redirect")
      redirect = <Redirect to="/home" />
    }
    return (
      <div>
        {redirect}
        <div id="intro">
          <div className="content">
            <NavBar />
            <div className="jumbotron">
              <div className="Jumbotron__wrapper">
                <div class="ValueProps hidden-xs"></div>
                <Row>
                  <Col s={6} md={4}></Col>
                  <Col s={6} md={4}>
                    <div id="divForm">
                      <Form>
                        <h1>Sign In</h1>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label class="text-muted">Email address</Form.Label>
                          <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler} />
                          <div id="email-error" class="error" class="text-danger"></div>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                          <Form.Label class="text-muted">Password</Form.Label>
                          <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} />
                          <div id="password-error" class="error" class="text-danger"></div>
                        </Form.Group>
                        <div id="buttonWrapper">
                          <Button variant="danger" type="submit" id="buttonWrapper" onClick={this.submitLogin}>
                            Submit</Button>
                        </div>
                        {/* <br></br> */}
                        <div id="buttonWrapper">
                          <div id="signIn-error" class="error" class="text-danger"></div>
                        </div>
                        <hr></hr>
                        <div id="buttonWrapper">
                          {/* {
                            user
                              ? <p>Hello, {user.displayName}, with email is {user.email} </p>
                              : <p>Please sign in.</p>
                          } */}
                          {
                            sessionStorage.getItem("userId")
                              ? <Button variant="danger" onClick={() => this.signOutUser()}>Sign out</Button>
                              : <Button variant="danger" onClick={() => this.loginGoogleUser()}>Sign in with Google</Button>
                            // : <Button variant="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
                          }
                        </div>
                      </Form>
                    </div>

                  </Col>
                  <Col s={6} md={4}></Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(SignIn);


//==
// add the create user using email to the login page in
// use the firebase.createUserWithEmailAnd PaassWord()

