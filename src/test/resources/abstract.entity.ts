import { Field } from '../../lib/es-mapping-ts';


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
