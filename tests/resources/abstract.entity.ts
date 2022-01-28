import { OpenSearchField } from '../../src';

export class AbstractEntity {
  @OpenSearchField({ type: 'text' })
  abstractName: string;

  @OpenSearchField({ type: 'float' })
  overridableNumber: string;

  @OpenSearchField({ type: 'text' })
  overridableName: string;
}
