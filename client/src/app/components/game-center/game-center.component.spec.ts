import { TestBed } from '@angular/core/testing';
import { GameCenterComponent } from './game-center.component';

describe('GameCenterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCenterComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GameCenterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
