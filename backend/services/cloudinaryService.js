const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key:  process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



// cloudinary.api.ping()
//   .then((result) => {
//     console.log("Cloudinary connected:", result);
//   })
//   .catch((error) => {
//     console.error("Cloudinary connection failed:");
//     console.error("Message:", error.message);
//     console.error("HTTP Code:", error.http_code);
//   });

/////////////////////////
// Uploads an image file
/////////////////////////

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "tradehub",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.log("full error:", error);

          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};
module.exports = {uploadToCloudinary};