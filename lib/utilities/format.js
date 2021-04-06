const formatPrice = (price) => `${price < 0 ? '-' : ''}$${Math.abs(price).toFixed(2)}`;
const formatPercent = (percent) => {
    if (percent <= 1) {
        percent *= 100;        
    }
    return `${(percent).toFixed(2)}%`
}


module.exports = {
    formatPercent: formatPercent,
    formatPrice: formatPercent
}