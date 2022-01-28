import 'reflect-metadata';
import { Client } from '@opensearch-project/opensearch';
import { expect } from 'chai';
import { OpenSearchMappingService } from '../../src';
import '../resources/master.entity';

if (!process.env.OPENSEARCH_ENDPOINT) process.env.OPENSEARCH_ENDPOINT = 'http://localhost:9242';
let client: Client;

describe('es-mapping e2e:test', function () {
  this.timeout(30000);

  it('should wait for a readily prepared opensearch', async () => {
    client = new Client({ node: process.env.OPENSEARCH_ENDPOINT });
    let retries = 20;
    let healthy = false;
    do {
      try {
        const healthState = (await client.cluster.health())?.body?.status;
        if (healthState != 'green' && healthState != 'yellow') throw `Cluster health is ${healthState}`;
        healthy = true;
      } catch (error) {
        console.log(`Opensearch cluster is not ready yet: ${error}. Retrying another ${retries} times...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } while (!healthy && retries-- > 0);
    expect(healthy).to.be.true;
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

  it('should fail to upload mapping', async () => {
    // wrong client
    const client = new Client({
      node: 'http://localhost:9300',
    });
    try {
      await OpenSearchMappingService.getInstance().uploadMappings(client);
      expect(true).to.be.false;
    } catch (err) {
      expect(err).not.to.be.undefined;
    }
  });
});
