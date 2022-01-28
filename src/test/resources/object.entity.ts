import { Entity, Field } from '../../lib/es-mapping-ts';

@Entity()
export class ObjectEntity {

  @Field({
    type: 'text',
    analyzer : 'whitespace',
  })
  name: string;

  @Field({
    type: 'integer',
  })
  age: number;

  @Field({
    name: 'date_of_birth',
    type: 'text',
  })
  dateOfBirth: string;
}
