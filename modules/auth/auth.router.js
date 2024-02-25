import { Router } from 'express'
import { auth } from '../../middelwear/auth.js'
import { validation } from '../../middelwear/validation.js'
import * as validators from './auth.validators.js'
import * as authController from './controller/auth.js'
const router = Router()



router.get("/", (req, res) => {
    res.json({ message: "Auth module" })
})


router.post("/signup", validation(validators.signup),authController.signup)

router.get("/confirmEmail/:token",validation(validators.confirmEmail) ,authController.confirmEmail)
router.get("/requestEmailToken/:token",validation(validators.confirmEmail), authController.refreshToken)

router.post("/signin", validation(validators.signin) ,authController.signin)


router.patch("/sendCode" , authController.sendCode)
router.patch("/forgetPassword" , authController.forgetPassword)

export default router