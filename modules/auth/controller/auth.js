import { userModel } from "../../../DB/model/user.model.js"
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { myEmail } from "../../../services/sendEmail.js"
import { sendEmail } from "nodejs-nodemailer-outlook"

import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';
// Route2022  
export const signup = async (req, res) => {
    try {
        const { email, password, userName } = req.body
        const user = await userModel.findOne({ email }).select("email") // {} null
        if (user) {
            res.json({ message: "Email exist" })
        } else {
            const hashPassword = await bcrypt.hash(password, parseInt(process.env.saltRound))
            const newUser = new userModel({ email, password: hashPassword, userName })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id }, process.env.tokenEmailSignature, { expiresIn: 60 * 60 })
            const refToken = jwt.sign({ id: savedUser._id }, process.env.tokenEmailSignature, { expiresIn: 60 * 2 })
            const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/requestEmailToken/${refToken}`

            const message = `
            <a href ='${link}'> Follow to activate u account </a>
            <br>
            <br>
            <a href ='${link2}'> Request new confirmation email </a>

            `
            myEmail(savedUser.email, message)
            res.status(StatusCodes.CREATED).json({ message: "Done", savedUser, link  , status: getReasonPhrase(StatusCodes.CREATED)})
        }
    } catch (error) {
        res.json({ message: "catch error", error })
    }
}
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        email =5
        const user = await userModel.findOne({ email }) // {} null
        if (!user) {
            res.status(400).json({ message: "in-valid login data email" })
        } else {
            if (!user.confirmEmail) {
                res.json({ message: "please confirm your email first" })
            } else {
                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                    res.status(400).json({ message: "in-valid login data password" })

                } else {
                    const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.toekenSignature,
                        { expiresIn: (60 * 60) * 24 })
                    res.status(200).json({ message: "Done", token })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error , status:getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
}
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.tokenEmailSignature)
        const user = await userModel.updateOne({ _id: decoded.id, confirmEmail: false },
            { confirmEmail: true }, { new: true })
        console.log(user);
        user.modifiedCount ? res.json({ message: "Done plz login" }) :
            res.json({ message: "In-valid account or already confirmed" })

    } catch (error) {
        res.json({ message: "catch error", error })

    }

}

export const refreshToken = async (req, res) => {
    try {
        const token = req.params.token
        const decoded = jwt.verify(token, process.env.tokenEmailSignature)
        if (!decoded || !decoded.id) {
            res.json({ message: "In-valid token" })
        } else {
            const user = await userModel.findById(decoded.id).select('userName email confirmEmail')
            if (!user) {
                res.json({ message: "Not register account" })
            } else {
                if (user.confirmEmail) {
                    res.json({ message: "Already confirmed" })
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.tokenEmailSignature, { expiresIn: 2 * 60 })
                    const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`

                    const message = `
                <a href ='${link}'> Follow to activate u account </a>
    
                `
                    myEmail(user.email, message)
                    res.json({ message: "Done", link })

                }
            }
        }
    } catch (error) {
        res.json({ message: "Catch error", error })

    }

}

export const sendCode = async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({ email }).select('userName email')
    if (!user) {
        res.json({ message: "Not register account" })
    } else {
        // const accessCode = Math.floor(Math.random() * (1999 - 1970 + 1)) + 1970
        const accessCode = nanoid()
        await userModel.findByIdAndUpdate(user._id, { code: accessCode })
        myEmail(user.email, `<h1>access code :  ${accessCode} </h1>`)
        res.json({ message: "Done check u email" })
    }
}


export const forgetPassword = async(req, res) => {
    const { email, code, password } = req.body
    if (!code) {
        res.json({ message: "Account dosn't require forget password yet!" })
        
    } else {
        const user  = await  userModel.findOne({email , code})
        if (!user) {
            res.json({ message: "In-valid account or In-valid OTP code" })
        } else {
            const hashPassword  = await  bcrypt.hash(password , parseInt(process.env.saltRound))
            await userModel.updateOne({_id:user._id} , {code:null , password : hashPassword})
            res.json({message:"Done"})
            
        } 
    }
  
}