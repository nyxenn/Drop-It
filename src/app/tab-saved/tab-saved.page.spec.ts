import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSavedPage } from './tab-saved.page';

describe('TabSavedPage', () => {
  let component: TabSavedPage;
  let fixture: ComponentFixture<TabSavedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabSavedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSavedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
