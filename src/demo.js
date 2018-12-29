exports.add = function(a, b) {
    return a+b;
}


exports.addCalback = function(a, b, callBack) {
    setTimeout(()=>{
        return callBack(null, a+b);
    }, 500);
}