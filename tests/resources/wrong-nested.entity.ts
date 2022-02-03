import { OpenSearchEntity, OpenSearchField } from '../../src';
import { NestedEntity } from './nested.entity';

@OpenSearchEntity()
export class WrongNestedEntity {
  @OpenSearchField({ type: 'nested' })
  nesteds: NestedEntity;
}
