const dateCalc = (req, res, next) => {

    if (req.body.pastPeriodDate) {
        
        // Adding notify date to menstDtls data and updating past period date by 1
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        
        const dateArray = req.body.pastPeriodDate.split('-') 
        const intDateArray = dateArray.map(value => Number(value)) 
        
        const date = new Date(intDateArray[0], intDateArray[1] - 1, intDateArray[2]) // Date 2020, 6, 15

        const newDate = date.addDays(req.body.menstrualCycleLength)
        const notifyDate = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`
        
        req.body.pastPeriodDate = date
        req.body.notifyDate = notifyDate
    }
    next()
}

module.exports = dateCalc
