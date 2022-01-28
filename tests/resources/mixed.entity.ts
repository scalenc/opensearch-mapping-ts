import { OpenSearchEntity, OpenSearchField } from '../../src';
import { DetailsMixin } from './details.mixin';

@OpenSearchEntity({ mixins: [DetailsMixin] })
export class MixedEntity {
  @OpenSearchField({ type: 'text' })
  id: string;
}
