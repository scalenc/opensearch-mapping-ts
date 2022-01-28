import { Entity, Field } from '../../lib/es-mapping-ts';
import { DetailsMixin } from './details.mixin';

@Entity({mixins: [DetailsMixin]})
export class MixedEntity {

  @Field({
    type : 'text',
  })
  id: string;
}
