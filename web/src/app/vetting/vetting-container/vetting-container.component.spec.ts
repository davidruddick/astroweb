import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VettingContainerComponent } from './vetting-container.component';

describe('VettingContainerComponent', () => {
  let component: VettingContainerComponent;
  let fixture: ComponentFixture<VettingContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VettingContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VettingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
