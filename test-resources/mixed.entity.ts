import { Entity, Field } from '../src';
import { DetailsMixin } from './details.mixin';

@Entity({ mixins: [DetailsMixin] })
export class MixedEntity {
  @Field({
    type: 'text',
  })
  id: string;
}
