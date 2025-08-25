const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required!'],
        unique: '{VALUE} is already exists!'
    },
    firstName: {
        type: String,
        default: '',
        maxlength: [50, 'First name cannot exceed 50 characters'],
        trim: true
    },
    lastName: {
        type: String,
        default: '',
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        trim: true
    },
    password: {
        type: String,
        minlength: [5, 'password is two weak!'],
        required: [true, 'password is required!']
    },
    email: {
        type: String,
        required: [true, 'email is required!'],
        unique: '{VALUE} is already exists!'
    },
    customer_id: {
        type: String,
        required: [true, 'customer_id is required!'],
        unique: '{VALUE} is already exists!'
    },
    phone: {
        type: String,
        default: '',
        validate: {
            validator: function(v) {
                return v === '' || /^[\+]?[1-9][\d]{0,15}$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    address: {
        streetAddress: {
            type: String,
            default: '',
            maxlength: [100, 'Street address cannot exceed 100 characters']
        },
        apartment: {
            type: String,
            default: '',
            maxlength: [50, 'Apartment info cannot exceed 50 characters']
        },
        city: {
            type: String,
            default: '',
            maxlength: [50, 'City name cannot exceed 50 characters']
        },
        state: {
            type: String,
            default: '',
            maxlength: [50, 'State name cannot exceed 50 characters']
        },
        country: {
            type: String,
            default: '',
            maxlength: [50, 'Country name cannot exceed 50 characters']
        },
        zipCode: {
            type: String,
            default: '',
            maxlength: [20, 'ZIP code cannot exceed 20 characters']
        }
    },
    avatar: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator);

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('username must be unique!'));
    } else {
        next(error);
    }
});

userSchema.pre('save', function (next) {
    const user = this
    const error = user.validateSync()
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
})

const User = mongoose.model('User', userSchema)

module.exports = User;



