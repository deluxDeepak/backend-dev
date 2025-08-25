import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/user.models.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { ApiResponse } from "../Utils/Apiresponse.js";


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {

        // Bus userid se find kar lega oske basis pe wo token generate kar dega 
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.genrateRefreshToken();

        // Refresh token db me save karna prega 
        user.refreshToken = refreshToken;

        // agr ye nahi karenge to error dega kyunki password ke bina save nahi karega aur hum ek filed change karke save karna chahte hai 
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };


    } catch (error) {
        throw new ApiError(500, "Someting went wrong while generating regresh and Access token");
    }
}




const registerUser = asyncHandler(async (req, res) => {

    // Yehan se only data handle kar sakte hai == File handle nahi kar sakte hai 
    // ->Jo requires hai wo to pkka se chek karo

    // *********Remove password and refresh token filed from the response ************
    //Return karnege Api response isliye iska bhi ek class bana liye hai sab jagah use kar sakte hai 




    const { fullName, email, username, password } = req.body
    // console.log(fullName);




    // Ye only ek check kiye hai sabko check karna parega 
    // if(fullName==="")
    //     throw new ApiError(400,"Fullname is required !"); Ye response nahi hai direct error hai 


    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are require ");
    }

    // Email and username me koi ek 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]

    })

    if (existedUser) {
        throw new ApiError(400, "User already exist! ");
    }

    // console.log(req.files); //Ye cloudinary se data ata hai 

    // Upload them to cloudinary 
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // Optional chaining kam nahi kare to  classical tarika if esle use kar lo 
    // ->coverImage undefine ayega agr coverImage nahi denge to but yehan coverimage required nahi hai  fir bhi 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; //Ye code yehan pe error de sakta hai 

    let coverImageLocalPath;
    // req.files.coverImage.length ye check karega ki jo aray hai wo empty to nahi reh gya hai 
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log(coverImageLocalPath);


    if (!avatarLocalPath) {
        throw new ApiError(400, "❌Avatar file is required ");
    }

    // uploadOnCloudinary ye ek response dega jo hum set kar chuke hai 
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log(avatar);



    // isme bhi validation dekh sakte hai 
    // ->Nahi to code age jake fat sakta hai 

    let coverImage = "";
    if (coverImage) {

        const responseImage = await uploadOnCloudinary(coverImageLocalPath);
        coverImage = responseImage.url || ""
    }
    console.log(coverImage); //Public\temp\tick-img.png







    // Check ki avater upload hua hai ya nahi 
    if (!avatar) {
        throw new ApiError(400, "❌Avatar file is required ");
    }

    // create user and Upload them into the databse 
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        // Agr nahi hai to Empty bhej do (End case check karna hua )
        coverImage,
        email,
        password,
        username: username.toLowerCase()

    })

    // Created user me db call karke fir password hata rehe hai response me se 
    // Chack bhi karenege user cration 
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"

    )

    if (!createUser) {
        throw new ApiError(400, "Something went wrong while registering the User");
    }

    // Send the response to the User 

    return res.status(201).json(
        new ApiResponse(200, createUser, "User register Successfully ✅")
    )


})


const loginUser = asyncHandler(async (req, res) => {
    // Algorithm for Login the user
    // ->Get the User details from the body  
    // ->username ya fir email se login kara sakte hai ye fir find kar sakte hai 
    // ->Find the User in the db
    // ->Verify the details of the User 
    // ->Verify the password and cookies 
    // ->send the refresh and Access token to the users in cookies 

    const { email, username, password } = req.body;

    if (!username || !email) {
        throw new ApiError(400, "Username or Password required ");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, " ❌User Don't Exist!");
    }

    // ye method user small letter wala user ke pass hoga User (iske pass nahi hoga )
    const isPasswordvalid = await user.isPassword(password)
    if (!isPasswordvalid) {
        throw new ApiError(400, " ❌Password not valid!");
    }

    // Generate tokens new method bana sakte hai 
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

    // Send in cookies 
    // Ek aur bar call karke find karke unwanted data ko hata denge bus required data hi user ko bhegne 
    // response me jo data bhejnge osme nahi bhejna hai sara data ko 

    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options={
        hhtpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken

            },
            "Youser LoggedIn Sucessfully✅"
        )
    )

})

const logoutUser=asyncHandler(async(req,res)=>{
    // Yehan agr body se id leke logout karayenge tab to kisi ka bhi email dalke logout kar dega ye 
    // ->Isiliye iske liye middleware ka use karenge to verify the user 
})



export { 
    registerUser,
    loginUser
 }
