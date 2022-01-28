import { Entity, Field } from '../../lib/es-mapping-ts';
import { NestedEntity } from './nested.entity';

@Entity()
export class WrongNestedEntity {

  @Field({
    type: 'nested',
  })
  nesteds: NestedEntity;
}
