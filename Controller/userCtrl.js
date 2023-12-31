const { get } = require('http');
const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler( async(req, res) => {
    const email = req.body.email;
    /*This line extracts the email field 
    from the request's body. It assumes that 
    the client (user) has sent a POST request 
    with a JSON body containing user registration 
    data, and one of the fields in that data is 
    the email address.*/

    const findUser = await User.findOne({email: email});
    /*This line attempts to find an existing user 
    in the database using the findOne method 
    provided by the User model. It searches for a 
    user with the same email as the one extracted 
    from the request.*/

    if(!findUser){
        //Create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
        /*If no user with the same email is found 
        (if (!findUser)), it creates a new user 
        using the User.create() method, passing in 
        the entire request body (req.body). 
        Then, it sends a JSON response containing 
        the newly created user's data.*/
    }else{
        //User already exists
        /*res.json({
            msg: 'User Already exists',
            sucess: false,
            /*If a user with the same email is found (else),
            it sends a JSON response indicating that the user 
            already exists with a corresponding message and a 
            success flag set to false. */
        //});

        //new config

        throw new Error('User Already Exists');
    }
}); 

const loginUserCtrl = asyncHandler(async(req, res) => {
    const{email, password} = req.body;
    
    //Check if the user exists or not
    const findUser = await User.findOne({ email });
    if ( findUser && (await findUser.isPasswordMatched( password ))){
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});

//Update a User

const updatedUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new:true, //because it has now new information, it's true that it was updated
        });
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }
})
//Get all users

const getallUser = asyncHandler(async (req, res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error)
    }
});

//Get a single user

const getaUser = asyncHandler( async(req, res) => {
    const{id} = req.params;
    try{
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        })
    }catch(error){
        throw new Error(error);
    };
});

//Delete a user

const deleteaUser = asyncHandler( async(req, res) => {
    const{id} = req.params;
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    }catch(error){
        throw new Error(error);
    };
});

module.exports = { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser };