const { Queue } = require('bullmq');

async function check() {
    const queue = new Queue('proposal-processing', {
        connection: {
            host: 'localhost',
            port: 6379,
        },
    });

    const counts = await queue.getJobCounts();
    console.log('Queue Counts:', counts);

    const failed = await queue.getFailed();
    console.log('\n--- FAILED JOBS ---');
    failed.forEach(job => {
        console.log(`Job ID: ${job.id}`);
        console.log(`Error: ${job.failedReason}`);
        console.log(`Stack: ${job.stacktrace}`);
        console.log(`Data: ${JSON.stringify(job.data)}`);
    });

    await queue.close();
}

check().catch(console.error);
