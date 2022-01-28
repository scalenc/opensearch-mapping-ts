import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity()
export class DetailsMixin {
  @OpenSearchField({ type: 'text' })
  firstname: string;

  @OpenSearchField({ type: 'text' })
  lastname: string;
}
