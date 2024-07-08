const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

dotenv.config();

const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
let DB = null;

open({
    filename: "./users.db",
    driver: sqlite3.Database
}).then((db) => {
    DB = db;
    if(db) {
        db.exec(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            domaasyncin TEXT,
            to_address TEXT,
            mail_server TEXT
        )`)
    
        db.exec(`CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT,
            password TEXT
        )`)
    } else {
        console.log("Database connection Error")
    }
})

const app = express()

app.use(express.static('./dist'))

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET || "qwert1234", { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET || "qwert1234", (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

/**
 * Enable Cors
 */
app.use(cors())

/**
 * Use body parser
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Test url
 */
app.get('/helloworld', function (req, res) {
    res.send('Hello World')
})

app.post('/api/v1/login', function (req, res) {
    const { username, password } = req.body
    DB.get('SELECT * FROM roles WHERE username = ?', username)
        .then(function(result) {
            if(result) {
                if(result.password == password) {
                    return res.status(200).json({
                        token: generateAccessToken({ username }),
                        username: result.username,
                        email: result.email,
                        id: result.id
                    });
                } else {
                    return res.status(401).json({})
                }
            } else {
                return res.status(404).json({})
            }
        })
        .catch(function(err) {
            return res.status(400).json({ msg: err.message })
        })
})

/**
 * Get user by id from database
 */
app.get('/api/v1/users/:id', authenticateToken, function (req, res) {
    DB.get('SELECT * FROM users WHERE id = ?', req.params.id)
        .then(function (result) {
            if (result) {
                return res.status(200).json({ data: result })
            }
            else return res.status(400).json({ msg: "User not found!" })
        }).catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Get all users from database
 */
app.get('/api/v1/users', authenticateToken, function (req, res) {
    DB.all('SELECT * FROM users')
        .then(function (result) {
            return res.status(200).json({ data: result })
        })
        .catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Save user data to database
 */
app.post('/api/v1/users', authenticateToken, function (req, res) {
    DB.run('INSERT INTO users (username, domain, to_address, mail_server) VALUES (?, ?, ?, ?)',
        [req.body.username,
        req.body.domain,
        req.body.to_address,
        req.body.mail_server]
    )
        .then(function (result) {
            return res.status(200).json({ msg: result })
        })
        .catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Update user data
 */
app.patch('/api/v1/users/:id', authenticateToken, function (req, res) {
    const { id } = req.params
    DB.get('SELECT * FROM users WHERE id = ?', id)
        .then(function (result) {
            if (result) {
                DB.run('UPDATE users SET username = ?, domain = ?, to_address = ?, mail_server = ? WHERE id = ?',
                    req.body.username,
                    req.body.domain,
                    req.body.to_address,
                    req.body.mail_server,
                    id
                ).then((result) => {
                    if (result) return res.status(200).json({ msg: result })
                    else return res.status(401).json({ msg: "Bad request!" })
                }).catch(function (err) {
                    return res.status(400).json({ msg: err })
                })
            }
            else return res.status(400).json({ msg: "User not found!" })
        }).catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Delete user from database
 */
app.delete('/api/v1/users/:id', authenticateToken, function (req, res) {
    DB.run('DELETE FROM users WHERE id = ?', req.params.id)
        .then(function (result) {
            return res.status(200).json({ msg: result })
        })
        .catch((err) => {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Save user data to database
 */
app.post('/api/v1/roles', authenticateToken, function (req, res) {
    DB.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [req.body.username,
        req.body.email,
        req.body.password]
    )
        .then(function (result) {
            return res.status(200).json({ msg: result })
        })
        .catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Update user data
 */
app.patch('/api/v1/roles/:id/profile', authenticateToken, function (req, res) {
    const { id } = req.params
    db.get('SELECT * FROM roles WHERE id = ?', id)
        .then(function (result) {
            if (result) {
                db.run('UPDATE roles SET username = ?, email = ? WHERE id = ?',
                    req.body.username,
                    req.body.email,
                    id
                ).then((result) => {
                    if (result) return res.status(200).json({ msg: result })
                    else return res.status(401).json({ msg: "Bad request!" })
                }).catch(function (err) {
                    return res.status(400).json({ msg: err })
                })
            }
            else return res.status(400).json({ msg: "User not found!" })
        }).catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

/**
 * Update user data
 */
app.patch('/api/v1/roles/:id/password', authenticateToken, function (req, res) {
    const { id } = req.params
    const { password_current } = req.body
    db.get('SELECT * FROM roles WHERE id = ? AND password = ?', id, password_current)
        .then(function (result) {
            if (result) {
                db.run('UPDATE roles SET password = ? WHERE id = ?',
                    req.body.password,
                    id
                ).then((result) => {
                    if (result) return res.status(200).json({ msg: result })
                    else return res.status(401).json({ msg: "Bad request!" })
                }).catch(function (err) {
                    return res.status(400).json({ msg: err })
                })
            }
            else return res.status(400).json({ msg: "User not found!" })
        }).catch(function (err) {
            return res.status(400).json({ msg: err })
        })
})

app.listen(9000, () => {
    console.log("Server started!");
})