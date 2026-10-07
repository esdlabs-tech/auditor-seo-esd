const axios = require('axios');

async function test(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            },
            timeout: 10000 
        });
        console.log("Success:", response.status);
    } catch (e) {
        console.log("Error for", url, ":", e.message, e.code, e.response?.status);
    }
}

test('https://www.esddesigns.es');
test('https://google.com');
