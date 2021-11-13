const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => {
    const {username, password} = req.body
    try {
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username, 
            password: hashPassword
        })
        req.session.user = newUser
        res.status(201).json({
            status: "success",
            data: {
                user: newUser,
            }
        })
        return
    } catch (e) {
        res.status(400).json({
            status: "fail",
        })
        return
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username})
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            })
            return
        }
        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            req.session.user = user
            res.status(200).json({
                status: "success"
            })
            return
        } else {
            res.status(400).json({
                status: "error",
                message: "Incorrect username or password"
            })
            return
        }
    } catch (e) {
        res.status(400).json({
            status: "fail",
        })
        return
    }

}