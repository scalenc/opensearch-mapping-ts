import 'reflect-metadata';
import { OpenSearchMappingService } from './mapping.service';

/**
 * Argument for a simple elasticsearch field
 */
export class OpenSearchFieldArgs {
  /** Type of the field */
  type?:
    | 'null'
    | 'boolean'
    | 'byte'
    | 'short'
    | 'integer'
    | 'long'
    | 'double'
    | 'float'
    | 'half_float'
    | 'scaled_float'
    | 'keyword'
    | 'text'
    | 'binary'
    | 'datetime'
    | 'ip'
    | 'object'
    | 'nested';

  /** Name of the field : if it need to be different of the property name */
  name?: string;

  /** Additional properties or not */
  dynamic?: boolean | 'strict' | 'runtime';

  /** Analyzer type */
  analyzer?:
    | 'fingerprint'
    | 'keyword'
    | 'pattern'
    | 'simple'
    | 'standard'
    | 'stop'
    | 'whitespace'
    | 'arabic'
    | 'armenian'
    | 'basque'
    | 'bengali'
    | 'brazilian'
    | 'bulgarian'
    | 'catalan'
    | 'cjk'
    | 'czech'
    | 'danish'
    | 'dutch'
    | 'english'
    | 'estonian'
    | 'finnish'
    | 'french'
    | 'galician'
    | 'german'
    | 'greek'
    | 'hindi'
    | 'hungarian'
    | 'indonesian'
    | 'irish'
    | 'italian'
    | 'latvian'
    | 'lithuanian'
    | 'norwegian'
    | 'persian'
    | 'portuguese'
    | 'romanian'
    | 'russian'
    | 'sorani'
    | 'spanish'
    | 'swedish'
    | 'turkish'
    | 'thai'
    | string;

  /** Additional fields */
  fields?: any;

  /** Format */
  format?: string;

  /** Enabled */
  enabled?: boolean;

  /** Define the null value */
  null_value?: any;

  /** copy into a group field */
  copy_to?: string;

  /** Relations for join datatype */
  relations?: any;

  /** Define class for "array/nested" type */

  fieldClass?: any;

  /** Additional properties */
  [x: string]: any;
}

/**
 * @OpenSearchField decorator : register the field in the mapping through the OpenSearchMappingService
 * @param args decorator annotation
 */
export function OpenSearchField(args: OpenSearchFieldArgs): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    let propertyType = Reflect.getMetadata('design:type', target, propertyKey);
    if (args.type === 'join' && !args.relations) {
      throw new Error(`es-mapping-error no relations defined for join datatype : ${target.constructor.name}:${propertyKey as string}`);
    }

    if (args.type === 'nested') {
      if (propertyType.name !== 'Array' && !propertyType.values) {
        throw new Error(`es-mapping-error type of a nested field must be an array : ${target.constructor.name}:${propertyKey as string}`);
      }
      if (!args.fieldClass) {
        console.warn(`es-mapping-warning no fieldClass defined for nested datatype : ${target.constructor.name}:${propertyKey as string}`);
      }
    }

    if (args.type === 'object' && !args.fieldClass) {
      if (propertyType.name === 'Array') {
        console.warn(`es-mapping-warning no fieldClass defined for object array datatype :
        ${target.constructor.name}:${propertyKey as string}`);
      }
    }

    if (args.fieldClass) {
      propertyType = args.fieldClass;
    }

    delete args.fieldClass;

    OpenSearchMappingService.getInstance().addField(args, target, propertyKey, propertyType);
  };
}
