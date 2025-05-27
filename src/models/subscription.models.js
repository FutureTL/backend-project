import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({

    subscriber:{
        type:Schema.Types.ObjectId, //the one who is suscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, //the one to whom "suscriber" is suscribing
        ref:"User"
    }

},{timestamps:true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);