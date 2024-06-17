import express from 'express';
import bodyParser from 'body-parser';
import {validateImageUrl, filterImageFromURL, deleteLocalFiles} from './util/util.js';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
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
    // validate input parameter
    if(validateImageUrl(req.query.image_url)){

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
    else{
      return res.status(400).send('Please input valid image url');
    }
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
