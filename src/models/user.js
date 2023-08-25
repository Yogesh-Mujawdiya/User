const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 8) {
                throw new Error('رمز عبور بایستی حداقل ۸ کاراکتر باشد')
            }
            else if (value.toLowerCase().includes('password')) {
                throw new Error('کلمه عبور نمیتواند شامل password باشد.')
            }

        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('ایمیل نامعتبر می باشد!')
            }
        }
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    roleType: {
        type: Number,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('خطا در پیدا کردن کاربر!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'yogasecrettext', { expiresIn: '1h' })

    // for multiple devices at the same time
    // user.tokens = user.tokens.concat({ token })
    
    user.tokens = { token };
    await user.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//hash password
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User