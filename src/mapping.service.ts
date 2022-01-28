import { Client } from '@opensearch-project/opensearch';
import { EntityArgs } from './entity.decorator';
import { FieldArgs } from './field.decorator';
import { Mapping, MappingProperty, InternalMapping, InternalMappingProperty } from './mapping';

/**
 * Service used to manage mapping loading and share it
 */
export class MappingService {
  static instance: MappingService;

  mappings: Map<string, InternalMapping> = new Map();

  constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): MappingService {
    if (!MappingService.instance) {
      const mappingService = new MappingService();
      MappingService.instance = mappingService;
    }
    return MappingService.instance;
  }

  /**
   * Add the entity in the mapping
   * @param args decorator args
   * @param target class
   */
  addEntity(args: EntityArgs, target: any, superClass: any): void {
    const className = target.name;
    const mapping = this.mappings.get(className);

    const mergeProperties = (properties) => {
      for (const propertyName of Object.keys(properties)) {
        const currentMappingProperty = mapping.properties.get(propertyName);
        let internalProperty: InternalMappingProperty = null;
        if (!currentMappingProperty) {
          internalProperty = {
            propertyMapping: properties[propertyName],
          };
        } else {
          internalProperty = {
            propertyMapping: {
              ...properties[propertyName],
              ...currentMappingProperty.propertyMapping,
            },
          };
        }
        mapping.addProperty(propertyName, internalProperty);
      }
    };

    if (superClass) {
      const superClassMapping = this.mappings.get(superClass);
      if (superClassMapping) {
        mergeProperties(superClassMapping.mapping.body.properties);
      }
    }

    if (args) {
      mapping.mapping.index = args.index;
      mapping.mapping.type = args.type as any;
      mapping.mapping.dynamic = args.dynamic;
      mapping.readonly = args.readonly === true;

      if (args.mixins) {
        for (const mixin of args.mixins) {
          const Entity = this.mappings.get(mixin.name);
          if (Entity) {
            mergeProperties(Entity.mapping.body.properties);
          }
        }
      }
    }
  }

  /**
   * Add the field in the mapping
   * @param args decorator args
   * @param target class
   * @param propertyKey the property
   */
  addField(args: FieldArgs, target: any, propertyKey: string | symbol, propertyType?: any): void {
    const className = target.constructor.name;
    let mapping = this.mappings.get(className);
    if (!mapping) {
      mapping = new InternalMapping();
      this.mappings.set(className, mapping);
    }

    const properties: MappingProperty = args;
    if (args.type === 'nested' || args.type === 'object') {
      properties.type = args.type;
      const Entity = this.mappings.get(propertyType.name);
      if (Entity) {
        properties.properties = Entity.mapping.body.properties;
      }
    }

    const internalProperty: InternalMappingProperty = {
      propertyMapping: properties,
    };

    const propertyName = args.name || propertyKey;
    mapping.addProperty(propertyName, internalProperty);
  }

  /**
   * Alllow you to get the generated mapping list ready to be inserted inside elasticsearch
   */
  public getInternalMappings(): InternalMapping[] {
    return Array.from(this.mappings.values());
  }

  /**
   * Allow you to get all index
   */
  public getMappings(): Mapping[] {
    return Array.from(this.mappings.values()).map((mapping) => mapping.mapping);
  }

  /**
   * Allow you to get the generate mapping map
   */
  public getMappingsMap() {
    return this.mappings;
  }

  /**
   * Alllow you to get the generated mapping ready to be inserted inside elasticsearch
   * for a class name
   */
  public getMappingForClass(className: string): Mapping {
    const internalMapping = this.mappings.get(className);

    if (internalMapping) {
      return internalMapping.mapping;
    }
    return null;
  }

  /**
   * Alllow you to get the generated mapping  ready to be inserted inside elasticsearch
   * for an index name
   */
  public getMappingForIndex(indexName: string): Mapping {
    const internalMapping = Array.from(this.mappings.values()).find((internalMapping) => internalMapping.mapping.index === indexName);

    if (internalMapping) {
      return internalMapping.mapping;
    }
    return null;
  }

  /**
   * Alllow you to get the generated mapping  ready to be inserted inside elasticsearch
   * for an type
   */
  public getMappingForType(type: string): Mapping {
    const internalMapping = Array.from(this.mappings.values()).find((internalMapping) => internalMapping.mapping.type === type);

    if (internalMapping) {
      return internalMapping.mapping;
    }
    return null;
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex(): string[] {
    // load mapping with index
    const mappings = Array.from(this.mappings.values()).filter((mapping) => mapping.mapping.index);
    return mappings.map((mapping) => mapping.mapping.index);
  }

  /**
   * Allow to insert/update mapping into elasticsearch
   */
  public async uploadMappings(esclient: Client) {
    const mappings = MappingService.getInstance().getInternalMappings();

    await Promise.all(
      mappings.map(async (internalMapping) => {
        if (!internalMapping.readonly) {
          const mapping = internalMapping.mapping;

          if (mapping.index) {
            mapping.include_type_name = true;
            // Delete readonly for ES compatibility
            delete internalMapping.readonly;

            const indexExist = await esclient.indices.exists({ index: mapping.index });
            if (!indexExist.body) {
              // create index
              await esclient.indices.create({ index: mapping.index });
              // create mapping
              await esclient.indices.putMapping(mapping);
            } else {
              // update mapping
              await esclient.indices.putMapping(mapping);
            }
          }
        }
      })
    );
  }
}
