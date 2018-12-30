module.exports = {
    sendWelcomeEmail : function(email, name) {
        if (!email || !name) {
            return Promise.reject(new Error('Invalid input'));
        }

        var body = `Dear ${name}, welcome to our family!`;
        return sendEmail(email, body);
    },
    
    sendPasswordResetEmail: function(email) {
        if (!email) {
            return Promise.reject(new Error('Invalid input'));
        }

        var body = `Please click http://some_link to reset your password.`;

        return sendEmail(email, body);
    }
}

function sendEmail(email, body) {
    if (!email || !body) {
        return Promise.reject(new Error('Invalid input'));
    }

    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('Email Sent!');

            return resolve('Email sent');
        }, 100);
    });
}