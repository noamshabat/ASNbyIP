"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ip2CountryCode = void 0;
const IpGeoApiClient = require('ip-geolocation-api-javascript-sdk');
const GeolocationParams = require('ip-geolocation-api-javascript-sdk/GeolocationParams.js');
const InvalidRequestException_1 = require("./exceptions/InvalidRequestException");
/**
 * Class to handle calls to the ip geolocation service.
 */
class IpGeolocationClient {
    constructor() {
        // initialize the sdk on class init.
        this.client = new IpGeoApiClient(process.env.IP_GEOLOCATION_KEY);
    }
    /**
     *
     * @param ip the ip to get data for
     * @param fields a list of comma separated field names based on https://ipgeolocation.io/ip-location-api.html
     * @returns a json object with the response from the ip geolcation service.
     */
    getIpData(ip, fields) {
        const params = new GeolocationParams();
        params.setIPAddress(ip);
        params.setLang('en');
        params.setFields(fields);
        return new Promise((res) => {
            this.client.getGeolocation((json) => {
                res(json);
            }, params);
        });
    }
}
const client = new IpGeolocationClient();
/**
 * Verifies the given ip is a valid ipv4 or ipv6 string.
 * @param ip the ip to verify
 * @throws InvalidRequestException if ip is invalid.
 */
function verifyIp(ip) {
    const ip4PartRegex = '([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
    const ip4Regex = new RegExp(`(${ip4PartRegex}\.){3}${ip4PartRegex}`);
    const ip6Regex = /((([0-9a-fA-F]){1,4})\:){7}([0-9a-fA-F]){1,4}/;
    if (!ip || (!ip.match(ip4Regex) && !ip.match(ip6Regex))) {
        throw new InvalidRequestException_1.InvalidRequestException(`Invalid ip '${ip}'`);
    }
}
/**
 * Get's the country code for a given ip.
 * @param ip the ip to get the country code for.
 * @returns a string representing the relevant country code.
 */
async function ip2CountryCode(ip) {
    verifyIp(ip);
    const geoData = await client.getIpData(ip, 'country_code2');
    return geoData.country_code2;
}
exports.ip2CountryCode = ip2CountryCode;
