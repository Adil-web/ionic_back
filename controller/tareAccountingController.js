const { hex2dec, base64 } = require('../decoders')
const sha3_512 = require('js-sha3').sha3_512
const axios = require('axios')
const parser = require('fast-xml-parser')
const jwt = require('jsonwebtoken')

class TareAccountingController {
    async getTare(req, res) {
        const { token } = req.body
        const { username, password } = jwt.decode(token)
        console.log(username, password)
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
    <function name=\"f_api_c_t_a_c_get_object\">
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
                    dataXml = dataXml.sbapi.body.response.objects.object
                    res.json(dataXml)
                }).catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new TareAccountingController()
