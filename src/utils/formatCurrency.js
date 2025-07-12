/*
* =================================================================
* FILE: src/utils/formatCurrency.js
* =================================================================
* Description: A utility function for formatting numbers into IDR currency.
*/
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        amount = 0;
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};