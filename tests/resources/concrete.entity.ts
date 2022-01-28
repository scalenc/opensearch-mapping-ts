import { OpenSearchEntity, OpenSearchField } from '../../src';
import { AbstractEntity } from './abstract.entity';

@OpenSearchEntity({ index: 'concrete' })
export class ConcreteEntity extends AbstractEntity {
  @OpenSearchField({ type: 'text' })
  concreteName: string;

  @OpenSearchField({ type: 'text', null_value: 'undefined' })
  overridableName: string;
}
