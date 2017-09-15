import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropImageComponent } from './drop-image.component';

describe('DropImageComponent', () => {
  let component: DropImageComponent;
  let fixture: ComponentFixture<DropImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
