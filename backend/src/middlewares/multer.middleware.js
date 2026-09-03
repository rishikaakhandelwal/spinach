import multer from "multer"

const uploadLocal = multer({dest: '../../public/temp'})

export default uploadLocal

// ye upar walla mene doc se khud likha, actual ye neeche wala h:

// import multer from "multer";

// const storage = multer.diskStorage({ //config options for multer
//     destination: function(req, file, cb) {
//         cb(null, "./public/temp")
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname)
//     }
// })

// export const upload = multer({
//     storage
// })