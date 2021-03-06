var parser = require('fast-xml-parser');

const express = require('express')
const app = express()
const axios = require('axios');
const axiosRetry = require('axios-retry');

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const url = 'https://bad-api-assignment.reaktor.com/products/jackets'


let jackets = []
let accessories = []
let shirts = []
let manufacturers = []
const manufacturers1 = ['reps','abiplos','nouke','derp','xoon']
let man = []
let man1 = []
let merged = []

/* const addManufacturer = (a,b) => {
    a.forEach(element => {
        if(!b.includes(element)){
            manufacturers.push(element)
        }
    });
} */

const merge = (array1, array2) => 
    array1.map(itm => ({
        ...array2.find((item) => (item.id === itm.id) && item),
        ...itm
}));

const xmlParse = (arr1) => {
    arr1 = arr1.map(function(a) {
        a.AVAILABILITY = parser.parse(a.DATAPAYLOAD).AVAILABILITY.INSTOCKVALUE;
        return a;
    })
    man = arr1.map((({DATAPAYLOAD, ...arr1}) => arr1))
}


const getAccessories = async () => {
    try {
        const resp = await axios.get('https://bad-api-assignment.reaktor.com/products/accessories');
        accessories = resp.data
        
    } catch (err) {
        console.error(err);
    }
};
const getShirts = async () => {
    try {
        const resp = await axios.get('https://bad-api-assignment.reaktor.com/products/shirts');
        shirts = resp.data
        
    } catch (err) {
        console.error(err);
    }
};

const getJackets = async () => {
    try {
        const resp = await axios.get('https://bad-api-assignment.reaktor.com/products/jackets');
        jackets = resp.data


    } catch (err) {
        console.error(err);
    }
};

const getAvailability = async () => {
    try {
        let s = 0;
        man = []
        for(let i of manufacturers1) {
            const resp = await axios.get('https://bad-api-assignment.reaktor.com/availability/' + i)
            man = man.concat(resp.data.response)
/*             console.log(man.length)
            console.log(resp.status, resp.statusText, resp.headers['x-error-modes-active']) */
            // {headers: {"x-force-error-mode":all}}
        }
        man = man.map(function(a) {
            a.id = a.id.toLowerCase();
            return a;
        });
        
    } catch (err) {
        console.error(err);
    }
};

const run = async () => {
    try {
        await getJackets();
        await getAccessories();
        await getShirts();
        await getAvailability();    
        xmlParse(man);
        jackets = await merge(jackets, man);
        accessories = await merge(accessories, man);
        shirts = await merge(shirts, man);
    } catch (err){
        console.error(err)
    }
}





setInterval(function () { 
    run()
}, 300000); 

console.log(jackets.length)
app.get('/api/', function (req, res) {
})
app.get('/api/jackets', function (req, res) {
    res.json(jackets)
})
app.get('/api/shirts', function (req, res) {
    res.json(shirts)
})
app.get('/api/accessories', function (req, res) {
    res.json(accessories)
})
  
app.get('/api/man', function(req, res){
    res.json(man)
})
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})