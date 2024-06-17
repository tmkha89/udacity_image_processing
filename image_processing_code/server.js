import express from 'express';
import bodyParser from 'body-parser';
import {validateImageUrl, filterImageFromURL, deleteLocalFiles} from './util/util.js';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // using token to authorize request
  // this token is for demostration purpose only
  const token = 'Bearer o1qSgHmbrUJbmY2YVdouMWI2z9kOrYZzjspJEiZPPEkKycRv4VIaAdBw3Dr9P9rY';

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
    
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );
  
  // FilteredImage Endpoint
  // Receive image and display filtered version of that image
  app.get( "/filteredimage", async (req, res) => {
    const requestToken = req.headers['authorization'];
    
    if (requestToken != token)
      return res.status(403).send('Unauthorized');

    // validate input parameter
    if(validateImageUrl(req.query.image_url)){
      try{
        // proccessing filtered image
        let filteredImage = await filterImageFromURL(req.query.image_url);

        // display filtered image
        res.sendFile(filteredImage, (err) => {
          
          // return error failing to display image
          if (err) {
              console.error('Error sending file:', err);
              res.status(err.status).end();
          } 

          // remove localfile after display
          deleteLocalFiles([filteredImage]);
        });
      }
      catch(err){
        res.status(400).send("Fail to filter image: " + err.message);
      }
    }
    else{
      return res.status(404).send('Please input valid image url');
    }
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
