const request = require('request');
const app = require('express')()
const port = 4000;


app.listen(port, function () {
    console.log(`app listening on port ${port}`)
})


app.get('/', async (req, res) => {
    var cnpj = req.query.cnpj
    

    let optionsCNPJ = {
        'method': 'GET',
        'url': `https://api.nudata.com.br/demoQueryRFB/${cnpj}`
    }
    let registros = await getRegistros(optionsCNPJ)

    res.status(200).send(registros);

})

const getRegistros = (optionsCNPJ) => {
    return new Promise((resolve, reject) => {
        request(optionsCNPJ, (error, response) => {
            if (error) return reject(err);
            try {
                resolve(JSON.parse(response.body))
            } catch (error) {
                reject(error)
            }
        })
    })
}




