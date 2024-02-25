

import nodeoutlook from 'nodejs-nodemailer-outlook'
export function myEmail(dest , message) {

    
    nodeoutlook.sendEmail({
        auth: {
            user: "routefridayweek8@outlook.com",
            pass: "1478530123Rr"
        },
        from: 'routefridayweek8@outlook.com',
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,
        text: 'This is text version!',
       
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
}