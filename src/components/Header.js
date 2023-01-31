import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import {Link , useHistory } from "react-router-dom"
import React, { useEffect } from "react";
import "./Header.css";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
// import SearchBar from "./Products"




const Header = ({ children, hasHiddenAuthButtons }) => {

    const history = useHistory();

      const username = localStorage.getItem("username");
      // console.log("username",username);
    

    const routeChange = (path) => {
      history.push(path);
    }

    const logout = () => {
      history.push("/");
      localStorage.clear();
      window.location.reload();
       
    }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Box>{children}</Box>
        
        { hasHiddenAuthButtons ?
          (<Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => {
              history.push("/");
            }}
          >
            Back to explore
          </Button>) :
        

          (username === null ?
            <Box>
              <Button className="button"
                onClick={() => { routeChange("/login") }}>
                Login
              </Button>
              <Button className="button" variant="contained"
                onClick={() => { routeChange("/register") }}>
                Register
              </Button>
            </Box> :
             <Stack direction="row" spacing={2}>

                  <img src={`${process.env.PUBLIC_URL}/avatar.png`} alt={username}></img>
                  <Typography variant="h6">
                    {username}
                  </Typography>
                  <Button className="button" variant="contained"
                    onClick={logout}>
                    Logout
                  </Button>


             </Stack>)
            
           
         
          }
        
       
      </Box>
    );
};

export default Header;
