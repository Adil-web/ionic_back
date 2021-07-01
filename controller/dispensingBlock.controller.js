const db = require('../db')
const { hex2dec, base64 } = require('../decoders')
const sha1 = require('js-sha1')
const sha3_512 = require('js-sha3').sha3_512
const axios = require('axios')
const parser = require('fast-xml-parser')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs');
const jwt = require('jsonwebtoken')

let imgBase64 = ""
let fileName = ""

function toSharp() {
    sharp(path.resolve(__dirname, '..', 'static', fileName))
    .resize(720)
    .jpeg({ mozjpeg: true })
    .toFile(fileName, (err, info) => {
        if(err) {
            console.log(err)
        }
    })
    .toBuffer()
    .then( () => {
        fs.readFile(path.resolve(__dirname, '..', fileName), (err, data) => {
            if (err) {
                throw err
            } else {
                imgBase64 = Buffer.from(data).toString('base64')
            }
            console.log('ok')
        })
    })
    .catch( err => console.log(err))
}

class DispensingBlockController {

    async test(req, res) {
        // const {name, surname} = req.body
        // console.log(req.body)
        // const newPerson = await db.query('INSERT INTO person (name, surname) values ($1, $2) RETURNING *', [name, surname])
        // res.json(newPerson.rows[0])

        const {firstName, lastName, phone} = req.body
        const iid = hex2dec("C057003")
        const pass = sha3_512("sa19910109yqtwre")
        const auth = base64("<authdata msg_id=\"1\" user=\"sim.api\" password=\"" + pass + "\" msg_type=\"5000\" user_ip=\"127.0.0.1\" />")
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
<function name=\"f_api_test_create_object\">
<arg name=\"firstname\">${firstName}</arg>
<arg name=\"lastname\">${lastName}</arg>
<arg name=\"phone\">${phone}</arg>
</function>
</body>
</sbapi>`

        const config = {
            headers: {'Content-Type': 'text/xml'}
        }

        let dataXml

        await axios.post('http://31.169.9.82/api/', xmlCreateObject, config).then((response) => {
            dataXml = parser.parse(response.data)
            // console.log(xmlCreateObject)
            console.log(response.data)
            dataXml = dataXml.sbapi.body.response.object
        }).catch((err) => console.log(err))
let getXmlObject = 
`<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<sbapi>
<header>
<interface id=\"${iid}\" version=\"8\" />
<message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
<error id=\"0\" />
<auth pwd=\"hash\">${auth}</auth>
</header>
<body>
<function name=\"f_api_test_get_object\">
<arg name=\"object\">${dataXml}</arg>
</function>
</body>
</sbapi>`
        axios.post('http://31.169.9.82/api/', getXmlObject, config).then((response) => {
            let getXml = parser.parse(response.data)
            console.log(response.data)
            console.log(getXml.sbapi.body.response.objects)
            // console.log(getXml.sbapi.body.response.objects.forEach(e=> e.object.number))
            let get = {objects: []}
            get.objects.push(
                {
                    number: getXml.sbapi.body.response.number,
                    created: getXml.sbapi.body.response.created,
                    creator: getXml.sbapi.body.response.creator,
                    group: getXml.sbapi.body.response.group,
                }
            )
            console.log(get)
        }).catch((err) => console.log(err))
    }

    async createTest(req, res) {
        const newPerson = await db.query('INSERT INTO test (name, test) values ($1, $2) RETURNING *', ['Lol', 'test'])
        res.json(newPerson.rows[0])
    }

    async getAllTests(req, res) {
        const tests = await db.query('SELECT * FROM test')
        res.json(tests.rows)
    }

    async getImg(req, res) {
        const { img } = req.files
        console.log(img)
        fileName = Date.now().toString() + '.jpg'
        await img.mv(path.resolve(__dirname, '..', 'static', fileName))
        toSharp()
        res.json('ok...')
    }

    async createDispensing(req, res) {
        console.log(fileName)
        const {o_field, o_settlement, o_chemical, o_consumption_rate, o_container, o_amount, 
                o_issue_date, o_issue_time, o_bar_code, o_author, o_author_department, o_author_position,
                o_date_created, o_recipient, o_recipient_department, o_recipient_position, o_reconciling,
                o_reconciling_department, o_reconciling_position, o_time_created, o_img_file, token
            } = req.body
        const { username, password } = jwt.decode(token)
        const iid = hex2dec("C057003")
        const pass = sha3_512(password)
        const auth = base64("<authdata msg_id=\"1\" user=\"" + username + "\" password=\"" + pass + "\" msg_type=\"5000\" user_ip=\"127.0.0.1\" />")
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
<function name=\"f_api_appc_create_object\">
<arg name=\"field_number\">${o_field}</arg>
<arg name=\"locality\">${o_settlement}</arg>
<arg name=\"drug_name\">${o_chemical}</arg>
<arg name=\"chemical_consumption_rate\">${o_consumption_rate}</arg>
<arg name=\"container\">${o_container}</arg>
<arg name=\"quantity\">${o_amount}</arg>
<arg name=\"date_of_issue\">${o_issue_date}</arg>
<arg name=\"time_of_issue\">${o_issue_time}</arg>
<arg name=\"bar_code\">${o_bar_code}</arg>
<arg name=\"recipient\">${o_recipient}</arg>
<arg name=\"reconciling\">${o_reconciling}</arg>
<arg name=\"photo\">${imgBase64}</arg>
</function>
</body>
</sbapi>`

        // console.log(xmlCreateObject)

        const config = {
            headers: {'Content-Type': 'text/xml'}
        }

        let dataXml

        await axios.post('http://31.169.9.82/api/', xmlCreateObject, config).then((response) => {
            dataXml = parser.parse(response.data)
            dataXml = dataXml.sbapi.body.response
            console.log(response.data)
        }).catch((err) => console.log(err))
let getXmlObject = 
`<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<sbapi>
<header>
<interface id=\"${iid}\" version=\"8\" />
<message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
<error id=\"0\" />
<auth pwd=\"hash\">${auth}</auth>
</header>
<body>
<function name=\"f_api_appc_get_object\">
<arg name=\"object\">${dataXml}</arg>
</function>
</body>
</sbapi>`

//192.168.21.239
//31.169.9.82
        await axios.post('http://31.169.9.82/api/', getXmlObject, config).then((response) => {
            let getXml = parser.parse(response.data)
            let get = {objects: []}
            get.objects.push(
                {
                    number: getXml.sbapi.body.response.number,
                    created: getXml.sbapi.body.response.created,
                    creator: getXml.sbapi.body.response.creator,
                    group: getXml.sbapi.body.response.group,
                }
            )
            res.json('Успешно...')
        }).catch((err) => console.log(err))
    }

    // async getUsers(req, res) {
    //     const users = await db.query('SELECT * FROM person')
    //     res.json(users.rows)
    // }
    
    // async getOneUser(req, res) {
    //     const id = req.params.id
    //     const user = await db.query('SELECT * FROM person WHERE id = $1', [id])
    //     res.json(user.rows[0])
    // }
    
    // async updateUser(req, res) {
    //     const {id, name, surname} = req.body
    //     const user = await db.query('UPDATE person set name = $1, set surname = $2 where id = $3 RETURNING *', [name, surname, id])
    //     res.json(user.rows[0])
    // }
    
    // async deleteUser(req, res) {
    //     const id = req.params.id
    //     const user = await db.query('DELETE FROM person WHERE id = $1', [id])
    //     res.json(user.rows[0])
    // }
}

module.exports = new DispensingBlockController()