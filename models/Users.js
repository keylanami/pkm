import mongoose, { mongo } from "mongoose";

const UserScheme = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            unique: true,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        phone_number: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true 
    }
)

export default mongoose.models.User || mongoose.model("User", UserScheme);