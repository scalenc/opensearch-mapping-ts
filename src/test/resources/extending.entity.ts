import { Entity, Field } from '../../lib/es-mapping-ts';
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
