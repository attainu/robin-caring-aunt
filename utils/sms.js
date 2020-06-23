
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
const cron = require("node-cron");
const Menstrual = require('../models/menstrualModel')
const createNotifyDate = require('./date')


cron.schedule('* * * * *', async () => {
    console.log("Running Cron Job");

    try {
        menstDtl = await Menstrual.find()
        const date = new Date()
        const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        const todaysDate = date.toLocaleString().split(',')[0]

        for (let user of menstDtl) {
            let notifyDate = user.notifyDate.toLocaleString().split(',')[0]

            if  (notifyDate === todaysDate) {
               
                await user.populate('owner').execPopulate() // Populating
                console.log(user)
                await client.messages.create({
                    to: `+91${user.owner.contact}`,
                    from: process.env.TWILIO_NO,
                    body: `Hey ${user.owner.name}! This is to notify you that from tomorrow your periods is going to begin for the current cycle.`
                })
                
                // menstDtl[count].notifyDate = createNotifyDate(dateStr, user.menstrualCycleLength)
                // console.log('After Update', menstDtl)
            }
        }
    } catch (e) {
        console.log(e)
    }
})




    
    
    