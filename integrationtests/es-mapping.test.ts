import { Client } from '@opensearch-project/opensearch';
import { expect } from 'chai';
import 'reflect-metadata';
import { MappingService } from '../src';
import '../test-resources/master.entity';

describe('es-mapping e2e:test', function () {
  this.timeout(30000);

  it('should upload the mapping', async () => {
    const mappings = MappingService.getInstance().getMappingForIndex('master');
    expect(mappings).not.to.be.undefined;

    const client = new Client({
      node: 'http://localhost:9200',
    });

    await client.ping();

    await Promise.all(
      MappingService.getInstance()
        .getAllIndex()
        .map(async (index) => {
          const indexExist = await client.indices.exists({ index });
          if (indexExist.body) {
            await client.indices.delete({ index });
          }
        })
    );

    await MappingService.getInstance().uploadMappings(client);
  });

  it('should re-upload the mapping', async () => {
    const mappings = MappingService.getInstance().getMappingForIndex('master');
    expect(mappings).not.to.be.undefined;

    const client = new Client({
      node: 'http://localhost:9200',
    });

    await client.ping();

    await MappingService.getInstance().uploadMappings(client);
  });

  it('should fail to upload mapping', async () => {
    // wrong client
    const client = new Client({
      node: 'http://localhost:9300',
    });
    try {
      await MappingService.getInstance().uploadMappings(client);
      expect(true).to.be.false;
    } catch (err) {
      expect(err).not.to.be.undefined;
    }
  });
});
