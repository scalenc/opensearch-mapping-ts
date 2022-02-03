import 'reflect-metadata';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import { expect } from 'chai';
import { OpenSearchMappingService } from '../../src';
import '../resources/master.entity';

if (!process.env.SEARCH_ENDPOINT) {
  throw new Error('Search endpoint is not specified. Specify the endpoint of OpenSearch or ElasticSearch via environment SEARCH_ENDPOINT');
}

const clients = [
  new OpenSearchClient({ node: process.env.SEARCH_ENDPOINT }), // from '@opensearch-project/opensearch'
  new ElasticsearchClient({ node: process.env.SEARCH_ENDPOINT }), // from '@elastic/elasticsearch'
];

clients.forEach((client: OpenSearchClient) => {
  describe('opensearch-mapping-ts integration test', function () {
    this.timeout(60000);

    it('should wait for a readily prepared opensearch', async () => {
      let retries = 20;
      let healthState: string | undefined;
      do {
        const healthState = (await client.cluster.health().catch(() => undefined))?.body?.status;
        if (healthState === 'green' || healthState === 'yellow') return;
        console.log(`Cluster health is ${healthState}. Retrying another ${retries} times...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } while (retries-- > 0);
      expect(healthState).to.satisfy((s) => s === 'green' || s === 'yellow');
    });

    it('should upload the mapping', async () => {
      const mappings = OpenSearchMappingService.getInstance().getMappingForIndex('master');
      expect(mappings).not.to.be.undefined;
      await client.ping();
      await Promise.all(
        OpenSearchMappingService.getInstance()
          .getAllIndex()
          .map(async (index) => {
            const indexExist = await client.indices.exists({ index });
            if (indexExist.body) {
              await client.indices.delete({ index });
            }
          })
      );

      await OpenSearchMappingService.getInstance().uploadMappings(client);
    });

    it('should re-upload the mapping', async () => {
      const mappings = OpenSearchMappingService.getInstance().getMappingForIndex('master');
      expect(mappings).not.to.be.undefined;
      await client.ping();
      await OpenSearchMappingService.getInstance().uploadMappings(client);
    });

    it('should get the correct mappings from the cluster', async () => {
      await client.ping();
      const mappings = (await client.indices.getMapping({ index: 'master' })).body.master.mappings;
      expect(mappings.properties.name).to.exist;
      expect(mappings.properties.firstName).to.exist;
      expect(mappings.properties.lastName).to.exist;
      expect(mappings.properties.objects).to.exist;
      expect(mappings.properties.warningObjects).to.exist;
      expect(mappings.properties.warningObject).to.exist;
      expect(mappings.properties.nesteds).to.exist;
      expect(mappings.properties.customName).to.exist;
      expect(mappings.properties.nestedWarnings).to.exist;
      expect(mappings.properties.notIndexed).not.to.exist;
      expect(mappings.properties.random).not.to.exist;
      expect(mappings.properties.name.type).to.eql('text');
      expect(mappings.properties.objects.properties.age).to.exist;
      expect(mappings.properties.objects.properties.date_of_birth).to.exist;
      expect(mappings.properties.objects.properties.name).to.exist;
      expect(mappings.properties.objects.properties.age.type).to.eql('integer');
      expect(mappings.properties.objects.properties.date_of_birth.type).to.eql('text');
      expect(mappings.properties.objects.properties.name.type).to.eql('text');
      expect(mappings.properties.objects.properties.name.analyzer).to.eql('whitespace');
    });
  });
});
