const rand = require('random-seed');

function getExpectedChange(generator) {
    return generator(100) / 100;
}

function getDeliveries(iProduct, generator) {
    let fluctuation = getExpectedChange(generator);
    let newDeliveries = fluctuation * iProduct.startingQuantity;
    iProduct.quantity += iProduct.quantity + newDeliveries;
    return iProduct;
}

class Seller {
    constructor(inventory, id = "Safeway", deliveryWait = 5) {
        this.inventory = inventory;
        this.deliveryWait = deliveryWait;
        this.random_generator = rand(id);
        this.id = id;
        for (let [product, value] of Object.entries(inventory)) {
            value.startingQuantity = value.quantity;
            value.priceHistory = [value.price];
            value.stingyness = 0;
        }
    }

    getQuantity(product) {
        const inventory = this.inventory[product];
        return inventory.quantity;
    }

    quote(product) {
        const inventory = this.inventory[product];
        return inventory.price;
    }

    calculatePriceChange(product){
        const inventory = this.inventory[product];
        const v = 0.1;
        const ec = getExpectedChange(this.random_generator);

        //Log functions are only defined in x > 0, furthermore I had to transform the formula using log rules to subtract instead of divide because it introduced unsecure complexity in input management
        // I also introduced relevant and useful default values for edge cases that will still promote the dynamic pricing
        const alpha = inventory.startingQuantity && inventory.startingQuantity > 0 && isNaN(inventory.startingQuantity) ? inventory.startingQuantity : 1;
        const beta = inventory.quantity && inventory.quantity > 0 && isNaN(inventory.quantity) ? inventory.quantity : 1;

        const alphaRate = Math.log10(alpha);
        const betaRate = Math.log10(beta);

        const delta = betaRate - alphaRate;

        //This is an extra precautionary measure to leave the price unchanged if alphaRate or betaRate somehow get Infinite or falsey values
        if (delta && delta === (Infinity || -Infinity)) {
            return 0;
        }

        const inv_based_change = (-v) * (delta);
        const exp_change = ((+v) * (ec - 0.5));

        return inv_based_change + exp_change;
    }
    
    sell(product, buyQuantity) {
        const inventory = this.inventory[product];
        const boughtQuantity = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity;
        const cost = boughtQuantity * this.quote(product);

        inventory.quantity -= boughtQuantity;
        inventory.stingyness = 1 - inventory.quantity / inventory.startingQuantity;
        this.tick();

        return {boughtQuantity, cost};
    }

    tick() {
        for (let [product, value] of Object.entries(this.inventory)) {
            let inventory = value;
            const isReadyForDelivery = (inventory.priceHistory.length % this.deliveryWait) === 0; // use three equal operators to avoid type coercion
            if (isReadyForDelivery) {
                inventory = getDeliveries(inventory, this.random_generator);
            }
            let chg = this.calculatePriceChange(product);
            inventory.price = inventory.price + (inventory.price*chg)
            inventory.priceHistory.push(inventory.price);
        }
    }
}

class FairSeller extends Seller {
    constructor(inventory, id = "Fairway", deliveryWait = 3) {
        super(inventory, id, deliveryWait);
        for (let [product, value] of Object.entries(inventory)) {
            value.startingQuantity = value.quantity;
            value.priceHistory = 1;
            value.stingyness = 0;
        }
    }

    //Just to be thorough I made sure there would be no inherited dynamic pricing functionality
    calculatePriceChange() { return 0 };

    sell(product, buyQuantity) {
        const inventory = this.inventory[product];
        const boughtQuantity = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity;
        const cost = boughtQuantity * super.quote(product);

        inventory.quantity -= boughtQuantity;

        this.tick();

        return {boughtQuantity, cost};
    }

    tick() {
        for (let [product, value] of Object.entries(this.inventory)) {
            let inventory = value;
            const isReadyForDelivery = (inventory.priceHistory % this.deliveryWait) === 0; // use three equal operators to avoid type coercion
            if (isReadyForDelivery) {
                inventory = getDeliveries(inventory, this.random_generator);
            }
            inventory.priceHistory += 1;
        }
    }
}

module.exports = {Seller, FairSeller}
