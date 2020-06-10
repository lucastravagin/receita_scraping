const puppeter = require('puppeteer')
const app = require('express')()
const port = 4000

app.listen(port, function() {
    console.log(`app listening on port ${port}`)
})

app.get('/', async (req, res) => {
    var cnpj = req.query.cnpj
    let url = `https://cnpj.biz/${cnpj}`
    let registros = await scrape(url)
    res.status(200).send(registros)
})


let scrape = async (url) => {
    //const url = 'https://cnpj.biz/42278473000103'
    try {
        const browser = await puppeter.launch({args: ['--no-sandbox']})
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2' })

        const result = await page.evaluate(() => {
            let dadosCNPJ = {}

            dadosCNPJ.cnpj = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(2) > b").textContent

            dadosCNPJ.razao_social = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(3) > b").textContent

            dadosCNPJ.nome_fantasia = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(4) > b").textContent

            dadosCNPJ.data_abertura = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(5) > b").textContent

            dadosCNPJ.capital_social = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(6) > b").textContent

            dadosCNPJ.tipo = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(7) > b").textContent

            dadosCNPJ.situacao = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(8) > b").textContent

            dadosCNPJ.natureza_juridica = document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(9) > b").textContent

            dadosCNPJ.contatos = {
                emai: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(12) > b").textContent,
                telefone1: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(13) > b:nth-child(2)").textContent,
                telefone2: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(13) > b:nth-child(5)").textContent

            }
            dadosCNPJ.localizacao = {
                logradouro: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(15) > b").textContent,
                complemento: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(16) > b").textContent,
                bairro: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(17) > b").textContent,
                cep: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(18) > b").textContent,
                municipio: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(19) > b").textContent,
                estado: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(20) > b").textContent,
                correspondencia: document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(21) > b").textContent
            }
            dadosCNPJ.atividades = {
                principal: document.querySelector("body > div.container > div > div > div.col.c9-2 > div:nth-child(23) > div").textContent,
            }
            const socios = (() => {
                const obj = { "value": `${document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(46)")}` };
                console.log(typeof obj.value)
                if (obj.value != "" || obj.value != null || obj.value != undefined) {
                    console.log('Entrouuu')
                    return document.querySelector("body > div.container > div > div > div.col.c9-2 > p:nth-child(46)").textContent
                }
            })
            dadosCNPJ.socios = socios()

            return dadosCNPJ

        })

        browser.close()
        return result
        //await page.screenshot({path: 'cnpj.png'})

    } catch (error) {
        console.log(error);
    }
}

