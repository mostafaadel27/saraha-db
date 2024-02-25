import { messageModel } from "../../../DB/model/message.js"
import { userModel } from "../../../DB/model/user.model.js"

export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.params
        const { text } = req.body
        const user = await userModel.findById(userId).select("userName")
        if (!user) {
            res.json({ message: "in-valid reciver ID" })
        } else {
            const newMessage = new messageModel({ reciverId: userId, text })
            const savedMessage = await newMessage.save()
            res.json({ message: "Done", savedMessage })
        }
    } catch (err) {
        res.json({ message: "catch error", err })

    }
}


export const myMessages = async (req, res) => {
    const messageList = await messageModel.find({ reciverId: req.user._id }).populate({
        path:'reciverId',
        match:{
            gender:"Fmale"
        }
    })
    res.json({ message: "Message module", messageList })
}


export const deleteMessage = async (req, res) => {
    const { id } = req.params
    const message = await messageModel.deleteOne({ reciverId: req.user._id, _id: id })
    message.deletedCount ? res.json({ message: "Done" }) :
        res.json({ message: "In-valid message ID or you are not auth" })
}