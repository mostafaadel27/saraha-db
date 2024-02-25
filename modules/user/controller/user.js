import { userModel } from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
export const userProfile = async (req, res) => {
    const user = await userModel.findById(req.user._id)
    res.json({ message: "User module", user })
}


export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await userModel.findById(req.user._id)
    const match = await bcrypt.compare(oldPassword, user.password)
    if (!match) {
        res.json({ message: "In-valid Password" })
    } else {
        const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
        await  userModel.findOneAndUpdate({_id:user._id} , {password:hashPassword});
        res.json({message:"Done"})
    }
}

