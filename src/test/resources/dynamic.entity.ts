import { Entity, Field } from '../../lib/es-mapping-ts';

@Entity({
  index: 'dynamic-strict',
  type: 'dynamicStrict',
  dynamic: 'strict',
})
export class DynamicStrictEntity {
  @Field({
    type: 'text',
  })
  field: string;
}

@Entity({
  index: 'dynamic-true',
  type: 'dynamicTrue',
  dynamic: true,
})
export class DynamicTrueEntity {
  @Field({
    type: 'text',
  })
  field: string;
}

@Entity({
  index: 'dynamic-false',
  type: 'dynamicFalse',
  dynamic: false,
})
export class DynamicFalseEntity {
  @Field({
    type: 'text',
  })
  field: string;
}
