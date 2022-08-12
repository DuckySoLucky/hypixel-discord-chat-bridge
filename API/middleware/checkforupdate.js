const { red, green } = require('chalk')
const { exec } = require('child_process');

module.exports = function checkforupdate() {
    if (process.env.AUTO_UPDATE !== 'false') {
        exec('git pull', (err, stdout, stderr) => {
            if (stdout.includes('Already up to date.')) console.log(green('The API is up to date! No updates made.'))
            else if (stdout.includes('Updating')) console.log(red('Updated the API. Please restart the API to be up to date.'))
        });
    }
    
}
