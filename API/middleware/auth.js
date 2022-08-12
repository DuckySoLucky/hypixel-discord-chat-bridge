//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
module.exports = (req, res, next) => {
    const AuthTokens = process.env?.TOKENS?.split(',') || []

    if (req.headers.hasOwnProperty('authorization') && AuthTokens.includes(req.headers.authorization)) {
        req.authToken = req.headers.authorization

        return next()
    }

    if (req.query.hasOwnProperty('key') && AuthTokens.includes(req.query.key?.toString())) {
        req.authToken = req.query.key?.toString()

        return next()
    }

    return res.status(400).json({
        status: 400,
        reason: 'Missing "key" query parameter, or an "authorization" header with a valid SkyHelper API key',
    })
}