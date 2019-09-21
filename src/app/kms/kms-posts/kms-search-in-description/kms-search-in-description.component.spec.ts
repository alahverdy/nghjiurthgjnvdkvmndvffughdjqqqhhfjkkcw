import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KmsSearchInDescriptionComponent } from './kms-search-in-description.component';

describe('KmsSearchInDescriptionComponent', () => {
  let component: KmsSearchInDescriptionComponent;
  let fixture: ComponentFixture<KmsSearchInDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KmsSearchInDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KmsSearchInDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
