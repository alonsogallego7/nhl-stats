import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingsFullComponent } from './standings-full.component';

describe('StandingsFullComponent', () => {
  let component: StandingsFullComponent;
  let fixture: ComponentFixture<StandingsFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandingsFullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandingsFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
