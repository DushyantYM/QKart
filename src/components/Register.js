import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import {Link , useHistory} from "react-router-dom";
import "./Register.css";

const Register = () => {

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  // const [success, setSuccess] = useState(false)

  // const initialState = {
  //   username: "",
  //   password : "",
  //   confirmPassword: ""
  // }

  let [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  // const { username, password, confirmPassword } = formData;

  //const [formData, setFormData ] = useState(initialState)


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (e, formData) => {
    
    e.preventDefault();
    if (!validateInput(formData)) return;
    setIsLoading(true);
    const username = formData.username;
    const password = formData.password;
    const newUser = {
      username,
      password
    }

    // const configApp = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };


    // const body = JSON.stringify(newUser);
    // console.log("formdata-->",formData)
    
    try {
       
      console.log("formdata-->",formData)
      const res = await axios.post(config.endpoint + "/auth/register", newUser);
      setIsLoading(false);
      console.log("response data in try -->",res.data);
      enqueueSnackbar("Registration successfully done", { variant: "success" })
      history.push("/login", { from : "Login"});
      // setSuccess(true);
     
    } catch (err) {
      setIsLoading(false);
      // setSuccess(false);
      console.log("error-->",err.response);
      if (err.response && err.response.status >= 400) {
        enqueueSnackbar("Username is already taken", { variant: 'error' });
      } else {
        enqueueSnackbar("Something went wrong!", { variant: 'error' });
      }

      // console.log(err.response.data.message);
      // enqueueSnackbar(err.response.data.message, { variant: "error" })
      //return err.response.data
    }


  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;

    if (username === "") {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    }
    if(username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "error" })
      return false;
    }
    if(password === "") {
      enqueueSnackbar("Password is a required field", { variant: "error" })
      return false;
    }
    if(password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "error" })
      return false;
    }
    if (confirmPassword === "") {
      enqueueSnackbar("Confirm Password is a required field", { variant: "error" })
      return false;
    } 
    if (confirmPassword.length < 6) {
      enqueueSnackbar("Confirm Password must be at least 6 characters", { variant: "error" })
      return false;
    }
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" })
      return false;
    } 

      // setSuccess(true)
      // enqueueSnackbar("Registration Successfully done", { variant: "success" })
      return true;
    
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  }



  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="100vh"

      >
        <Header hasHiddenAuthButtons = {true}    />
        <Box className="content">
          <Stack spacing={2} className="form">
            <h2 className="title">Register</h2>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              title="Username"
              name="username"
              placeholder="Enter Username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              helperText="Password must be atleast 6 characters length"
              fullWidth
              placeholder="Enter a password with minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {isLoading ? 
            <Box display = 'flex' justifyContent='center'><CircularProgress /></Box> :
              <Button className="button" variant="contained" onClick={(e) => register(e,formData)}>
                Register Now
            </Button>}

            <p className="secondary-action">
              Already have an account?{" "}
              <Link className="link" to="/login">
                Login here
              </Link>
            </p>
          </Stack>
        </Box>
        <Footer />
      </Box>
    </>

  );
};

export default Register;
