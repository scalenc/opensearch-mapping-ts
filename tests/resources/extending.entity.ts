import { OpenSearchEntity, OpenSearchField } from '../../src';
import { MasterEntity } from './master.entity';

@OpenSearchEntity({ index: 'extending' })
export class ExtendingEntity extends MasterEntity {
  @OpenSearchField({ type: 'text' })
  extendend?: string;
}
