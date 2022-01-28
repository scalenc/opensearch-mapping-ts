import { Entity, Field } from '../../lib/es-mapping-ts';

@Entity()
export class WrongRelationEntity {

  @Field({
    type: 'join',
  })
  relations: WrongRelationEntity;
}
