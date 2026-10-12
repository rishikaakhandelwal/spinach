import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stories"
    }
}, {timestamps: true})

viewSchema.index({userId: 1, storyId: 1}, {unique: true});

export const View = mongoose.model("View", viewSchema)