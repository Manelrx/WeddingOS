const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper to make HTTP requests
function request(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (err) => {
            console.error(`Request Error for ${path}:`, err);
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Helper to upload file
function uploadFile(vendorId, filePath) {
    return new Promise((resolve, reject) => {
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        // Build multipart body
        let body = `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
        body += `Content-Type: application/pdf\r\n\r\n`;

        // We need to send body as Buffer to handle binary correctly
        const headerBuffer = Buffer.from(body, 'utf-8');
        const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
        const payload = Buffer.concat([headerBuffer, fileContent, footerBuffer]);

        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: `/vendors/${vendorId}/proposals`,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': payload.length,
            },
            timeout: 10000, // 10s timeout
        };

        const req = http.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: resBody ? JSON.parse(resBody) : {} });
                } catch (e) {
                    resolve({ status: res.statusCode, body: resBody });
                }
            });
        });

        req.on('error', (err) => {
            console.error('Upload Request Error:', err);
            reject(err);
        });

        req.write(payload);
        req.end();
    });
}

async function run() {
    console.log('Checking server connectivity...');
    try {
        await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:3000', (res) => {
                console.log('Server is reachable, status:', res.statusCode);
                resolve();
            }).on('error', reject);
        });
    } catch (err) {
        console.error('Server unreachable:', err);
        return;
    }

    console.log('\n1. Creating Wedding...');
    try {
        const weddingRes = await request('POST', '/weddings', {
            title: 'Test Wedding ' + Date.now(),
            eventDate: new Date().toISOString(),
        });
        console.log('Wedding Response:', weddingRes.status, weddingRes.body);

        if (weddingRes.status !== 201) return;
        const weddingId = weddingRes.body.id;

        console.log('\n2. Creating Vendor...');
        const vendorRes = await request('POST', `/weddings/${weddingId}/vendors`, {
            name: 'Test Photographer',
            serviceType: 'PHOTO_VIDEO',
        });

        console.log('Vendor Response:', vendorRes.status, vendorRes.body);

        if (vendorRes.status !== 201) return;
        const vendorId = vendorRes.body.id;

        console.log('\n3. Creating Dummy PDF...');
        fs.writeFileSync('test_verify.pdf', '%PDF-1.4\n%...\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/MediaBox [0 0 595 842]\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF');

        console.log('\n4. Uploading Proposal...');
        const uploadRes = await uploadFile(vendorId, 'test_verify.pdf');
        console.log('Upload Response:', uploadRes.status, uploadRes.body);

        if (uploadRes.status === 201) {
            console.log('\nSUCCESS: Proposal uploaded successfully.');
            console.log(`Saved ID: ${uploadRes.body.id}`);
            console.log(`Status: ${uploadRes.body.status}`);
        } else {
            console.log('\nFAILED to upload proposal.');
            console.error(uploadRes);
        }
    } catch (err) {
        console.error('Script failed:', err);
    }
}

run().catch(console.error);
