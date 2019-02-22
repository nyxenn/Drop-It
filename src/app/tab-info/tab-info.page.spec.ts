import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabInfoPage } from './tab-info.page';

describe('TabInfoPage', () => {
  let component: TabInfoPage;
  let fixture: ComponentFixture<TabInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
