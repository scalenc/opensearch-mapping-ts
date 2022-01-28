import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity()
export class WrongRelationEntity {
  @OpenSearchField({ type: 'join' })
  relations: WrongRelationEntity;
}
