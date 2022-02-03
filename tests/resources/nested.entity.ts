import { OpenSearchEntity, OpenSearchField } from '../../src';

@OpenSearchEntity({
  index: 'nested',
})
export class NestedEntity {
  @OpenSearchField({ type: 'text' })
  name: string;

  @OpenSearchField({ type: 'integer' })
  montant: number;
}
