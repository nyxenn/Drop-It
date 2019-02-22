import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWritePage } from './modal-write.page';

describe('ModalWritePage', () => {
  let component: ModalWritePage;
  let fixture: ComponentFixture<ModalWritePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWritePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWritePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
