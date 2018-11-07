import { TestBed } from '@angular/core/testing';

import { CategoriaResolverService } from './categoria-resolver.service';

describe('CategoriaResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoriaResolverService = TestBed.get(CategoriaResolverService);
    expect(service).toBeTruthy();
  });
});
