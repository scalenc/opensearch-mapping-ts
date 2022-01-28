import { Entity, Field } from '../../lib/es-mapping-ts';

@Entity()
export class DetailsMixin {

  @Field({
    type: 'text',
  })
  firstname: string;

  @Field({
    type: 'text',
  })
  lastname: string;
}
