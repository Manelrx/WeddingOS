const http = require('http');

const weddingId = '857cfa73-9305-4b00-84e2-7746eed73ab8';
const baseUrl = 'http://localhost:3001';

console.log('--- STARTING VENDOR DETAIL VERIFICATION ---');

// 1. Get List
http.get(`${baseUrl}/weddings/${weddingId}/vendors`, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        try {
            const list = JSON.parse(data);
            const vendors = list.vendors || [];

            let vendorId;
            if (vendors.length === 0) {
                console.log('No vendors found. creating one...');
                createVendor();
            } else {
                vendorId = vendors[0].id;
                console.log(`Found existing vendor: ${vendorId}`);
                checkDetail(vendorId);
            }
        } catch (e) {
            console.error('Failed to parse list:', e.message);
        }
    });
});

function createVendor() {
    const postData = JSON.stringify({ name: 'Test Vendor', serviceType: 'Test' });
    const req = http.request({
        hostname: 'localhost', port: 3001, path: `/weddings/${weddingId}/vendors`, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            const v = JSON.parse(data);
            console.log(`Created vendor: ${v.id}`);
            checkDetail(v.id);
        });
    });
    req.write(postData);
    req.end();
}

function checkDetail(id) {
    http.get(`${baseUrl}/vendors/${id}`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                const detail = JSON.parse(data);
                console.log('Detail Received:', JSON.stringify(detail, null, 2));

                const hasBalance = detail.remainingBalance !== undefined;
                const hasProposals = Array.isArray(detail.proposals);
                const hasConditions = detail.paymentConditions !== undefined;

                if (hasBalance && hasProposals && hasConditions) {
                    console.log('\n✅ VERIFICATION PASSED: Vendor Detail structure is correct.');
                    console.log(`   - Remaining Balance: ${detail.remainingBalance}`);
                    console.log(`   - Proposal Count: ${detail.proposals.length}`);
                    console.log(`   - Payment Conditions: "${detail.paymentConditions}"`);
                } else {
                    console.error('\n❌ VERIFICATION FAILED: Missing fields.');
                    console.error(`   - Has Balance: ${hasBalance}`);
                    console.error(`   - Has Proposals: ${hasProposals}`);
                    console.error(`   - Has Conditions: ${hasConditions}`);
                }
            } catch (e) {
                console.error('Failed to parse detail:', e.message);
            }
        });
    });
}
