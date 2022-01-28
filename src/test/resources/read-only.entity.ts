import { Entity, Field } from '../../lib/es-mapping-ts';

@Entity({readonly: true})
export class ReadOnlyEntity {

  @Field({
    type: 'text',
    analyzer : 'whitespace',
  })
  status: string;
}
