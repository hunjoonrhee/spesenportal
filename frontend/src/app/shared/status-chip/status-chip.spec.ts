import { TestBed } from '@angular/core/testing';
import { StatusChip } from './status-chip';

describe('StatusChip', () => {
  it('zeigt das deutsche Label für den Status', async () => {
    const fixture = TestBed.createComponent(StatusChip);
    fixture.componentRef.setInput('status', 'SUBMITTED');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent.trim()).toBe('Eingereicht');
  });
});
