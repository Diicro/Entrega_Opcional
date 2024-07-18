import passport from "passport";
import local from "passport-local";
import userModel from "../../dao/models/user.model.js"
import cartModel from "../../dao/models/cart.model.js"
import { cartModos } from "../modos/cart.modos.js";
import GitHubStrategy from "passport-github2"
import config from "../../config.js";
import bcrypt from "bcrypt"


const localStategy=local.Strategy;

const initAuthStrategy=()=>{
    passport.use("login",new localStategy({passReqToCallback:true,usernameField:"email",passwordField:"passWord"},
        async (req,username,password,done)=>{
            try{
                const findUser= await userModel.findOne({email:username}).lean();
                if(!findUser){
                    return done(null,"false")
                  }else if( bcrypt.compareSync(password,findUser.passWord)){
                    const {passWord,...restUser}=findUser;
                    const newCart= await cartModos.createCart() 
                    const carttoUser= await userModel.findOneAndUpdate({email:username},{cart:newCart},{new:true})
                    const userWithCart={cart:newCart,...restUser}
                    
                  
                    return done(null,userWithCart)
                    
                    

                 }else{return done(null,"false")}
            }catch(error){
                return done(error,false)
            }
        }
    ))
    passport.use("register",new localStategy({passReqToCallback:true,usernameField:"email",passwordField:"passWord"},
        async (req,username,password,done)=>{
            const firstName=req.body.firstName
            const lastName=req.body.lastName
            try{ 
                const findUserOnSistem= await userModel.findOne({email:username})
                if(findUserOnSistem){
                    return done(error,"false")
                }else{
                    const user={
                    firstName:firstName,
                    lastName:lastName,
                    email:username,
                    passWord: bcrypt.hashSync(password,bcrypt.genSaltSync(10))}
                 return done (null,user)
                } 
            }catch(error){return done(error,false)}
        }
    ))
    passport.use("ghlogin",new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URI},
        async(req, accessToken, refreshToken, profile, done)=>{
        try{
            const email = profile._json.email;
            console.log(email)
            if (email){
                const findUser=await userModel.findOne({email:email})
                if (!findUser){
                    const user={
                        firstName: profile._json.name.split(' ')[0],
                        lastName: profile._json.name.split(' ')[1],
                        email: email,
                        password: "none"}
                        const profilesucces= await userModel.create(user);

                        return done(null,profilesucces)
                }else{return done(null,findUser)}
                
            }   else{return done (null,"false")}

        }catch(error){return done(error,false)}

    }))
    

    passport.serializeUser((user, done) => {
        done(null, user);
    });
        
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}
export default initAuthStrategy;