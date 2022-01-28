import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity({ index: 'dynamic-strict', dynamic: 'strict' })
export class DynamicStrictEntity {
  @OpenSearchField({ type: 'text' })
  field: string;
}

@OpenSearchEntity({ index: 'dynamic-true', dynamic: true })
export class DynamicTrueEntity {
  @OpenSearchField({ type: 'text' })
  field: string;
}

@OpenSearchEntity({ index: 'dynamic-false', dynamic: false })
export class DynamicFalseEntity {
  @OpenSearchField({ type: 'text' })
  field: string;
}
