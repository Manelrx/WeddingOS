const http = require('http');

const makeRequest = (method, path, body) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ statusCode: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runVerification = async () => {
    try {
        console.log('--- Starting Verification ---');

        console.log('1. Creating Wedding...');
        const weddingRes = await makeRequest('POST', '/weddings', {
            title: 'Casamento Teste',
            eventDate: new Date().toISOString(),
        });
        console.log(`Status: ${weddingRes.statusCode}`, weddingRes.data);
        if (weddingRes.statusCode !== 201) throw new Error('Failed to create wedding');
        const weddingId = weddingRes.data.id;

        console.log('\n2. Creating Vendor (Success)...');
        const vendorRes = await makeRequest('POST', `/weddings/${weddingId}/vendors`, {
            name: 'Buffet Master',
            serviceType: 'Buffet',
        });
        console.log(`Status: ${vendorRes.statusCode}`, vendorRes.data);
        if (vendorRes.statusCode !== 201) throw new Error('Failed to create vendor');
        const vendorId = vendorRes.data.id;

        console.log('\n3. Creating Vendor (Failure - Invalid Wedding)...');
        const failRes = await makeRequest('POST', '/weddings/00000000-0000-0000-0000-000000000000/vendors', {
            name: 'Buffet Fail',
            serviceType: 'Buffet',
        });
        console.log(`Status: ${failRes.statusCode} (Expected 404)`);
        if (failRes.statusCode !== 404) throw new Error('Expected 404 for invalid wedding');

        console.log('\n4. Listing Vendors...');
        const listRes = await makeRequest('GET', `/weddings/${weddingId}/vendors`);
        console.log(`Status: ${listRes.statusCode}`, `Count: ${listRes.data.length}`);
        if (listRes.statusCode !== 200) throw new Error('Failed to list vendors');

        console.log('\n5. Getting Vendor...');
        const getRes = await makeRequest('GET', `/vendors/${vendorId}`);
        console.log(`Status: ${getRes.statusCode}`, getRes.data.id);
        if (getRes.statusCode !== 200) throw new Error('Failed to get vendor');

        console.log('\n6. Updating Vendor...');
        const updateRes = await makeRequest('PATCH', `/vendors/${vendorId}`, {
            status: 'negotiating',
        });
        console.log(`Status: ${updateRes.statusCode}`, updateRes.data.status);
        if (updateRes.statusCode !== 200) throw new Error('Failed to update vendor');

        console.log('\n7. Deleting Vendor...');
        const deleteRes = await makeRequest('DELETE', `/vendors/${vendorId}`);
        console.log(`Status: ${deleteRes.statusCode}`);
        if (deleteRes.statusCode !== 200) throw new Error('Failed to delete vendor');

        console.log('\n--- Verification Succeeded ---');

    } catch (error) {
        console.error('\n--- Verification Failed ---');
        console.error(error);
        process.exit(1);
    }
};

runVerification();
