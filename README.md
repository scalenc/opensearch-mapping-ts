# OpenSearch Mappings TS

[![GitHub version](https://img.shields.io/badge/licence-MIT-green.svg)](https://github.com/scalenc/opensearch-mapping-ts)
[![GitHub version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/scalenc/opensearch-mapping-ts)

This library is used to generate mappings for [OpenSearch](https://opensearch.org/) from typescript decorators. It is based on and forked from [es-mappings-ts](https://github.com/xrobert35/opensearch-mapping-ts), thanks and all credit to the authors.

## Installation

To install the this package, simply use your favorite package manager:

```sh
npm install opensearch-mapping-ts
yarn add opensearch-mapping-ts
pnpm add opensearch-mapping-ts
```

## Compatibility

- OpenSearch v1
- Elasticsearch v7

The library does not have any (peer-) dependency to the clients of [Elasticsearch Node.js client](https://github.com/elastic/elasticsearch-js) or OpenSearch [OpenSearch Node.js client](https://github.com/opensearch-project/opensearch-js). However, as these share the same interface, the library can be used with both of them.

### Migration

For compatibility reasons, there are aliases for all entities that allow using the Elasticsearch flavoured decorators,
such as `EsEntity`, `EsField` etc.
The support of `type`s for indices that were deprecated since Elasticsearch v6 was removed.

## Examples

### Define mappings using class and field decorators

```typescript
import { OpenSearchEntity, OpenSearchField } from 'opensearch-mapping-ts';
import { ObjectEntity } from './object.entity';
import { NestedEntity } from './nested.entity';

@OpenSearchEntity({ index: 'master' })
export class MasterEntity {
  @OpenSearchField({ type: 'text' })
  name?: string;

  @OpenSearchField({ type: 'text', copy_to: 'name' })
  firstName: string;

  @OpenSearchField({ type: 'text', copy_to: 'name' })
  lastName: string;

  @OpenSearchField({ type: 'join', relations: { master: 'submaster' } })
  master: Array<MasterEntity>;

  @OpenSearchField({ type: 'object', fieldClass: ObjectEntity })
  objects: Array<MasterEntity>;

  @OpenSearchField({ type: 'nested', fieldClass: NestedEntity })
  nested: Array<NestedEntity>;
}
```

```typescript
import { OpenSearchEntity, OpenSearchField } from 'opensearch-mapping-ts';

@OpenSearchEntity({ index: 'nested' })
export class NestedEntity {
  @OpenSearchField({ type: 'text' })
  name: string;

  @OpenSearchField({ type: 'integer' })
  montant: number;
}
```

```typescript
import { OpenSearchEntity, OpenSearchField } from 'opensearch-mapping-ts';

// This es entity is only here for field mapping,
// it's not supposed to have is own index
@OpenSearchEntity()
export class ObjectEntity {
  @OpenSearchField({ type: 'text', analyzer: 'whitespace' })
  name: string;

  @OpenSearchField({ type: 'integer' })
  age: number;
}
```

### Get the generated mappings

#### Simply call the "uploadMappings" function

```typescript
import { OpenSearchMappingService } from 'opensearch-mapping-ts';
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  host: 'http://localhost:9200',
  log: 'info',
});

// Upload the mapping
const mappings = OpenSearchMappingService.getInstance().uploadMappings(client);
```

only none readonly entity will be uploaded

#### or do it yourself

```typescript
import { OpenSearchMappingService } from 'opensearch-mapping-ts';

const mappings = OpenSearchMappingService.getInstance().getMappings();

await Promise.all(mappings.map(async (mapping) => {
    await client.indices.create({ index: mapping.index  });
    await client.indices.putMapping(mapping);
});
```

### Inheritance

You can also extend OpenSearchMapping

```typescript
export class AbstractEntity {
  @OpenSearchField({
    type: 'text',
  })
  abstractName: string;

  @OpenSearchField({ type: 'float' })
  overridableNumber: number;
}
```

```typescript
@OpenSearchEntity({ index: 'concrete' })
export class ConcreteEntity extends AbstractEntity {
  @OpenSearchField({ type: 'text' })
  concreteName: string;

  @OpenSearchField({ type: 'double', null_value: 1 })
  overridableNumber: number;
}
```

### Using mixins

You can add mixins to your entities by declaring an entity like so:

```typescript
@OpenSearchEntity({ mixins: [BaseMixin] })
export class SomeEntity {
  @OpenSearchField({ type: 'text' })
  name: string;
}
```

The mixin class looks like:

```typescript
@OpenSearchEntity()
export class BaseMixin {
  @OpenSearchField({ type: 'keyword' })
  id: string;

  @OpenSearchField({ name: 'start_date', type: 'date' })
  startDate: Date;

  @OpenSearchField({ name: 'end_date', type: 'date' })
  endDate: Date;
}
```

`SomeClass` will now have a mapping like:

```json
{
  "body": {
    "properties": {
      "name": {
        "type": "text"
      },
      "id": {
        "type": "keyword"
      },
      "start_date": {
        "name": "start_date",
        "type": "date"
      },
      "end_date": {
        "name": "end_date",
        "type": "date"
      }
    }
  }
}
```

## Decorators

### @OpenSearchEntity

| Param    | Type       | Description                                                               |
| -------- | ---------- | ------------------------------------------------------------------------- |
| index    | string     | Allow you to define the index name                                        |
| readonly | boolean    | Define if the mapping must be uploaded when using uploadMappings function |
| mixins   | Array<any> | Allow you to compose with one or more EsEntities, see "Using mixins"      |

### @OpenSearchField

| Param      | Type    | Description                                                                      |
| ---------- | ------- | -------------------------------------------------------------------------------- |
| type       | string  | Allow you to define the type of the index                                        |
| name       | string  | Allow you to define the name of the property if different from the property name |
| dynamic    | boolean | Allow you to define if the field can accept additional properties                |
| analyzer   | string  | Allow you to define the elasticsearch analyzer                                   |
| fields     | string  | Allow you to define the elasticsearch fields                                     |
| format     | string  | Allow you to define the format (ie for date field)                               |
| enabled    | boolean | Allow you to enable ou disable the field                                         |
| null_value | string  | Allow you to define the null value of the field                                  |
| copy_to    | string  | Allow you to copy the field value into a group field for \_search                |
| relations  | string  | Define the releation for a join type                                             |
| fieldClass | string  | Class used to get the properties of the nested or object array type              |

Additional properties are allowed, allowing you to manage other elasticsearch properties

## Development

```shell

# build the code
yarn build

# unit tests only
yarn test:unit

# integration tests only
yarn test:integration

#  starting an OpenSearch instance within a container and running all tests
yarn test:local

```

### CI

All branches are built and tested using Gitlab CI.
Changes on the master branch will be deployed to npm.js

## License

---

MIT
