import multer from "multer";

// Upload karne ke liye do storage use kar sakte hai yehan pe 
// -.Diskstorage
// ->memoryStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Public/temp")
    },

    // Kun se name  se cloudinary pe save karna 
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

// ye mostly routes me use karte hai (Mujhse milke jana )
export const upload = multer({
    storage,
})