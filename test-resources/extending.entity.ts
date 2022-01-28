import { Entity, Field } from '../src';
import { MasterEntity } from './master.entity';

@Entity({
  index: 'extending',
  type: 'typeExtending',
})
export class ExtendingEntity extends MasterEntity {
  @Field({
    type: 'text',
  })
  extendend?: string;
}
