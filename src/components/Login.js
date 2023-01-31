import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {

  const history = useHistory();

  const [userData, setUserData] = useState({ username : '',password : ''});
  const [isLoading,setIsLoading] = useState(false);


  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (e,formData) => {
    setIsLoading(true);
    e.preventDefault();


    const { username, password } = formData;
    console.log("formdata_login",formData);
    console.log("username_login",username);
    // console.log(username);
    // console.log(typeof username);
    
    const body = {
      username : username,
      password : password
    }
    console.log("body-->",body);

    const endpoint = config.endpoint;

    const URL = `${endpoint}/auth/login`;

    if(validateInput(formData)){

      try{

        console.log("calling API");
        const res = await axios.post(URL,body);
        setIsLoading(false);
        console.log("res",res.data);

        if(res.data.success && res.status === 201){
          console.log(res);
          enqueueSnackbar("Logged in successfully");
          history.push("/", { from : "Login"});
          
          const { token, balance, username} = res.data;

          persistLogin(token,username,balance);
          
          setUserData({
            username: "",
            password: "",
          });
        }

      }
      catch(e){
        
        if(e.response && e.response.status >= 400){
          let message = e.response.data.message;
          enqueueSnackbar(message,{variant : 'error'});
          setIsLoading(false);
        }
        else{
          enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant : 'error'});
          setIsLoading(false);
        }

      }
      setIsLoading(false);

    }
    setIsLoading(false);
    
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {

    const {username, password} = data;

    if(username === ''){
      enqueueSnackbar("Username is a required field",{variant : 'error'});
      return false;
    }

    if(password === ''){
      enqueueSnackbar("Password is a required field",{variant : 'error'});
      return false;

    }

    return true;

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {

    localStorage.setItem("token",token);
    localStorage.setItem("username",username);
    localStorage.setItem("balance",balance);

    // window.location.reload();

  };



  const handleInputChange = (e) => {
     
    const name = e.target.name;
    const value = e.target.value;
    setUserData((prevState) => ({
      ...prevState,
      [name] : value
    })
      
    )

  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons =  {true} />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
        <TextField
         id="username" 
         variant="outlined" 
         label= "Username" 
         name= "username"
         type = "text"
         value = {userData.username}
         onChange = {handleInputChange}
         />
        <TextField
         id="password" 
         variant="outlined" 
         label= "Password" 
         name = "password"
         type = "password"
         value = {userData.password}
         onChange = {handleInputChange}
         />
         {isLoading ? <Box display = 'flex' justifyContent='center'><CircularProgress /></Box> 
         : <Button variant="contained" className="button"
          onClick={(e) => login(e,userData)}>LOGIN TO QKART</Button>}
         <p className="secondary-action">
              Don't have an account?{" "}
              <Link className="link" to="/register">
                Register Now
              </Link>
            </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
