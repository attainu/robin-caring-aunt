import client from `twilio/${process.env.ACCOUNT_SID},${process.env.AUTH_TOKEN}`
import cron from 'node-cron'
import Menstrual from '../models/menstrualModel'
import createNotifyDate from './date'

/*
I'M USING MY TWILIO SIGNIN CREDENTIALS FOR TESTING PLEASE CHANGE IT IF YOU ARE USING YOURS
*/

cron.schedule('0 10 * * *', async () => {
    console.log("Running Cron Job");

    try {
        menstDtl = await Menstrual.find()
        const date = new Date()
        // const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
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




    
    
    