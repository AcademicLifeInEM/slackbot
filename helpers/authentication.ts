
export function requireAuthentication(req, res, next) {
    if (req.get('ALIEM_API_KEY') !== process.env.ALIEM_API_KEY) {
        res.status(401).send('=> ERROR: "aliem_api_key" header not set or invalid');
        return;
    }
    next();
}
