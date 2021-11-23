class Buyer {
    constructor(market) {
        this.market = market;
    }

    /**
     * This method should get the best price for a given product 
     * across all sellers
     */
    getBestPrice(product) {
        const { sellers } = this.market;

        return sellers.reduce((bestPrice, seller) => {
            return Math.min(bestPrice, seller.quote(product));
        }, Number.MAX_SAFE_INTEGER);
    }

    /**
     * Helper function: for fillWith_X methods
     */
    _fillWith(optimization, product, quantity) {
        const { sellers } = this.market;

        return sellers.sort((a, b) => optimization(a, b, product)).reduce((cost, seller) => {
            const receipt = seller.sell(product, quantity);

            quantity -= receipt.boughtQuantity || 0;

            console.log("------------------------------")
            console.log("ID: " + seller.id)
            console.log("Sell Quant: " + receipt.boughtQuantity)
            console.log("Sell Cost: " + receipt.cost)
            console.log("Quantity: " + quantity)
            console.log("Cost: " + cost)

            return cost + (receipt.cost || 0);
        }, 0);
    }

    /**
     * Helper function: optimize order by best price
     */
    _BestPrices(a, b, product) {
        return a.quote(product) - b.quote(product);
    }

    /**
     * Helper function: optimize order by sellers available quantity
     */
    _LargestSellers(a, b, product){
        if (b.inventory[product] && b.inventory[product].quantity === a.inventory[product].quantity) {
            return a.quote(product) - b.quote(product);
        }
        return b.inventory[product].quantity - a.inventory[product].quantity;
    }

    /**
     * This method should optimise price when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next cheapest seller should be used.
     */
    fillWithBestPrices(product, quantity) {
        return this._fillWith(this._BestPrices, product, quantity);
    }

    /**
     * This method should optimise for sellers with the largest inventory when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */
    fillWithLargestSellers(product, quantity) {
        return this._fillWith(this._LargestSellers, product, quantity);
    }

}

module.exports = {Buyer}
