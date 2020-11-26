var parser = require('fast-xml-parser');

const express = require('express')
const app = express()
const axios = require('axios');

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
        console.log("voijuma")
        let s = 1;
        man = []
        for(i of manufacturers1) {
            const resp = await axios.get('https://bad-api-assignment.reaktor.com/availability/' + i)
            //console.log(resp);
            man = man.concat(resp.data.response)
            console.log(man.length)
            //console.log("TERVE " + man.length)
            //console.log("TERVE" + resp.headers.connection)
            console.log(resp.status, resp.statusText, resp.headers)
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
        console.log(jackets)
    } catch (err){
        console.error(err)
    }
}





/* setInterval(function () { 
    run()
}, 300000);  */

console.log(jackets.length)
app.get('/api/', function (req, res) {
    run()
    //merge(jackets, man)
})
app.get('/api/jackets', function (req, res) {
    //console.log(jackets)
    res.json(jackets)
})
app.get('/api/shirts', function (req, res) {
    //console.log(shirts)
    res.json(shirts)
})
app.get('/api/accessories', function (req, res) {
    //console.log(accessories)
    res.json(accessories)
})
  
app.get('/api/man', function(req, res){
    //console.log(typeof manufacturers)
    //console.log(man)
    res.json(man)
})
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})