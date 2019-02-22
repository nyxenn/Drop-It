import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMapPage } from './tab-map.page';

describe('TabMapPage', () => {
  let component: TabMapPage;
  let fixture: ComponentFixture<TabMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
