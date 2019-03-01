import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPicturePage } from './modal-picture.page';

describe('ModalPicturePage', () => {
  let component: ModalPicturePage;
  let fixture: ComponentFixture<ModalPicturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPicturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPicturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
