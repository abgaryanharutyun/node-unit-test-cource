exports.add = function(a, b) {
    return a+b;
}


exports.addCalback = function(a, b, callBack) {
    setTimeout(()=>{
        return callBack(null, a+b);
    }, 500);
}

exports.addPromise = function(a, b) {
    // return Promise.reject(new Error('fake'));
    return Promise.resolve(a+b);
}

exports.foo = function() {
    console.log('console.log was called');
    console.warn('console.warn was called');

    return;
}

exports.bar = async (fileName) => {
    await exports.createFile(fileName);
    let result = await callDb(fileName);

    return result;
}

exports.createFile = (fileName)=>{
    console.log('----in createFile');

    //fake create file
    return new Promise((resolve) => {
        setTimeout(()=> {
            console.log('fake file create');
            return Promise.resolve('done')
        }, 100)
    })
}


function callDb(fileName) {
    console.log('---- in callDb');
    return new Promise((resolve) => {
        setTimeout(()=> {
            console.log('fake db called');
            resolve('saved');
        }, 100)
    })
}