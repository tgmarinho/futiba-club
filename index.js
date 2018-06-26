const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const account = require('./account')
const admin = require('./admin')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(session({
    secret: 'fullstackdeveloper',
    resave: true,
    saveUninitialized: true
}))


const init = async () => {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'futiba_club'
    })

    app.use((req, res, next) => {
        if (req.session.user) {
            res.locals.user = req.session.user
        } else {
            res.locals.user = false
        }
        next()
    })


    app.use(account(connection))

    app.use('/admin', admin(connection))

    app.listen(3001, err => {

        if (err) {
            console.log(err)
        }

        console.log('Futiba Club server is running...');
    })


}

init();



