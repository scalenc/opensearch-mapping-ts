import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity()
export class ObjectEntity {
  @OpenSearchField({ type: 'text', analyzer: 'whitespace' })
  name: string;

  @OpenSearchField({ type: 'integer' })
  age: number;

  @OpenSearchField({ name: 'date_of_birth', type: 'text' })
  dateOfBirth: string;
}
