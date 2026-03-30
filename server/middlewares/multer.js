// import multer from "multer";


// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, "public")
//     },
//     filename:function(req, file ,cb) {
//         const filename = DataTransfer.now() + "-" +file.originalname;
//         cd(null, filename)
//     }
// })


// export const upload = multer({
//     storage,
//     limits:{fileSize: 5 * 1024 * 1024}, //5 MB Limit
// })







import multer from "multer";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // File save folder
    cb(null, "public"); 
  },
  filename: function (req, file, cb) {
    // Unique filename using current timestamp
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename); // Correct callback
  },
});

// Export multer upload middleware with 5MB file size limit
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});