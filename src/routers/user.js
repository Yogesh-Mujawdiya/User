const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)
    console.log(user)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        const model = {
            user: user
            , token: token
        }
        res.status(201).send(model)
    }
    catch (e) {
        res.status(400).send()
    }
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const model = {
            user: user
            , token: token
        }
        res.status(200).send(model)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})
router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (e) {
        res.status(500).send()
    }
})
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'email', 'address', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid update' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        res.send(user)
    }
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router