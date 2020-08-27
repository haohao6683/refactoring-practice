function getFormatter() {
  return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format;
}

function getAmount(perf, type) {
    switch (type) {
              case 'tragedy':
                thisAmount = 40000;
                if (perf.audience > 30) {
                  thisAmount += 1000 * (perf.audience - 30);
                }
                break;
              case 'comedy':
                thisAmount = 30000;
                if (perf.audience > 20) {
                  thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
              default:
                throw new Error(`unknown type: ${type}`);
            }
    return thisAmount;
}

function getVolumeCredits(perf, type, volumeCredits) {
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === type) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}

function generateData(invoice, plays){
    let data = {};
    data.eachItems = new Array();
    let volumeCredits = 0;
    let totalAmount = 0;
    data.customer = invoice.customer;
    const format = getFormatter();
    for (let perf of invoice.performances) {
        let eachItem = {};
        const play = plays[perf.playID];
        volumeCredits = getVolumeCredits(perf, play.type, volumeCredits);
        eachItem.playName = play.name;
        eachItem.amount = format(getAmount(perf, play.type) / 100);
        eachItem.audience = perf.audience;
        totalAmount += thisAmount;
        data.eachItems.push(eachItem);
      }
    data.totalAmount = format(totalAmount / 100);
    data.volumeCredits = volumeCredits;

    return data;
}

function generateTXTDoc(data){
    let result = `Statement for ${data.customer}\n`;
    for (let eachItem of data.eachItems){
        result += ` ${eachItem.playName}: ${eachItem.amount} (${eachItem.audience} seats)\n`;
    }

    result += `Amount owed is ${data.totalAmount}\n`;
    result += `You earned ${data.volumeCredits} credits \n`;
    return result;
}

function statement (invoice, plays) {
    let data = generateData(invoice, plays);
    return generateTXTDoc(data);
}

module.exports = {
  statement,
};
