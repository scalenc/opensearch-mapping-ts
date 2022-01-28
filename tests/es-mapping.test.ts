import { expect } from 'chai';
import 'reflect-metadata';
import { MappingService } from '../src';
import '../test-resources/actual.entity';
import '../test-resources/dynamic.entity';
import '../test-resources/extending.entity';
import '../test-resources/master.entity';
import { ObjectEntity } from '../test-resources/object.entity';
import { ReadOnlyEntity } from '../test-resources/read-only.entity';

describe('es-mapping unit:test', () => {
  it('Mapping for type "masterType" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForType('masterType');
    expect(mapping).not.to.be.undefined;
  });

  it('Mapping for index "extending" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForIndex('extending');
    expect(mapping).not.to.be.undefined;

    expect(mapping.body).not.to.be.undefined;

    expect(mapping.index).to.equal('extending');
    expect(mapping.type).to.equal('typeExtending');

    expect(mapping.body.properties.name).not.to.be.undefined;
    expect(mapping.body.properties.name.type).to.equal('text');

    expect(mapping.body.properties.firstname).not.to.be.undefined;
    expect(mapping.body.properties.firstname.copy_to).to.equal('name');

    expect(mapping.body.properties.notIndexed).not.not.to.be.undefined;
    expect(mapping.body.properties.customName).not.to.be.undefined;
    expect(mapping.body.properties.customName.name).not.not.to.be.undefined;
    expect(mapping.body.properties.customName.enabled).to.equal(false);

    expect(mapping.body.properties.lastname).not.to.be.undefined;
    expect(mapping.body.properties.lastname.copy_to).to.equal('name');

    expect(mapping.body.properties.extendend).not.to.be.undefined;
    expect(mapping.body.properties.extendend.type).to.equal('text');

    expect(mapping.body.properties.objects).not.to.be.undefined;
    expect(mapping.body.properties.objects.type).to.equal('object');
    expect(mapping.body.properties.objects.properties).not.to.be.undefined;
    expect(mapping.body.properties.objects.fieldClass).not.not.to.be.undefined;

    expect(mapping.body.properties.nesteds).not.to.be.undefined;
    expect(mapping.body.properties.nesteds.type).to.equal('nested');
    expect(mapping.body.properties.nesteds.dynamic).to.equal('strict');
    expect(mapping.body.properties.nesteds.fieldClass).not.not.to.be.undefined;
    expect(mapping.body.properties.nesteds.properties).not.to.be.undefined;
  });

  it('Mapping for index "actual" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForIndex('actual');
    expect(mapping).not.to.be.undefined;

    expect(mapping.body.properties.abstractName).not.to.be.undefined;
    expect(mapping.body.properties.abstractName.type).to.equal('text');

    expect(mapping.body.properties.overridableName).not.to.be.undefined;
    expect(mapping.body.properties.overridableName.type).to.equal('text');
    expect(mapping.body.properties.overridableName.null_value).to.equal('undefined');

    expect(mapping.body.properties.actualName).not.to.be.undefined;
    expect(mapping.body.properties.actualName.type).to.equal('text');
  });

  it('Mapping for index "dynamic-strict" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForType('dynamicStrict');
    expect(mapping).not.to.be.undefined;

    expect(mapping.index).to.equal('dynamic-strict');
    expect(mapping.dynamic).to.equal('strict');
  });

  it('Mapping for index "dynamic-true" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForType('dynamicTrue');
    expect(mapping).not.to.be.undefined;

    expect(mapping.index).to.equal('dynamic-true');
    expect(mapping.dynamic).to.be.true;
  });

  it('Mapping for index "dynamic-false" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForType('dynamicFalse');
    expect(mapping).not.to.be.undefined;

    expect(mapping.index).to.equal('dynamic-false');
    expect(mapping.dynamic).to.be.false;
  });

  it('Mapping for index "nestedInd" should exist', () => {
    const mappings = MappingService.getInstance().getMappingForIndex('nestedInd');
    expect(mappings).not.to.be.undefined;
  });

  it('Mapping for index "object" should not exist', () => {
    const mappings = MappingService.getInstance().getMappingForIndex('object');
    expect(mappings).to.be.null;
  });

  it('Mapping for class "ObjectEntity" should exist', () => {
    const mappings = MappingService.getInstance().getMappingForClass('ObjectEntity');
    expect(mappings).not.to.be.undefined;
  });

  it('Mapping for class unknow should not exist', () => {
    const mapping = MappingService.getInstance().getMappingForClass('unknow');
    expect(mapping).to.be.null;
  });

  it('Mapping for type unknow should not exist', () => {
    const mapping = MappingService.getInstance().getMappingForType('unknow');
    expect(mapping).to.be.null;
  });

  it('Mapping for type "masterType" should exist', () => {
    const mapping = MappingService.getInstance().getMappingForIndex('master');
    expect(mapping).not.to.be.undefined;
    expect(mapping.body).not.to.be.undefined;
    expect(mapping.index).to.equal('master');
    expect(mapping.type).to.equal('masterType');
    expect(mapping.body.properties.name).not.to.be.undefined;
    expect(mapping.body.properties.name.type).to.equal('text');

    expect(mapping.body.properties.firstname).not.to.be.undefined;
    expect(mapping.body.properties.firstname.copy_to).to.equal('name');

    expect(mapping.body.properties.notIndexed).not.not.to.be.undefined;
    expect(mapping.body.properties.customName).not.to.be.undefined;
    expect(mapping.body.properties.customName.name).not.not.to.be.undefined;
    expect(mapping.body.properties.customName.enabled).to.equal(false);

    expect(mapping.body.properties.lastname).not.to.be.undefined;
    expect(mapping.body.properties.lastname.copy_to).to.equal('name');

    expect(mapping.body.properties.objects).not.to.be.undefined;
    expect(mapping.body.properties.objects.type).to.equal('object');
    expect(mapping.body.properties.objects.properties).not.to.be.undefined;
    expect(mapping.body.properties.objects.fieldClass).not.not.to.be.undefined;

    expect(mapping.body.properties.nesteds).not.to.be.undefined;
    expect(mapping.body.properties.nesteds.type).to.equal('nested');
    expect(mapping.body.properties.nesteds.dynamic).to.equal('strict');
    expect(mapping.body.properties.nesteds.fieldClass).not.not.to.be.undefined;
    expect(mapping.body.properties.nesteds.properties).not.to.be.undefined;
  });

  it('should return mappings map', () => {
    const mappings = MappingService.getInstance().getMappings();
    expect(mappings.length).to.equal(10);
  });

  it('should return mapping indexes', () => {
    const indexes = MappingService.getInstance().getAllIndex();
    expect(indexes.length).to.equal(7);
  });

  it('should return es mappings', () => {
    const mappings = MappingService.getInstance().getMappings();
    expect(mappings.length).to.equal(10);
  });

  it('should return mappings', () => {
    const mappings = MappingService.getInstance().getMappings();
    expect(mappings.length).to.equal(10);
  });

  it('should return the mapping map', () => {
    const mappingsMap = MappingService.getInstance().getMappingsMap();
    expect(mappingsMap).not.to.be.undefined;
  });

  it('should not load entity with non array nested field', () => {
    try {
      require('./resources/wrong-nested.entity');
    } catch (err) {
      expect(err).not.to.be.undefined;
      expect(err.message).to.equal('es-mapping-error type of a nested field must be an array : WrongNestedEntity:nesteds');
    }
  });

  it('should not load entity with join relation without relations defined', () => {
    try {
      require('./resources/wrong-relation.entity');
    } catch (err) {
      expect(err).not.to.be.undefined;
      expect(err.message).to.equal('es-mapping-error no relations defined for join datatype : WrongRelationEntity:relations');
    }
  });

  it('should rename keys if name is provided', () => {
    const mapping = MappingService.getInstance().getMappingForClass(ObjectEntity.name);
    const properties = Object.keys(mapping.body.properties);
    expect(properties.includes('date_of_birth')).to.be.true;
  });

  it('should not add name to the es mapping', () => {
    const mapping = MappingService.getInstance().getMappingForClass(ObjectEntity.name);
    const dob = mapping.body.properties['date_of_birth'];
    const fields = Object.keys(dob);
    expect(fields.includes('name')).to.be.false;
  });

  it('should create a read only entity', () => {
    const mapping = MappingService.getInstance().getMappingForClass(ReadOnlyEntity.name);
    expect(mapping).not.to.be.undefined;

    const mappings = MappingService.getInstance().getInternalMappings();
    const readonlyMappings = mappings.filter((m) => m.readonly);
    expect(readonlyMappings).to.be.of.length(1);
  });
});
