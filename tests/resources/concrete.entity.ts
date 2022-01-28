import { OpenSearchEntity, OpenSearchField } from '../../src';
import { AbstractEntity } from './abstract.entity';

@OpenSearchEntity({ index: 'concrete' })
export class ConcreteEntity extends AbstractEntity {
  @OpenSearchField({ type: 'text' })
  concreteName: string;

  @OpenSearchField({ type: 'double', null_value: 1 })
  overridableNumber: string;

  @OpenSearchField({ type: 'text' })
  overridableName: string;
}
