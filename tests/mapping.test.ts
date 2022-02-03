import { expect } from 'chai';
import 'reflect-metadata';
import { OpenSearchMappingService } from '../src';
import './resources/concrete.entity';
import { DetailsMixin } from './resources/details.mixin';
import './resources/dynamic.entity';
import './resources/extending.entity';
import './resources/master.entity';
import { MixedEntity } from './resources/mixed.entity';
import { ObjectEntity } from './resources/object.entity';
import { ReadOnlyEntity } from './resources/read-only.entity';

describe('opensearch-mapping unit:test', () => {
  it('Mapping for index "masterType" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('master');
    expect(mapping).not.to.be.undefined;
  });

  it('Mapping for index "extending" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('extending');
    expect(mapping).not.to.be.undefined;

    expect(mapping.body).not.to.be.undefined;

    expect(mapping.index).to.eql('extending');
    expect(mapping.body.properties.name).not.to.be.undefined;
    expect(mapping.body.properties.name.type).to.eql('text');

    expect(mapping.body.properties.firstName).not.to.be.undefined;
    expect(mapping.body.properties.firstName.copy_to).to.eql('name');

    expect(mapping.body.properties.notIndexed).to.be.undefined;
    expect(mapping.body.properties.customName).not.to.be.undefined;
    expect(mapping.body.properties.customName.name).to.be.undefined;
    expect(mapping.body.properties.customName.enabled).to.eql(false);

    expect(mapping.body.properties.lastName).not.to.be.undefined;
    expect(mapping.body.properties.lastName.copy_to).to.eql('name');

    expect(mapping.body.properties.extendend).not.to.be.undefined;
    expect(mapping.body.properties.extendend.type).to.eql('text');

    expect(mapping.body.properties.objects).not.to.be.undefined;
    expect(mapping.body.properties.objects.type).to.eql('object');
    expect(mapping.body.properties.objects.properties).not.to.be.undefined;
    expect(mapping.body.properties.objects.fieldClass).to.be.undefined;

    expect(mapping.body.properties.nesteds).not.to.be.undefined;
    expect(mapping.body.properties.nesteds.type).to.eql('nested');
    expect(mapping.body.properties.nesteds.dynamic).to.eql('strict');
    expect(mapping.body.properties.nesteds.fieldClass).to.be.undefined;
    expect(mapping.body.properties.nesteds.properties).not.to.be.undefined;
  });

  it('Mapping for index "concrete" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('concrete');
    expect(mapping).not.to.be.undefined;

    expect(mapping.body.properties.abstractName).not.to.be.undefined;
    expect(mapping.body.properties.abstractName.type).to.eql('text');

    expect(mapping.body.properties.overridableName).not.to.be.undefined;
    expect(mapping.body.properties.overridableName.type).to.eql('text');

    expect(mapping.body.properties.overridableNumber).not.to.be.undefined;
    expect(mapping.body.properties.overridableNumber.type).to.eql('double');
    expect(mapping.body.properties.overridableNumber.null_value).to.eql(1);

    expect(mapping.body.properties.concreteName).not.to.be.undefined;
    expect(mapping.body.properties.concreteName.type).to.eql('text');
  });

  it('Mapping for index "dynamic-strict" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('dynamic-strict');
    expect(mapping).not.to.be.undefined;

    expect(mapping.index).to.eql('dynamic-strict');
    expect(mapping.body.dynamic).to.eql('strict');
  });

  it('Mapping for index "dynamic-true" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('dynamic-true');
    expect(mapping).not.to.be.undefined;

    expect(mapping.index).to.eql('dynamic-true');
    expect(mapping.body.dynamic).to.be.true;
  });

  it('Mapping for index "dynamic-false" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('dynamic-false');
    expect(mapping).not.to.be.undefined;

    expect(mapping.index).to.eql('dynamic-false');
    expect(mapping.body.dynamic).to.be.false;
  });

  it('Mapping for index "nestedInd" should exist', () => {
    const mappings = OpenSearchMappingService.getInstance().getMappingForIndex('nestedInd');
    expect(mappings).not.to.be.undefined;
  });

  it('Mapping for index "object" should not exist', () => {
    const mappings = OpenSearchMappingService.getInstance().getMappingForIndex('object');
    expect(mappings).to.be.null;
  });

  it('Mapping for class "ObjectEntity" should exist', () => {
    const mappings = OpenSearchMappingService.getInstance().getMappingForClass('ObjectEntity');
    expect(mappings).not.to.be.undefined;
  });

  it('Mapping for class unknown should not exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForClass('unknown');
    expect(mapping).to.be.null;
  });

  it('Mapping for index unknow should not exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForClass('unknow');
    expect(mapping).to.be.null;
  });

  it('Mapping for index "masterType" should exist', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForIndex('master');
    expect(mapping).not.to.be.undefined;
    expect(mapping.body).not.to.be.undefined;
    expect(mapping.index).to.eql('master');
    expect(mapping.body.properties.name).not.to.be.undefined;
    expect(mapping.body.properties.name.type).to.eql('text');

    expect(mapping.body.properties.firstName).not.to.be.undefined;
    expect(mapping.body.properties.firstName.copy_to).to.eql('name');

    expect(mapping.body.properties.notIndexed).to.be.undefined;
    expect(mapping.body.properties.customName).not.to.be.undefined;
    expect(mapping.body.properties.customName.name).to.be.undefined;
    expect(mapping.body.properties.customName.enabled).to.eql(false);

    expect(mapping.body.properties.lastName).not.to.be.undefined;
    expect(mapping.body.properties.lastName.copy_to).to.eql('name');

    expect(mapping.body.properties.objects).not.to.be.undefined;
    expect(mapping.body.properties.objects.type).to.eql('object');
    expect(mapping.body.properties.objects.properties).not.to.be.undefined;
    expect(mapping.body.properties.objects.fieldClass).to.be.undefined;

    expect(mapping.body.properties.nesteds).not.to.be.undefined;
    expect(mapping.body.properties.nesteds.type).to.eql('nested');
    expect(mapping.body.properties.nesteds.dynamic).to.eql('strict');
    expect(mapping.body.properties.nesteds.fieldClass).to.be.undefined;
    expect(mapping.body.properties.nesteds.properties).not.to.be.undefined;
  });

  it('should return mappings map', () => {
    const mappings = OpenSearchMappingService.getInstance().getMappings();
    expect(mappings.length).to.eql(12);
  });

  it('should return mapping indexes', () => {
    const indexes = OpenSearchMappingService.getInstance().getAllIndex();
    expect(indexes.length).to.eql(7);
  });

  it('should return es mappings', () => {
    const osMappings = OpenSearchMappingService.getInstance().getOpenSearchMappings();
    expect(osMappings.length).to.eql(12);
  });

  it('should return mappings', () => {
    const mappings = OpenSearchMappingService.getInstance().getMappings();
    expect(mappings.length).to.eql(12);
  });

  it('should return the mapping map', () => {
    const mappingsMap = OpenSearchMappingService.getInstance().getMappingsMap();
    expect(mappingsMap).not.to.be.undefined;
  });

  it('should not load entity with non array nested field', () => {
    try {
      require('./resources/wrong-nested.entity');
    } catch (err) {
      expect(err).not.to.be.undefined;
      expect(err.message).to.eql('opensearch-mapping-error type of a nested field must be an array : WrongNestedEntity:nesteds');
    }
  });

  it('should not load entity with join relation without relations defined', () => {
    try {
      require('./resources/wrong-relation.entity');
    } catch (err) {
      expect(err).not.to.be.undefined;
      expect(err.message).to.eql('opensearch-mapping-error no relations defined for join datatype : WrongRelationEntity:relations');
    }
  });

  it('should rename keys if name is provided', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForClass(ObjectEntity.name);
    const properties = Object.keys(mapping.body.properties);
    expect(properties.includes('date_of_birth')).to.be.true;
  });

  it('should not add name to the es mapping', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForClass(ObjectEntity.name);
    const dob = mapping.body.properties['date_of_birth'];
    const fields = Object.keys(dob);
    expect(fields.includes('name')).to.be.false;
  });

  it('should create a read only entity', () => {
    const mapping = OpenSearchMappingService.getInstance().getMappingForClass(ReadOnlyEntity.name);
    expect(mapping).not.to.be.undefined;

    const mappings = OpenSearchMappingService.getInstance().getMappings();
    const readonlyMappings = mappings.filter((m) => m.readonly);
    expect(readonlyMappings).to.be.of.length(1);
  });
});

describe('mixins', () => {
  it('should mixin classes', () => {
    const mixedMapping = OpenSearchMappingService.getInstance().getMappingForClass(MixedEntity.name);
    const mixin = OpenSearchMappingService.getInstance().getMappingForClass(DetailsMixin.name);

    expect(mixedMapping.body.properties['firstName']).to.eql(mixin.body.properties['firstName']);
    expect(mixedMapping.body.properties['lastName']).to.eql(mixin.body.properties['lastName']);
    expect(mixedMapping.body.properties['id']).not.to.be.undefined;

    expect(Object.keys(mixedMapping.body.properties)).to.eql(['id', 'firstName', 'lastName']);
  });
});
