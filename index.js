const express = require('express')
const app = express()
const port = 3005
const path = require('path')
const fetch = require('node-fetch')
const { url } = require('inspector')

// proceed form post method data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const key = '6e366b3ae34dc6bdd56794422668a907'

const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(data => {
                let description = data.weather[0].description
                let city = data.name
                let temp = Math.round(parseFloat(data.main.temp) - 273.15)
                let result = {
                    description: description,
                    city: city,
                    temp: temp,
                    error: null
                }
                resolve(result)
            })
            .catch(error => {
                reject(error)
            })
    })
}

app.all('/', (req, res) => {
    let city
    if (req.method == 'GET') {
        city = 'Tartu'
    }
    if (req.method == 'POST') {
        city = req.body.cityname
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
        .then(data => {
            res.render('index', data)
        })
        .catch(error => {
            if (city == '') { 
            res.render('index', { error: 'Sisestage korrektne linna nimi' })
            } else {   
            res.render('index', { error: 'Problem with getting data, try again' })}
        })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
