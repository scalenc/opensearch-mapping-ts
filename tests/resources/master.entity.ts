import { OpenSearchEntity, OpenSearchField } from '../../src';
import { NestedEntity } from './nested.entity';
import { ObjectEntity } from './object.entity';

@OpenSearchEntity({ index: 'master' })
export class MasterEntity {
  @OpenSearchField({ type: 'text' })
  name?: string;

  @OpenSearchField({ type: 'text', copy_to: 'name' })
  firstname: string;

  @OpenSearchField({ type: 'text', copy_to: 'name' })
  lastname: string;

  @OpenSearchField({ enabled: false, name: 'customName' })
  notIndexed: string;

  @OpenSearchField({ type: 'object', fieldClass: ObjectEntity })
  objects: ObjectEntity[];

  @OpenSearchField({ type: 'object' })
  warningObjects: ObjectEntity[];

  @OpenSearchField({ type: 'object' })
  warningObject: ObjectEntity;

  @OpenSearchField({ type: 'nested', fieldClass: NestedEntity, dynamic: 'strict' })
  nesteds: NestedEntity[];

  @OpenSearchField({ type: 'nested', dynamic: 'strict' })
  nestedWarnings: NestedEntity[];
}
