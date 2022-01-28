import { Entity, Field } from '../src';
import { AbstractEntity } from './abstract.entity';

@Entity({
  index: 'actual',
  type: 'typeActual',
})
export class ActualEntity extends AbstractEntity {
  @Field({
    type: 'text',
  })
  actualName: string;

  @Field({
    type: 'text',
    null_value: 'undefined',
  })
  overridableName: string;
}
