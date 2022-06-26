const User = require("../models/user.model")
const Responses = require("../config/httpresponse")
const bcrypt = require('bcrypt');
const config = require("../config/config");
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// user signin
exports.signin = async(request,response)=>{
    await bcrypt.hash(request.body.password, config.saltRounds,async function(err, hash) {
        let uName = (request.body.fName)[0].toUpperCase() + (request.body.lName).toLowerCase()
        User.findOne({email: request.body.email }, function (err, docs) {
            if (docs){
                response.status(Responses.Status.BAD_REQUEST).json({success: false,message: 'User already exists'});
            }
            else{
                var new_user = new User({
                    fName : request.body.fName,
                    lName : request.body.lName,
                    username : uName,
                    email : request.body.email,
                    password : hash,
                    oldPasswords:{key : hash}
                })
                new_user.save(function(err,result){
                    if (err){
                        console.log(err);
                        response.status(Responses.Status.BAD_REQUEST).json({success: false,
                            message: err.message || 'something went wrong',});
                    }
                    else{
                        console.log(result)
                        response.status(Responses.Status.OK).json({success: true,message: 'User created successfully',user : result});
                    }
                })
            }
        });
    });
}

exports.users = async(request,response)=>{
    User.find()
    .then((data)=>{
        response.status(Responses.Status.OK).json({Body : data});
    })
    .catch((err)=>{
        response.status(Responses.Status.BAD_REQUEST).json({Error : "Cannot get users"});
    })
}

exports.login = async(request,response)=>{
    User.findOne({email: request.body.email }, function (err, docs) {
        if(docs){
            bcrypt.compare(request.body.password, docs.password, function(err, result) {
                if(result){
                    jwt.sign({
                        id:docs.id,
                        username : docs.username,
                        fName: docs.fName,
                        lName: docs.lName,
                    }, config.privateKey, function(err, token) {
                        response.status(Responses.Status.OK).json({Body : token});
                      });
                }else{
                        response.status(Responses.Status.BAD_REQUEST).json({Error : "Wrong password"});
                }
            });
        }
        else{
            response.status(Responses.Status.BAD_REQUEST).json({success:false,message : "Account not exist"});
        }
    })
}

exports.user = async(request,response)=>{
    User.findOne({_id: request.params.id }, function (err, docs) {
        if (docs){
            response.status(Responses.Status.OK).json({body :docs});
        }else{
            response.status(Responses.Status.BAD_REQUEST).json({body :"Cannot get user"});
        }
    })
}

exports.reset = async(request,response)=>{
    User.findOne({email: request.body.email },async function (err, docs) {
        if (docs){
            if(docs.oldPasswords.length >= 3){
                var res = docs.oldPasswords.filter(IT => bcrypt.compareSync(request.body.password,IT.key))
                if(res.length > 0){
                    response.status(Responses.Status.BAD_REQUEST).json({body :"Try with different password, Password same as last 3 password"});
                }else{
                    docs.oldPasswords.shift();
                    await bcrypt.hash(request.body.password, config.saltRounds,async function(err, hash) {
                        docs.oldPasswords.push({key:hash})
                             User.updateOne({_id:docs.id},{oldPasswords:docs.oldPasswords,password:hash})
                            .then((updateData)=>{
                                response.status(Responses.Status.OK).json({body :"Password Updated"});
                            })
                            .catch(err=>console.log(err))
                    })
                }
            }else{
                let res = docs.oldPasswords.filter(IT => bcrypt.compareSync(request.body.password,IT.key))
                if(res.length > 0){
                    response.status(Responses.Status.BAD_REQUEST).json({body :"Try with different password, Password same as last 3 password"});
                }else{
                    await bcrypt.hash(request.body.password, config.saltRounds,async function(err, hash) {
                        docs.oldPasswords.push({key:hash})
                        User.updateOne({_id:docs.id},{oldPasswords:docs.oldPasswords,password:hash})
                        .then((updateData)=>{
                            response.status(Responses.Status.OK).json({body :"Password Updated"});
                        })
                        .catch(err=>console.log(err))
                    })
                }
            }
        
        }else{
            response.status(Responses.Status.BAD_REQUEST).json({body :"User not found"});
        }
    })
}

exports.address = async(request,response)=>{
    var updateBody = {
        uuid:uuidv4(),
        name : request.body.name,
        phone : request.body.phone,
        address1:request.body.address1,
        address2:request.body.address2,
        pincode:request.body.pincode
    }
    var newAdd = []
    var count = 0;
    User.findOne({_id: request.params.id }, function (err, docs) {
        console.log(docs.address)
        docs.address.map((data)=>{
            count += 1
            newAdd.push(data)
            if(docs.address.length == count){
                newAdd.push(updateBody)
                User.updateOne({_id:request.params.id},{address:newAdd})
                .then((updateData)=>{
                    response.status(Responses.Status.OK).json({body :updateData});
                })
                .catch(err=>console.log(err))
            }
        })
    })
  
}

exports.userAddress = async(request,response)=>{
    User.findOne({_id: request.params.id }, function (err, docs) {
        if (docs){
            response.status(Responses.Status.OK).json({body :docs.address});
        }else{
            response.status(Responses.Status.BAD_REQUEST).json({body :"Cannot get user address"});
        }
    })
}