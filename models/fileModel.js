const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema(
    {
        urlId: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: [true, "Owner is a mandatory field"]
        },
        filename: {
            type: String,
            required: [true, "File name is a mandatory field"]
        },
        originalname: {
            type: String,
            required: [true, "Original name is a mandatory field"]
        },
        mimetype: {
            type: String,
            required: [true, 'Mime type is a mandatory field']
        },
        size: {
            type: Number,
            required: [true, 'File size is a mandatory field']
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
        parentDirectory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'directories'
        }
    },
    {
        timestamps: true
    }
    
)

module.exports = mongoose.model.fileSchema || mongoose.model('files', fileSchema)