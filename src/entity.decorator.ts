import 'reflect-metadata';
import { OpenSearchMappingService } from './mapping.service';

/**
 * Argument for an elasticsearch index
 */
export class OpenSearchEntityArgs {
  /** Name of the index */
  index?: string;

  /** create mapping or not */
  readonly?: boolean;

  /** Additional properties or not */
  dynamic?: boolean | 'strict' | 'runtime';

  /** add mixins */
  mixins?: any[];
}

/**
 * @OpenSearchEntity decorator : register the entity in the mapping through the OpenSearchMappingService
 * @param args decorator annotation
 */
export function OpenSearchEntity(args?: OpenSearchEntityArgs): ClassDecorator {
  return (target: any) => {
    // Extracting possible super class from prototype
    const protoType = Object.getPrototypeOf(target).name;
    let superClass = null;
    if (protoType !== '') {
      superClass = protoType;
    }
    OpenSearchMappingService.getInstance().addEntity(args, target, superClass);
  };
}
