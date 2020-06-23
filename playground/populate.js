// const Menstrual = require('./models/menstDtlModel')

// const main = async () => {
//     data = await Menstrual.findById("5eef9028b84b37282c65ca74")
//     await data.populate('owner').execPopulate()
//     console.log(data.owner)
// }
// main()

const User = require('./models/userModel')

const main = async () => {
    data = await User.findById("5eefb2416878ab1f08857e94")
    await data.populate('menstrualDtls').execPopulate()
    console.log(data.menstrualDtls)
}
main()