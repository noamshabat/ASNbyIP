"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ip2region = void 0;
const IpGeoApiClient = require('ip-geolocation-api-javascript-sdk');
const GeolocationParams = require('ip-geolocation-api-javascript-sdk/GeolocationParams.js');
const InvalidRequestException_1 = require("./exceptions/InvalidRequestException");
class Ip2AsnClient {
    constructor() {
        this.client = new IpGeoApiClient(process.env.IP_GEOLOCATION_KEY);
    }
    async getIpData(ip, fields) {
        const params = new GeolocationParams();
        params.setIPAddress(ip);
        params.setLang('en');
        params.setFields(fields);
        return new Promise((res, rej) => {
            this.client.getGeolocation((json) => {
                res(json);
            }, params);
        });
    }
}
const client = new Ip2AsnClient();
function verifyIp(ip) {
    const ip4PartRegex = '([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
    const ip4Regex = new RegExp(`(${ip4PartRegex}\.){3}${ip4PartRegex}`);
    const ip6Regex = /((([0-9a-fA-F]){1,4})\:){7}([0-9a-fA-F]){1,4}/;
    if (!ip || (!ip.match(ip4Regex) && !ip.match(ip6Regex))) {
        throw new InvalidRequestException_1.InvalidRequestException(`Invalid ip '${ip}'`);
    }
}
async function ip2region(ip) {
    verifyIp(ip);
    const geoData = await client.getIpData(ip, 'country_code2');
    return geoData.country_code2;
}
exports.ip2region = ip2region;
