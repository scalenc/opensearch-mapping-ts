import { cloneDeep } from 'lodash';

/**
 * Base format of an elasticsearch mapping
 */
export class Mapping {
  index: string;
  type: string;
  include_type_name: boolean;
  dynamic: string | boolean;
  body: { properties: any };

  constructor() {
    this.body = { properties: {} };
  }
}

/**
 * Internal mapping to handle specific parameter
 */
export class InternalMapping {
  index: string;
  type: string;
  readonly: boolean;
  mapping: Mapping = new Mapping();
  properties: Map<string | symbol, InternalMappingProperty> = new Map();

  addProperty(name: string | symbol, mapping: InternalMappingProperty): void {
    this.properties.set(name, mapping);

    const propertyMapping = cloneDeep(mapping.propertyMapping);

    // remove the name field from the es-mapping
    delete (propertyMapping as any).name;

    this.mapping.body.properties[name] = propertyMapping;
  }
}

/**
 * Base format of an elasticsearch property
 */
export interface MappingProperty {
  type?: string;
  analyzer?: string;
  properties?: any;
  fields?: any;
}

/**
 * Base format of an elasticsearch property
 */
export interface InternalMappingProperty extends MappingProperty {
  propertyMapping: MappingProperty;
  transformers?: MappingPropertyTranformer[];
}

export interface MappingPropertyTranformer {
  fieldName: string;
  transformer: EsPropertyTranformer;
}

export interface EsPropertyTranformer {
  transform(input: any);
}
