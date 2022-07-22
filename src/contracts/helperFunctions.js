function replaceAllRanks(input) {
    input = input.replaceAll('[OWNER] ', '')
    input = input.replaceAll('[ADMIN] ', '')
    input = input.replaceAll('[MCP] ', '')
    input = input.replaceAll('[GM] ', '')
    input = input.replaceAll('[PIG+++] ', '')
    input = input.replaceAll('[YOUTUBE] ', '')
    input = input.replaceAll('[MVP++] ', '')
    input = input.replaceAll('[MVP+] ', '')
    input = input.replaceAll('[MVP] ', '')
    input = input.replaceAll('[VIP+] ', '')
    input = input.replaceAll('[VIP] ', '')
    return input
}

function addNotation(type, value) {
    let returnVal = value;
    let notList = [];
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ];
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"];
    }

    let checkNum = 1000;
    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1];
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift();
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100);
                    returnVal = Math.floor(returnVal);
                    returnVal = (returnVal / Math.pow(10, o)) * 10;
                    returnVal = +returnVal.toFixed(o - 1) + notValue;
                }
                checkNum *= 10;
            }
        }
    } else {
        returnVal = numberWithCommas(value.toFixed(0));
    }

    return returnVal;
}

function generateID(length) {
    let result = '', characters = 'abcde0123456789', charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function getRarityColor(rarity) {
    if (rarity.toLowerCase() == "mythic") return "d"
    if (rarity.toLowerCase() == "legendary") return "6"
    if (rarity.toLowerCase() == "epic") return "5"
    if (rarity.toLowerCase() == "rare") return "9"
    if (rarity.toLowerCase() == "uncommon") return "a"
    if (rarity.toLowerCase() == "common") return "f"
    else return "f"

}

module.exports = { replaceAllRanks, addNotation, generateID, getRarityColor }