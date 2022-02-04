import md5 from "md5";

export const getGravatar = ( email ) =>{

    const address = String( email ).trim().toLowerCase();
  
    // Create an MD5 hash of the final string
    const hash = md5( address );
  
    // Grab the actual image URL
    return `https://www.gravatar.com/avatar/${ hash }`;
  }