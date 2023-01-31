import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
// import Grid from '@mui/material/Grid';
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
// import useMediaQuery from '@material-ui/core/useMediaQuery';


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [cartApiData , setCartAPIData] = useState([]);
  const [cartItems,setCartItems] = useState([]);







 


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    setIsLoading(true);

    const url_endpoint = config.endpoint;
    const URL = `${url_endpoint}/products`;

    try{
      const res = await axios.get(URL);
      setIsLoading(false);
      console.log(res.data);
      const data = res.data;

      return data;
    }
    catch(e){
      setIsLoading(false);
      if(e.response){
        enqueueSnackbar(e.response.data,{ variant:'error'});

      }
      else{
        enqueueSnackbar("Server error",{ variant:'error'});

      }
    
    }

  };
 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

    const endPoint = config.endpoint;

    const URL = `${endPoint}/products/search?value=${text}`;

    try{

      const res = await axios.get(URL);

      const data = res.data;
      console.log("serachAPI called,",data);

      return data;

    }
    catch(e){

      if(e.response && e.response.status >= 400){
        console.log("error",e.response);
        enqueueSnackbar(e.response.statusText ,{variant : 'error'});
      }
      else{
        enqueueSnackbar("Something went wrong",{variant :'error'})
      }

      console.log(e.response);

    }

    

  };
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (event, debounceTimeout) => {

    if(debounceTimeout !== 0){
      clearTimeout(debounceTimeout);
    }

    let searchKey = event.target.value;

    setSearchText((prevState) => (searchKey));

    const timer = setTimeout(async () => {

      setProductsData(await performSearch(event.target.value));
      
    }, 500)

    setDebounceTimeout(timer);
    
    //setAPIData(cards);

  };

   /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

    const fetchCart = async (token) => {
      if (!token) return;
  
      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        const url_endpoint = config.endpoint;
        const res = await axios.get(`${url_endpoint}/cart`,{

          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
           
        )

        console.log("cart Data",res);
        return res.data;


      } catch (e) {
        if (e.response && e.response.status >= 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
        return null;
      }
    };
  
// TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
   const isItemInCart = (items, productId) => {
    console.log("inside s itemin cart")
    console.log("items",items);

    const prodIds = items.map((item) => {
      return item.productId;
    })
    return (prodIds.includes(productId));

 


  };

  

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    const url_endpoint = config.endpoint;


    if(!token){
      enqueueSnackbar("Login to add an item to the Cart",{variant : 'warning'});
      console.log("token");
      return ;
    }

    if(options.preventDuplicate && isItemInCart(items,productId)){

      console.log("isItemincart called inside");
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant : 'warning'});
      return;
    }
    let reqBody = {
      productId : productId,
      qty : qty
    }

    try{
      console.log("products",products);

      const res = await axios.post(`${url_endpoint}/cart`, reqBody,
      {
        headers : { Authorization : `Bearer ${token}` }
  
      }
      )
      console.log("postDataRes", res);
      setCartAPIData(res.data);

      setCartItems(generateCartItemsFrom(res.data, productsData))

    }
    catch(e){
      if(e.response && e.response.status >= 400){
        enqueueSnackbar(e.response.data.message, {variant : 'error'})
      }
      else{
        enqueueSnackbar("Check your connection",{variant : 'error'});

      }
    }


  };

  let cards = productsData && productsData.map((prod,idx) => (
    // <Grid container spacing={2} sx={{ padding: "3rem 1rem" }}>

            <Grid items md={3} sm={6} xs={12} sx={{ padding: "3rem 1rem" }}>

            <ProductCard data = {prod} handleAddToCart = {() => addToCart(
                localStorage.getItem("token"), 
                cartApiData,
                productsData,
                prod._id,
                1,
                { preventDuplicate: true})} key ={idx}/>

            </Grid>


    // </Grid>
   
     
   ))

   useEffect( () => {

    const apiCall = async () => {

      const productArray = await performAPICall();
  
  
      // setAPIData(productsArray);
      // console.log("array",productArray[0]);
    
      // console.log("cards",cards);
     
      console.log("apidata",productsData);
      setProductsData(productArray);
  
      let token = localStorage.getItem("token");
  
      if(token){

        const userCart =  await fetchCart(token);
        setCartAPIData(userCart);
  
  
        const cartItemsArray = generateCartItemsFrom( userCart, productArray);
    
        setCartItems(cartItemsArray);

      }


    

  
     };

     apiCall();


  }   
  
   ,[]);
 
  // const data = {
  //   "product" : productsArray 
  // }

  // const cards = apiData.map( (prod,idx) => (

  //   <Grid items>
  //      <ProductCard key ={idx} {...prod}/>
  //   </Grid>


  // ))
  // useEffect( async () => {

    

  // },[searchText])

  const username = localStorage.getItem("username");
   
  return (
    
    <div>
      
      <Header children={
        <div className="search">
          <TextField
            className="search-desktop"
            size="small"
            
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            value={searchText}
            onChange={(e) => debounceSearch(e,debounceTimeout)}
          />

        </div>
         

      }
       

      
      >
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchText}
        onChange={(e) => debounceSearch(e,debounceTimeout)}

      />
      <Grid container direction ="row">
        
        <Grid item md={ username ? 9 : 12} >

          <Grid container spacing={2}>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box>
              </Grid>
              
            </Grid>
            <Grid container spacing={2} sx={{ display: "flex" }}>
              {isLoading ? 
                <div className="loading">
                  <CircularProgress />
                  <Typography variant="p" sx={{ marginTop: "1rem" }}>Loading Products</Typography>
                </div>
                :

                cards ? cards : 
                <Grid container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <SentimentDissatisfied />
                    <Typography variant="p" sx={{ marginTop: "1rem" }}>No Products found</Typography>
                </Grid>
                
                }

            </Grid>

        </Grid>

       {/* //2. cart */}
       {
        localStorage.getItem("username") ? 

          <Grid item md={3} xs={12} sx ={ {display: "flex", flexDirection: "column", alignItems: "center" , width : '100vw'}}>
          
            <Cart products={productsData} items = {cartItems} handleQuantity = {addToCart}/>
         </Grid>
         :
         <></>

        }


       
        
          
      
          






      </Grid>
      
      <Footer />
    </div>
  );
};

export default Products;
