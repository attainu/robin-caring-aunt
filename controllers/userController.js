const User = require('../models/userModel');
const sharp = require('sharp')


const control = {

    signup: async (req, res) => {
        const user = new User (req.body);
        try {
            await user.save();
            const token = await user.generateAuthToken();
            res.status(201).send({ user, token });
        } catch (e) {
            res.status(400).send();
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    },

    logout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((objToken) => { 
                return objToken.token !== req.token // [{id, token}, {id, token}..]
            })
            await req.user.save()       
            res.send()
        } catch (e) {
            res.status(500).send({e})
        }
    },

    logoutAll: async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    },

    userProfile: async (req, res) => {
        res.send(req.user);
    },

    updateUserProfile: async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age', 'contact'];
        const isvalidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isvalidOperation) {
            return res.status(400).send({ error: 'Invalid updates' })
        }
        try {
            /* certain mongoose query bypasses middleware (like findByIdAndUpdate())
            and perfoms operations directly on database and that is why we use special
            operation like runvalidator */
            updates.forEach(update => req.user[update] = req.body[update])
            await req.user.save()
            res.send(req.user)
    
        } catch (e) {
            res.status(400).send() // validation failure
        }
    },

    deleteUserProfile: async (req, res) => {
        try {
            await req.user.remove() //can also use findbyidanddelete
            res.send(req.user)
        } catch (err) {
            res.status(500).send(err)
        }
    },

    uploadAvatar: async (req, res) => {
        const buffer = await sharp (req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    },

    multerErrHandler: (err, req, res, next) => {
        res.status(400).send({ error: err.message })
    },

    deleteAvatar: async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    },

    getAvatar: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)

            if (!user || !user.avatar) {
                throw new Error()
            }
            res.set('Content-Type', 'image/png')
            res.send(user.avatar)

        } catch(e) {
            res.status(400).send()
        }
    }
}

module.exports = control;