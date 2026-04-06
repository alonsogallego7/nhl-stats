import { TestBed } from '@angular/core/testing';
import { StatsFullComponent } from './stats-full.component';

describe('StatsFullComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsFullComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StatsFullComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
