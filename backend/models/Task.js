const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user', //Ties a task to a specific developer
        },
        title: {
            type: String,
            requird: [true, 'Please add a task title'],
        },
        description: {
            type: String,
            requird: [true, 'Please add a description'],
        },
        status: {
            type: String,
            enum: ['To-Do', 'In Progress', 'Done'],
            default: 'To-Do',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },

    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
)

module.exports = mongoose.model('Task', taskSchema);