
import { Test, TestingModule } from '@nestjs/testing';
import { VendorsService } from './src/vendors/vendors.service';
import { AppModule } from './src/app.module';

async function bootstrap() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const vendorsService = app.get(VendorsService);

    // Get the most recent proposal
    const proposals = await vendorsService.prisma.proposal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { vendor: true }
    });

    if (proposals.length === 0) {
        console.log('No proposals found');
        await app.close();
        return;
    }

    const proposal = proposals[0];
    console.log(`Analyzing proposal ${proposal.id} (${proposal.name}) with context 'negotiation'...`);

    try {
        // We need to call analyzeProposal on the service, but the service calls the provider.
        // The service method is: analyzeProposal(proposalId: string, context?: 'proposal' | 'contract' | 'negotiation')
        const analysis = await vendorsService.analyzeProposal(proposal.id, 'negotiation');
        console.log('Analysis result:', JSON.stringify(analysis.negotiationHighlights, null, 2));
    } catch (error) {
        console.error('Analysis failed:', error);
    }

    await app.close();
}

bootstrap();
