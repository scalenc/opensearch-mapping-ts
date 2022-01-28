import { Entity, Field } from '../src';

@Entity({
  index: 'nested',
})
export class NestedEntity {
  @Field({
    type: 'text',
  })
  name: string;

  @Field({
    type: 'integer',
  })
  montant: number;
}
