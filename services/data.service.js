const jwt = require('jsonwebtoken')
const db = require('./db')
const { v4: uuidv4 } = require('uuid')

const register = (name, uname, password) => {

    return db.User.findOne({ uname }).then(user => {
        if (user) {
            return {
                statuscode: 422,
                status: false,
                message: "Username Already Exist!!!"
            }
        }
        else {
            //Creating the db model with new user
            const newUser = new db.User({
                name,
                uname,
                password,
                reminders: []
            })
            newUser.save() //Saving the newuser into the db
            return {
                statuscode: 200,
                status: true,
                message: "Successfully registered....."
            };
        }
    })
}

const login = (uname, password) => {
    return db.User.findOne({ uname, password }).then(user => {
        if (user) {
            const token = jwt.sign({
                currentNo: uname
            }, 'supersecretkey123')

            return {
                statuscode: 200,
                status: true,
                message: "Successfully Logined.....",
                token,
                currentUser: user.name
            };
        }
        else {
            return {
                statuscode: 422,
                status: false,
                message: "invalid credentials!!!!"
            }
        }
    })
}

const create = (req, event_data, event_date) => {
    let uno = uuidv4();
    let uname = req.currentuname;
    return db.User.findOne({ uname }).then(user => {
        if (!user) {
            return {
                statuscode: 422,
                status: false,
                message: "invalid!!!!"
            }
        }
        else {
            user.reminders.push({
                uid: uno,
                event: event_data,
                date: event_date
            })
            user.save()
            return {
                statuscode: 200,
                status: true,
                message: "Event Added Successfully"
            }
        }
    })
}


const view = (req) => {
    let uname = req.currentuname;
    return db.User.findOne({ uname })
        .then(user => {
            if (user) {
                return {
                    statuscode: 200,
                    status: true,
                    reminders: user.reminders
                }
            }
            else {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid user!!!!"
                };
            }
        })
}



const editEvent = (req, eventData, eventDate, uid) => {
    let uname = req.currentuname;
    let data = {
        uid: uid,
        event: eventData,
        date: eventDate
    }
    return db.User.updateOne(
        { uname, "reminders.uid": uid },
        { $set: { "reminders.$": data } })
        .then(user => {
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    reminders: user.reminders,
                    message: "Event edited Successfully"
                }
            }
        })
}


// const editEvent=(req, eventData,eventDate,index) => {
//     let uname = req.currentuname;
//     return db.User.updateOne(
//         {uname},
//         {$set :{[`reminders.${index}`]:{event:eventData,date:eventDate}}})
//         .then(user=>{
//             if (!user) {
//                 return {
//                     statuscode: 422,
//                     status: false,
//                     message: "invalid!!!!"
//                 }
//             }
//             else {
//                 return {
//                     statuscode: 200,
//                     status: true,
//                     reminders:user.reminders,
//                     message: "Event edited Successfully"
//                 }
//             }
//         })
// }


const deleteEvent = (req, uid) => {
    let uname = req.currentuname;
    return db.User.updateOne(
        { uname }, { $pull: {reminders:{uid}}})
        .then(user => {
            if (!user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "invalid!!!!"
                }
            }
            else {
                return {
                    statuscode: 200,
                    status: true,
                    reminders: user.reminders,
                    message: "Event deleted Successfully"
                }
            }
        })
}

module.exports = {
    register,
    login,
    create,
    view,
    editEvent,
    deleteEvent
}