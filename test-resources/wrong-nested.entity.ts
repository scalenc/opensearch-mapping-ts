import { Entity, Field } from '../src';
import { NestedEntity } from './nested.entity';

@Entity()
export class WrongNestedEntity {
  @Field({
    type: 'nested',
  })
  nesteds: NestedEntity;
}
