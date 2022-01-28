import { Entity, Field } from '../src';

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
