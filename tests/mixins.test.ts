import 'reflect-metadata';
import '../test-resources/master.entity';
import { MappingService } from '../src';
import { MixedEntity } from '../test-resources/mixed.entity';
import { DetailsMixin } from '../test-resources/details.mixin';
import { expect } from 'chai';

describe('mixins', () => {
  it('should mixin classes', () => {
    const mixedMapping = MappingService.getInstance().getMappingForClass(MixedEntity.name);
    const mixin = MappingService.getInstance().getMappingForClass(DetailsMixin.name);

    expect(mixedMapping.body.properties['firstname']).to.equal(mixin.body.properties['firstname']);
    expect(mixedMapping.body.properties['lastname']).to.equal(mixin.body.properties['lastname']);
    expect(mixedMapping.body.properties['id']).not.to.be.undefined;

    expect(Object.keys(mixedMapping.body.properties)).to.equal(['id', 'firstname', 'lastname']);
  });
});
