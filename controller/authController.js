const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult, body } = require('express-validator')
const { secret } = require('../config')
const { default: axios } = require('axios')
const { hex2dec, base64 } = require('../decoders')
const sha1 = require('js-sha1')
const sha3_512 = require('js-sha3').sha3_512
const parser = require('fast-xml-parser')
const fs = require("fs");

const generateAccessToken = (username, password) => {
    const payload = {
        username,
        password
    }
    return jwt.sign(payload, secret, {expiresIn: "24H"})
}

class authController {
    // async registration(req, res) {
    //     try {
    //         const errors = validationResult(req)
    //         if(!errors.isEmpty()) {
    //             return res.status(400).json({message: "Ошибка при регистрации", errors})
    //         }
    //         const {username, password, role} = req.body
    //         const candidate = await db.query('SELECT * FROM users WHERE username = $1', [username])
    //         if(candidate.rows[0]) {
    //             return res.status(400).json({message: "Пользователь с таким именем уже существует"})
    //         }
    //         let salt = bcrypt.genSaltSync(7);
    //         const hashPassword = bcrypt.hashSync(password, salt)
    //         await db.query('INSERT INTO users (username, password, role) values ($1, $2, $3) RETURNING *', [username, hashPassword, role])
    //         return res.json({message: "Пользователь успешно зарегистрирован"})
    //     } catch (e) {
    //         console.log(e)
    //         res.status(400).json({message: "Registration error"})
    //     }        
    // }
    
    async login(req, res) {
        try {
            const { username, password } = req.body
            const iid = hex2dec("C057003")
            const pass = sha3_512(password)
            const auth = base64("<authdata msg_id=\"1\" user=\"" + username + "\" password=\"" + pass + "\" msg_type=\"9000\" user_ip=\"127.0.0.1\" />")
            let xmlCreateObject =
`<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<sbapi>
<header>
<interface id=\"${iid}\" version=\"8\" />
<message ignore_id=\"yes\" id=\"1\" type=\"9000\" created=\"2021-05-05T07:14:16z\"/>
<error id=\"0\" />
<auth pwd=\"hash\">${auth}</auth>
</header>
<body>
</body>
</sbapi>`

            const config = {
                headers: { 'Content-Type': 'text/xml' }
            }
            const options = {
                attributeNamePrefix: "",
                ignoreAttributes: false,
            }
            let dataXml
//             https://bpm.atameken-agro.com/api/index.php
            res.json("test")
            axios.post('https://bpm.atameken-agro.com/api/', xmlCreateObject, config)
                .then(async response => {
//                     res.json(response)
                    try {
                        dataXml = parser.parse(response.data, options)
                        dataXml = dataXml.sbapi.header.error
                        if (dataXml['id'] == '0') {
                            const token = generateAccessToken(username, password)
                            return res.json({ token })
                        }
                        return res.status(400).json({ message: 'Неверный логин или пароль' })
                    } catch (e) {
                        fs.appendFile("auth-logs" + ".txt", e, function (error) {
                            if (error) throw error
                        })
                        res.json(e)
                    }
                }).catch(e => {
                    fs.appendFile("auth-logs" + ".txt", e, function (error) {
                        if (error) throw error
                    })
                    res.json(e)
                })
        } catch (err) {
            console.log(err)
            fs.appendFile("auth-logs" + ".txt", err, function (error) {
                if (error) throw error
            })
            res.status(400).json({ message: "Login error" })
        }
    }

    async getDicts(req, res) {
        try {
            const username = 'sim.api'
            const iid = hex2dec("C057003")
            const pass = sha3_512('sa19910109yqtwre')
            const auth = base64("<authdata msg_id=\"1\" user=\""+username+"\" password=\""+pass+"\" msg_type=\"5000\" user_ip=\"127.0.0.1\" />")
            let xmlCreateObject = 
    `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
    <sbapi>
    <header>
    <interface id=\"${iid}\" version=\"8\" />
    <message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
    <error id=\"0\" />
    <auth pwd=\"hash\">${auth}</auth>
    </header>
    <body>
    <function name=\"f_api_np_get_dict\">
    </function>
    </body>
    </sbapi>`

            const config = {
                headers: {'Content-Type': 'text/xml'}
            }
            const options = {
                attributeNamePrefix : "",
                ignoreAttributes : false,
            }
            let dataXml
            axios.post('https://bpm.atameken-agro.com/api/', xmlCreateObject, config)
                .then(async response => {
                    dataXml = parser.parse(response.data, options)
                    dataXml = dataXml.sbapi.body.response.dicts.dict
                    res.json(dataXml)
                }).catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
    }

    async getUser(req, res) {
        const { token } = req.body
        const { username, password } = jwt.decode(token)
        try {
            const iid = hex2dec("C057003")
            const pass = sha3_512(password)
            const auth = base64("<authdata msg_id=\"1\" user=\""+username+"\" password=\""+pass+"\" msg_type=\"5000\" user_ip=\"127.0.0.1\" />")
            let xmlCreateObject = 
    `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
    <sbapi>
    <header>
    <interface id=\"${iid}\" version=\"8\" />
    <message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
    <error id=\"0\" />
    <auth pwd=\"hash\">${auth}</auth>
    </header>
    <body>
    <function name=\"f_api_user_get\">
    </function>
    </body>
    </sbapi>`

            const config = {
                headers: {'Content-Type': 'text/xml'}
            }
            const options = {
                attributeNamePrefix : "",
                ignoreAttributes : false,
            }
            let dataXml
            axios.post('https://bpm.atameken-agro.com/api/', xmlCreateObject, config)
                .then(async response => {
                    dataXml = parser.parse(response.data, options)
                    dataXml = dataXml.sbapi.body.response.users.user
                    console.log(dataXml)
                    res.json(dataXml)
                }).catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
    }
    async getUsers(req, res) {
        const { token } = req.body
        const { username, password } = jwt.decode(token)
        try {
            const iid = hex2dec("C057003")
            const pass = sha3_512(password)
            const auth = base64("<authdata msg_id=\"1\" user=\""+username+"\" password=\""+pass+"\" msg_type=\"5000\" user_ip=\"127.0.0.1\" />")
            let xmlCreateObject = 
    `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
    <sbapi>
    <header>
    <interface id=\"${iid}\" version=\"8\" />
    <message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
    <error id=\"0\" />
    <auth pwd=\"hash\">${auth}</auth>
    </header>
    <body>
    <function name=\"f_api_users_all_get\">
    </function>
    </body>
    </sbapi>`

            const config = {
                headers: {'Content-Type': 'text/xml'}
            }
            const options = {
                attributeNamePrefix : "",
                ignoreAttributes : false,
            }
            let dataXml
            axios.post('https://bpm.atameken-agro.com/api/', xmlCreateObject, config)
                .then(async response => {
                    dataXml = parser.parse(response.data, options)
                    dataXml = dataXml.sbapi.body.response.users.user
                    // console.log(dataXml)
                    res.json(dataXml)
                }).catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new authController()
