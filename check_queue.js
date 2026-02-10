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

    await queue.close();
}

check().catch(console.error);
