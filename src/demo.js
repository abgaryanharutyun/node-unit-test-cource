exports.add = function(a, b) {
    return a+b;
}


exports.addCalback = function(a, b, callBack) {
    setTimeout(()=>{
        return callBack(null, a+b);
    }, 500);
}

exports.addPromise = function(a, b) {
    // return Promise.reject(new Error('fails'));
    return Promise.resolve(a+b);
}