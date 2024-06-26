import fs from "fs";
import Jimp from "jimp";
import { resolve } from "path";
import axios from "axios";

//const axios = require('axios');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the image from the URL
      const response = await axios({
        url: inputURL,
        method: 'GET',
        responseType: 'arraybuffer',
      });
  
      const imageBuffer = Buffer.from(response.data, 'binary');
      const appFolder = process.cwd().replace(/\\/g, '/');
      const outpath = appFolder + "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
  
      let photo = await Jimp.read(imageBuffer);

      // Process the image with sharp
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    try{
      fs.unlinkSync(file);
    }
    catch(error)
    {
      //console.error(error);
    }
  }
}

// validateImageUrl
// check if the url input is valid
export function validateImageUrl(inputURL){
  if(!inputURL) return false;

  const urlRegex = /^(ftp|http|https):\/\//;
  return urlRegex.test(inputURL);
}

