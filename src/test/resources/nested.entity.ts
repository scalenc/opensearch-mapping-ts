import { Entity, Field } from '../../lib/es-mapping-ts';

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
