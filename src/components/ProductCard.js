import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({data, handleAddToCart}) => {

  // console.log("datain card",data);
  const {name, cost, rating, image} = data;
  return (
    <Card className="card">

      <CardMedia
          component="img"
          alt={name}
          height="140"
          image={image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {"$"+cost}
          </Typography>
         
          {/* <Typography component="legend">Read only</Typography> */}
          <Rating name="read-only" value={rating} readOnly />
          <CardActions>
            <Button variant="contained" onClick={handleAddToCart}>
              <AddShoppingCartOutlined />
            
               ADD TO CART
            </Button>
          
           </CardActions>
          

        </CardContent>


    </Card>
  );
};

export default ProductCard;
