const path = require('path')
const sharp = require('sharp')
const fs = require('fs');

class ImgController {
    async getImg(req, res) {
        const { img } = req.files
        console.log(img)
        const fileName = Date.now().toString() + '.jpg'
        await img.mv(path.resolve(__dirname, '..', 'static', fileName))
        
        setTimeout(() => {
            sharp(path.resolve(__dirname, '..', 'static', fileName))
            .resize(720)
            .jpeg({ mozjpeg: true })
            .toFile(fileName, (err, info) => {
                if(err) {
                    console.log(err)
                    return
                }
                fs.unlink(path.resolve(__dirname, '..', 'static', fileName), (err) => {
                    if (err) {
                        throw err;
                    }
                    fs.readFile(path.resolve(__dirname, '..', fileName), (err, data) => {
                        if (err) throw err
                        const imgBase64 = Buffer.from(data).toString('base64')
                        fs.unlink(path.resolve(__dirname, '..', fileName), (err) => {
                            if (err) {
                                res.json({error: err})
                                throw err;
                            }
                        });
                        res.json(info)
                    })
                });
            });
        }, 200)
    }


    test(req, res) {
        res.sendFile(path.join(__dirname, '../1625056159011.jpg'))
    }
}



module.exports = new ImgController()
