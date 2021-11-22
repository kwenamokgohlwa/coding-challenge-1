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
            return seller.inventory[product] ? Math.min(bestPrice, seller.inventory[product].price) : bestPrice;
        }, Number.MAX_SAFE_INTEGER);
    }

    /**
     * Helper function: for fillWith_X methods
     */
    _fillWith(optimization, product, quantity) {
        const { sellers } = this.market;

        return sellers.sort((a, b) => optimization(a, b, product)).reduce((cost, seller) => {
            const sellerPrice = seller.inventory[product] ? seller.inventory[product].price : 0;
            const sellerQuantity = seller.inventory[product] ? Math.min(quantity, seller.inventory[product].quantity) : 0;

            quantity = quantity - sellerQuantity;

            const sellerCost = sellerPrice * sellerQuantity;

            return cost + sellerCost;
        }, 0);
    }

    /**
     * Helper function: optimize order by best price
     */
    _BestPrices(a, b, product) {
        return a.inventory[product].price - b.inventory[product].price;
    }

    /**
     * Helper function: optimize order by sellers available quantity
     */
    _LargestSellers(a, b, product){
        if (b.inventory[product] && b.inventory[product].quantity === a.inventory[product].quantity) {
            return a.inventory[product].quantity - b.inventory[product].quantity;
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
