import { Entity, Field } from '../src';
import { NestedEntity } from './nested.entity';
import { ObjectEntity } from './object.entity';

@Entity({
  index: 'master',
  type: 'masterType',
})
export class MasterEntity {
  @Field({
    type: 'text',
  })
  name?: string;

  @Field({
    type: 'text',
    copy_to: 'name',
  })
  firstname: string;

  @Field({
    type: 'text',
    copy_to: 'name',
  })
  lastname: string;

  @Field({
    enabled: false,
    name: 'customName',
  })
  notIndexed: string;

  @Field({
    type: 'object',
    fieldClass: ObjectEntity,
  })
  objects: ObjectEntity[];

  @Field({
    type: 'object',
  })
  warningObjects: ObjectEntity[];

  @Field({
    type: 'object',
  })
  warningObject: ObjectEntity;

  @Field({
    type: 'nested',
    fieldClass: NestedEntity,
    dynamic: 'strict',
  })
  nesteds: NestedEntity[];

  @Field({
    type: 'nested',
    dynamic: 'strict',
  })
  nestedWarnings: NestedEntity[];
}
