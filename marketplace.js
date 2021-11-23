const { Seller, FairSeller } = require("./Seller")

const asda = new Seller({
    "Apples":{
        quantity:100,
        price:5.25
    },
    "Oranges":{
        quantity:150,
        price:8.0
    },
    "Pears":{
        quantity:10,
        price:15.0
    },
    "Banannas":{
        quantity:1000,
        price:10.0
    },
    "Pineapples":{
        quantity:50,
        price:3.50
    }
}, "Asda", 5);

const costco = new Seller({
    "Apples":{
        quantity:25,
        price:4.25
    },
    "Oranges":{
        quantity:15,
        price:6.0
    },
    "Grapes":{
        quantity:10,
        price:21.0
    },
    "Banannas":{
        quantity:100,
        price:4.0
    },
    "Pineapples":{
        quantity:100,
        price:4.25
    }
}, "Costco", 1);

const tesco = new Seller({
    "Apples":{
        quantity:250,
        price:6.25
    },
    "Oranges":{
        quantity:300,
        price:10.0
    },
    "Grapes":{
        quantity:100,
        price:35.0
    },
    "Pears":{
        quantity:100,
        price:30.0
    },
    "Mangosteen":{
        quantity:10,
        price:100.0
    },
    "Banannas":{
        quantity:100,
        price:8.0
    },
    "Pineapples":{
        quantity:200,
        price:10.0
    }
}, "Tesco", 10);

const milltechfx = new FairSeller({
    "Apples":{
        quantity:100,
        price:7.0
    },
    "Oranges":{
        quantity:150,
        price:1.0
    },
    "Pears":{
        quantity:10,
        price:20.9
    },
    "Banannas":{
        quantity:1000,
        price:10.7
    },
    "Pineapples":{
        quantity:100,
        price:25
    }
}, "MillTechFX", 5);


module.exports = {asda, costco, tesco, milltechfx}