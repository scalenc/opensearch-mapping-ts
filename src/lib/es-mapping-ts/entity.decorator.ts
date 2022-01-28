import { MappingService } from './mapping.service';

/**
 * Argument for an elasticsearch index
 */
export class EntityArgs {
  /** Name of the index */
  index?: string;
  /** Type of the index */
  type?: string;
  /** create mapping or not */
  readonly?: boolean;
  /** Additional properties or not */
  dynamic?: string | boolean;
  /** add mixins */
  mixins?: any[];
}

/**
 * @Entity decorator : register the entity in the mapping through the MappingService
 * @param args decorator annotation
 */
export function Entity(args?: EntityArgs): ClassDecorator {
  return (target: any) => {
    if (args && !args.type) {
      args.type = args.index;
    }

    // Extracting possible super class from prototype
    const protoType = Object.getPrototypeOf(target).name;
    let superClass = null;
    if (protoType !== '') {
      superClass = protoType;
    }

    MappingService.getInstance().addEntity(args, target, superClass);
  };
}
