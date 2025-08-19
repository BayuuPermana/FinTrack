const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        amount = 0;
    }

    // Abbreviation logic
    if (amount >= 1e12) {
        return `Rp ${(amount / 1e12).toFixed(1).replace(/\.0$/, '')}T`;
    }
    if (amount >= 1e9) {
        return `Rp ${(amount / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (amount >= 1e6) {
        return `Rp ${(amount / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (amount >= 1e3) {
        return `Rp ${(amount / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default formatCurrency;
