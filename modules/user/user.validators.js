

import joi from 'joi'


export const updatePassword = {
    body: joi.object().required().keys({
        oldPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cPassword: joi.string().valid(joi.ref('newPassword')).required(),
        // flag: joi.boolean().truthy(1).falsy(0).sensitive({ enabled: true }).required()
        // flag: joi.number().integer().min(15).max(60).required()
        flag: joi.array().items( joi.object({
            a: joi.string(),
            b: joi.number()
          })).required()


    }),

    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}