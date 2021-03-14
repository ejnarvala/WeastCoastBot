class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async _request(path) {
        let url = this.baseUrl + path
        let response = await fetch(url);
        if (!response.ok) {
            console.log(`Unsuccessful request to ${url} - ${response.status}: ${response.statusText}`)
            return {};
        }
        let json = await response.json();
        return json;
    }
}

module.exports = {
    HttpClient: HttpClient
}