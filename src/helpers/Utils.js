const balanceSum = (accounts) => {
    if (!accounts) return 0;
    var sum = 0;
    for (var i = 0; i < accounts.length; i++) {
        sum += accounts[i].balance
    }
    return Math.round(sum / 100)
}

const balanceSum_2 = (transactions) => {
    var sum = 0;
    for (var i = 0; i < transactions.length; i++) {
        sum += transactions[i].amount
    }
    return sum / 100
}


const timestampToDate = (ts) => {
    var d = new Date();
    d.setTime(ts * 1000);
    return ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear();
}

const balanceSum_3 = (transactions) => {
    var sum =0;
    var a=[]
    for (var i = 0; i < transactions.length; i++) {
        sum += transactions[i].amount
        a.push(sum/100)
    }
    return a
}






export {
    balanceSum,
    balanceSum_2,
    balanceSum_3,
    timestampToDate
}