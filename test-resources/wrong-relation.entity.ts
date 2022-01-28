import { Entity, Field } from '../src';

@Entity()
export class WrongRelationEntity {
  @Field({
    type: 'join',
  })
  relations: WrongRelationEntity;
}
