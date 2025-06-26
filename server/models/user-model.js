const mongoose = require("mongoose")
const {Schema} = mongoose
const bcrypt = require("bcrypt")

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// instance
userSchema.methods.isStudent = function(){
    console.log("this.role",this.role === "student",this);
    
    return this.role === "student"
}
userSchema.methods.isInstructor = function(){
    return this.role === "instructor"
}
userSchema.methods.comparePassword = async function (password, cb) {
    let result 
    try{
        result = await bcrypt.compare(password, this.password )
        return cb(null, result)
    }catch(e){
        return cb(e, result)
    }
}

// mongoose middleware
// 若使用者為新用戶，或正在修改密碼，則須將密碼進行雜湊
userSchema.pre("save", async function (next){
    // 使用this則不可用arrow function
    // this代表mongoDB的Document
    if(this.isNew || this.isModified("password")){
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
    }
    next()
})

module.exports = mongoose.model("User", userSchema);