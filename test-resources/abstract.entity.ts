import { Field } from '../src';

export class AbstractEntity {
  @Field({
    type: 'text',
  })
  abstractName: string;

  @Field({
    type: 'text',
  })
  overridableName: string;
}
