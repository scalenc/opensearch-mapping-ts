# OpenSearch Mappings TS

[![GitHub version](https://img.shields.io/badge/licence-MIT-green.svg)](https://github.com/scalenc/opensearch-mapping-ts)
[![GitHub version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/scalenc/opensearch-mapping-ts)

This library is used to generate mappings for [OpenSearch](https://opensearch.org/) from typescript decorators. It is based on and forked from [es-mappings-ts](https://github.com/xrobert35/opensearch-mappng-ts), thanks and all credit to the authors.

## Installation

To install the this package, simply use your favorite package manager:

```sh
npm install opensearch-mappng-ts
yarn add opensearch-mappng-ts
pnpm add opensearch-mappng-ts
```

## Peer Dependencies

This package depends on **@opensearch-project/opensearch**

## Version

### tested with

* elasticsearch 7
* elasticsearch 6  
* elasticsearch 5 

## Examples

### Create the mapping

```typescript
import { Entity, Field } from 'opensearch-mappng-ts';
import { ObjectEntity } from './object.entity';
import { NestedEntity } from './nested.entity';

@Entity({
  index: 'master',
  type: 'masterType'
})
export class MasterEntity {

  @Field({
    type : 'text'
  })
  name?: string;

  @Field({
    type: 'text',
    copy_to : 'name'
  })
  firstname: string;

  @Field({
    type: 'text',
    copy_to : 'name'
  })
  lastname: string;

  @Field({
    type: 'join',
    relations: { 'master': 'submaster' }
  })
  master: Array<MasterEntity>;

  @Field({
    type: 'object',
    fieldClass: ObjectEntity
  })
  objects: Array<MasterEntity>;

  @Field({
    type: 'nested',
    fieldClass: NestedEntity
  })
  nested: Array<NestedEntity>;
}
```

```typescript
import { Entity, Field } from 'opensearch-mappng-ts';

@Entity({
  index: 'nested'
})
export class NestedEntity {

  @Field({
    type: 'text',
  })
  name: string;

  @Field({
    type: 'integer'
  })
  montant: number;
}
```

```typescript
import { Entity, Field } from 'opensearch-mappng-ts';

// This es entity is only here for field mapping,
// it's not supposed to have is own index
@Entity()
export class ObjectEntity {

  @Field({
    type: 'text',
    analyzer : 'whitespace'
  })
  name: string;

  @Field({
    type: 'integer',
  })
  age: number;
}
```

### Get the generated mappings

#### Simply call the "uploadMappings"  function

```typescript
import { EsMappingService } from 'opensearch-mappng-ts';
import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  host: 'http://localhost:9200',
  log : 'info'
});

// Upload the mapping
const mappings = EsMappingService.getInstance().uploadMappings(esClient);
```

only none readonly entity will be uploaded

#### or do it yourself

```typescript
import { EsMappingService } from 'opensearch-mappng-ts';

//List of ready to use generated mapping
const mappings = EsMappingService.getInstance().getMappings();

Bluebird.each(mappings, async (mapping) => {
    //create index
    await esclient.indices.create({ index: mapping.index  });

    //create mapping
    await esclient.indices.putMapping(mapping);
});
```

### Inheritance
You can also extend EsMapping

```typescript
export class AbstractEntity {

  @Field({
    type: 'text',
  })
  abstractName: string;

  @Field({
    type: 'text',
  })
  overridableName: string;
}
```

```typescript
@Entity({
  index: 'actual',
  type: 'typeActual'
})
export class ActualEntity extends AbstractEntity {

  @Field({
    type: 'text'
  })
  actualName: string;


  @Field({
    type: 'text',
    null_value : 'undefined'
  })
  overridableName: string;
}
```


### Using mixins
You can add mixins to your entities by declaring an entity like so:

```typescript
@Entity({ mixins: [BaseMixin] })
export class SomeEntity {
   @Field({
        type: "text",
    })
    name: string;
}
```

The mixin class looks like:

```typescript
@Entity()
export class BaseMixin {
    @Field({
       type: "keyword"
    })
    id: string;

    @Field({
        name: "start_date",
        type: "date"
    })
    startDate: Date;

    @Field({
        name: "end_date",
        type: "date"
    })
    endDate: Date;
}
```

`SomeClass` will now have a mapping like:

```json
{
    "body": {
        "properties": {
            "name": {
                "type": "text",
            },
            "id": {
                "type": "keyword",
            },
            "start_date": {
                "name": "start_date",
                "type": "date",
            },
            "end_date": {
                "name": "end_date",
                "type": "date",
            },
        }
    }
}
```

## Decorators

### @Entity

| Param | Type |  Description |
| ------ | ------ | ------ |
| index | string | Allow you to define the index name |
| type | string | Allow you to define the index type |
| readonly | boolean | Define if the mapping must be uploaded when using uploadMappings function |
| mixins | Array<any> | Allow you to compose with one or more EsEntities, see "Using mixins" |

### @Field

| Param | Type |  Description |
| ------ | ------ | ------ |
| type | string | Allow you to define the type of the index |
| name | string | Allow you to define the name of the property if different from the property name |
| dynamic | boolean | Allow you to define if the field can accept additional properties |
| analyzer | string | Allow you to define the elasticsearch analyzer |
| fields | string | Allow you to define the elasticsearch fields |
| format | string | Allow you to define the format (ie for date field) |
| enabled | boolean | Allow you to enable ou disable the field |
| null_value | string | Allow you to define the null value of the field |
| copy_to | string | Allow you to copy the field value into a group field for _search |
| relations | string | Define the releation for a join type |
| fieldClass | string | Class used to get the properties of the nested or object array type |

Additional properties are allowed, allowing you to manage other elasticsearch properties

## How to dev

### test en build

```shell
# launch unit testing
npm run test 

# build
npm run build
```

This project is also managed by travis for CI

### release

```
npm run build
npm run test

mkdir release
cp -r dist release
cp LICENSE release
cp README.md release
cp package.json release #change version

cd relese
npm publish
```

## License

----

MIT
