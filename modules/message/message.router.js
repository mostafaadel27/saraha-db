import { Router } from 'express'
import { auth } from '../../middelwear/auth.js'
import * as messageController from './controller/message.js'
const router = Router()



router.get("/", auth(), messageController.myMessages)


router.post("/:userId", messageController.sendMessage)

router.delete("/:id", auth(), messageController.deleteMessage)


export default router