const mongoose = require('mongoose')

const directorySchema = new mongoose.Schema(
    {
        urlId: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'Directory owner is a mandatory field']
        },
        name: {
            type: String, 
            required: [true, 'Directory name is a mandatory field']
        },
        parentDirectory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'directories'
        },
        lastAccessAt: {
            type: Date,
        },
        lastAccessBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            validate: {
                validator: function() {
                    return this.lastAccessAt ? !!value : true;
                },
                message: 'Last access by is required when last access is given'
            }
        },
        accessList: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                },
                accessType: {
                    type: String,
                    enum: ['viewer', 'owner'],
                    default: 'viewer'
                }
            }
        ],
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model.directorySchema || mongoose.model("directories", directorySchema)