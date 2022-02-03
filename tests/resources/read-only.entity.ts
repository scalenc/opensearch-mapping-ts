import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity({ readonly: true })
export class ReadOnlyEntity {
  @OpenSearchField({ type: 'text', analyzer: 'whitespace' })
  status: string;
}
