import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VettingDetailsComponent } from './vetting-details.component';

describe('VettingDetailsComponent', () => {
  let component: VettingDetailsComponent;
  let fixture: ComponentFixture<VettingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VettingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VettingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
