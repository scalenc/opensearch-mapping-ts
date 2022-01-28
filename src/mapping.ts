import { cloneDeep } from 'lodash';

/**
 * Base format of an elasticsearch mapping
 */
export class OpenSearchMapping {
  index: string;
  type: string;
  body: {
    dynamic?: boolean | 'strict' | 'runtime';
    properties: any;
  };

  constructor() {
    this.body = { properties: {} };
  }
}

/**
 * Internal mapping to handle specific parameter
 */
export class InternalOpenSearchMapping {
  index: string;
  type: string;
  readonly: boolean;
  osmapping: OpenSearchMapping = new OpenSearchMapping();
  properties: Map<string | symbol, InternalOpenSearchMappingProperty> = new Map();

  addProperty(name: string | symbol, mapping: InternalOpenSearchMappingProperty): void {
    this.properties.set(name, mapping);

    const propertyMapping = cloneDeep(mapping.propertyMapping);

    // delete name
    delete (propertyMapping as any).name;

    this.osmapping.body.properties[name] = propertyMapping;
  }
}

/**
 * Base format of an elasticsearch property
 */
export interface OpenSearchMappingProperty {
  type?: string;
  analyzer?: string;
  properties?: any;
  fields?: any;
}

/**
 * Base format of an elasticsearch property
 */
export interface InternalOpenSearchMappingProperty extends OpenSearchMappingProperty {
  propertyMapping: OpenSearchMappingProperty;
  transformers?: OpenSearchMappingPropertyTransformer[];
}

export interface OpenSearchMappingPropertyTransformer {
  fieldName: string;
  transformer: OpenSearchPropertyTransformer;
}

export interface OpenSearchPropertyTransformer {
  transform(input: any);
}
