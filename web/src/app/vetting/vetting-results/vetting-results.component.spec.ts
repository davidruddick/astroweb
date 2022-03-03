import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VettingResultsComponent } from './vetting-results.component';

describe('VettingResultsComponent', () => {
  let component: VettingResultsComponent;
  let fixture: ComponentFixture<VettingResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VettingResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VettingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
