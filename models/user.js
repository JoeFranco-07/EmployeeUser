import mongoose from 'mongoose';


const UserSchema = mongoose.Schema(
    
    {
    
     name:{
        type:String,
        required:[true,"Please enter your product name"],
     },
     password:{
      type:String,
      required:true,
     },
      age:{
      type: Number,
      required:true,
     },
     gender:{
      type: String,
      required:true,
     },
     image:{
        type:String,
        required:false,

     },
    },
    {
    timestamps:true,
    }
);

const User = mongoose.model("User",UserSchema);
export default User;
