import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();
  const urlPattern = /^(http?:\/\/)[^\s$.?#].[^\s]*$/;


  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async (req, res) => {
    let image_url = req.query.image_url;
    try {
      if(!image_url || !isValidUrl(image_url)){
        console.log('foi');
        res.status(400).send("Error: The submit url is empty");
      }
      const filteredImagePath = await filterImageFromURL(image_url);

      res.sendFile(filteredImagePath, () => {
        deleteLocalFiles([filteredImagePath]);
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).send({ error: "Internal server error" });
  }
   
    
  } );

  
  function isValidUrl(str) {
    const pattern = new RegExp(
      '^([a-zA-Z]+:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(str);
  }
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
