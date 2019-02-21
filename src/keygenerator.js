function generatekey(curve = 'secp256k1')
{
	const EC = require('elliptic').ec;
	const ec = new EC(curve);
	const key = ec.genKeyPair();
	const publicKey = key.getPublic('hex');
	const privateKey = key.getPrivate('hex');
	var data = {
		"publickKey": publicKey,
		"privateKey": privateKey
	}
	return data;
}

module.exports.generatekey = generatekey;