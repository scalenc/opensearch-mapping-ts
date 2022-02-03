import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity()
export class DetailsMixin {
  @OpenSearchField({ type: 'text' })
  firstName: string;

  @OpenSearchField({ type: 'text' })
  lastName: string;
}
