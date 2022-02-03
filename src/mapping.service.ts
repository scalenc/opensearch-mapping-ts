import { OpenSearchEntityArgs } from './entity.decorator';
import { OpenSearchFieldArgs } from './field.decorator';
import { OpenSearchMapping, OpenSearchMappingProperty, InternalOpenSearchMapping, InternalOpenSearchMappingProperty } from './mapping';
import { SearchClient } from './SearchClient';

/**
 * Service used to manage mapping loading and share it
 */
export class OpenSearchMappingService {
  private static instance: OpenSearchMappingService;

  private mappings: Map<string, InternalOpenSearchMapping> = new Map();

  /**
   * Get the singleton instance
   */
  static getInstance(): OpenSearchMappingService {
    if (!OpenSearchMappingService.instance) {
      OpenSearchMappingService.instance = new OpenSearchMappingService();
    }
    return OpenSearchMappingService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Add the entity in the mapping
   * @param args decorator args
   * @param target class
   */
  addEntity(args: OpenSearchEntityArgs, target: any, superClass: any): void {
    const className = target.name;
    const mapping = this.mappings.get(className);

    const mergeProperties = (properties) => {
      for (const propertyName of Object.keys(properties)) {
        const currentMappingProperty = mapping.properties.get(propertyName);
        let internalProperty: InternalOpenSearchMappingProperty = null;
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
        mergeProperties(superClassMapping.osmapping.body.properties);
      }
    }

    if (args) {
      mapping.osmapping.index = args.index;
      mapping.osmapping.body.dynamic = args.dynamic;
      mapping.readonly = args.readonly === true;

      if (args.mixins) {
        for (const mixin of args.mixins) {
          const openSearchEntity = this.mappings.get(mixin.name);
          if (openSearchEntity) {
            mergeProperties(openSearchEntity.osmapping.body.properties);
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
  addField(args: OpenSearchFieldArgs, target: any, propertyKey: string | symbol, propertyType?: any): void {
    const className = target.constructor.name;
    let mapping = this.mappings.get(className);
    if (!mapping) {
      mapping = new InternalOpenSearchMapping();
      this.mappings.set(className, mapping);
    }

    const properties: OpenSearchMappingProperty = args;
    if (args.type === 'nested' || args.type === 'object') {
      properties.type = args.type;
      const OpenSearchEntity = this.mappings.get(propertyType.name);
      if (OpenSearchEntity) {
        properties.properties = OpenSearchEntity.osmapping.body.properties;
      }
    }

    const internalProperty: InternalOpenSearchMappingProperty = {
      propertyMapping: properties,
    };

    const propertyName = args.name || propertyKey;
    mapping.addProperty(propertyName, internalProperty);
  }

  /**
   * Allow you to get the generated mapping list ready to be inserted inside elasticsearch
   */
  public getMappings(): InternalOpenSearchMapping[] {
    return Array.from(this.mappings.values());
  }

  /**
   * Allow you to get all index
   */
  public getOpenSearchMappings(): OpenSearchMapping[] {
    return Array.from(this.mappings.values()).map((mapping) => mapping.osmapping);
  }

  /**
   * Allow you to get the generate mapping map
   */
  public getMappingsMap() {
    return this.mappings;
  }

  /**
   * Allow you to get the generated mapping ready to be inserted inside elasticsearch
   * for a class name
   */
  public getMappingForClass(className: string): OpenSearchMapping {
    const internalMapping = this.mappings.get(className);
    if (internalMapping) {
      return internalMapping.osmapping;
    }
    return null;
  }

  /**
   * Allow you to get the generated mapping ready to be inserted inside elasticsearch
   * for an index name
   */
  public getMappingForIndex(indexName: string): OpenSearchMapping {
    const internalMapping = Array.from(this.getMappings().values()).find(
      (internalOpenSearchMapping) => internalOpenSearchMapping.osmapping.index === indexName
    );

    if (internalMapping) {
      return internalMapping.osmapping;
    }
    return null;
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex(): string[] {
    // load mapping with index
    const mappings = Array.from(this.mappings.values()).filter((mapping) => mapping.osmapping.index);
    return mappings.map((mapping) => mapping.osmapping.index);
  }

  /**
   * Allow to insert/update mapping into elasticsearch
   */
  public async uploadMappings(client: SearchClient) {
    const mappings = OpenSearchMappingService.getInstance().getMappings();

    await Promise.all(
      mappings.map(async (internalMapping) => {
        if (!internalMapping.readonly) {
          const openSearchMapping = internalMapping.osmapping;

          // delete readonly
          delete internalMapping.readonly;

          if (openSearchMapping.index) {
            const indexExist = await client.indices.exists({ index: openSearchMapping.index });
            if (!indexExist.body) {
              // create index
              await client.indices.create({ index: openSearchMapping.index });
              // create mapping
              await client.indices.putMapping(openSearchMapping);
            } else {
              // update mapping
              await client.indices.putMapping(openSearchMapping);
            }
          }
        }
      })
    );
  }
}
