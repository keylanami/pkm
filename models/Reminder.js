import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        judul: {
            type: String,
            required: true
        },

        nominal: {
            type: String,
            required: true
        },

        jam: {
            type: String,
            required: true
        },
        
        tanggal_jatuh_tempo: {
            type: Date,
            min: 1,
            max:  31,
            required: true
        },

        is_active: {
            type: Boolean,
            required: true
        }
      
    },
    {
        timestamps: true
    }
)

export default mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);