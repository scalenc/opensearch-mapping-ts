import { Entity, Field } from '../src';

@Entity({ readonly: true })
export class ReadOnlyEntity {
  @Field({
    type: 'text',
    analyzer: 'whitespace',
  })
  status: string;
}
