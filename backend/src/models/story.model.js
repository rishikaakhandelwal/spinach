import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    state: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    publishedAt: {
        type: Date
    },
    lastEditedAt: {
        type: Date
    },
    // repostsCount: {
    //     type: Number,
    //     default: 0
    // },
}, { timestamps: true })

export const Story = mongoose.model("Story", storySchema)

//frontend me tiptap editor use krenge