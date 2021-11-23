const {asda, costco, tesco} = require("./marketplace");
const { Market } = require("./Market");
const { Buyer } = require("./Buyer");


function main() {
    const market = new Market([asda, costco, tesco]);
    let buyer = new Buyer(market);
    let product = "Pineapples";
    let quantity = 250;
    buyerFunctions(product, quantity, buyer);
    observeMarket(market);
}

function buyerFunctions(product, quantity, buyer) {
    console.log(`The best price for ${product} is ${buyer.getBestPrice(product)}`) ;
    console.log(`To completely fill a order of ${quantity} ${product} costs ${buyer.fillWithBestPrices(product, quantity)}`) ;
    console.log(`To buy as quickly as possible ${quantity} ${product} costs ${buyer.fillWithLargestSellers(product, quantity)}`) ;

}

function observeMarket(market) {
    market.observable.subscribe( (mkt) => {
        console.log(`The current price of pineapples are ${market.sellers[0].inventory["Pineapples"].price}`)});
}

main();
