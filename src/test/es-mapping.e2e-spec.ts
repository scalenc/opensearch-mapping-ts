import { Client } from '@opensearch-project/opensearch';
import 'reflect-metadata';
import { MappingService } from '../lib/es-mapping-ts';
import './resources/master.entity';

describe('es-mapping e2e:test', () => {

  it('should upload the mapping', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const mappings = MappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();

    const client = new Client({
      node: 'http://localhost:9200',
    });

    await client.ping();

    await Promise.all(MappingService.getInstance().getAllIndex().map(async (index) => {
      const indexExist = await client.indices.exists({ index });
      if (indexExist.body) {
        await client.indices.delete({ index });
      }
    }));

    await MappingService.getInstance().uploadMappings(client);
  });

  it('should re-upload the mapping', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const mappings = MappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();

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
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

});
