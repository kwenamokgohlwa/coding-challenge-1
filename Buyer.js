const { Seller, FairSeller } = require("./Seller")

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
     #fillWith(optimize, product, quantity) {
        const { sellers } = this.market;

        return sellers.sort((a, b) => optimize(a, b)).reduce((cost, seller) => {
            const receipt = seller.sell(product, quantity);
            quantity -= receipt.boughtQuantity || 0;

            return cost + (receipt.cost || 0);
        }, 0);
    }

    /**
     * This method should optimise price when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next cheapest seller should be used.
     */
    fillWithBestPrices(product, quantity) {
        const model = (a, b) => { return a.quote(product) - b.quote(product) };

        return this.#fillWith(model, product, quantity);
    }

    /**
     * This method should optimise for sellers with the largest inventory when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */
    fillWithLargestSellers(product, quantity) {
        const model = (a, b) => { return b.getQuantity(product) === a.getQuantity(product) ? a.quote(product) - b.quote(product) : b.getQuantity(product) - a.getQuantity(product) };

        return this.#fillWith(model, product, quantity);
    }

}

module.exports = {Buyer}
