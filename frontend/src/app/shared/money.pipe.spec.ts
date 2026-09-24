import { MoneyPipe } from './money.pipe';

describe('MoneyPipe', () => {
  const pipe = new MoneyPipe();

  it('formatiert EUR im deutschen Format', () => {
    expect(pipe.transform(1234.5).replace(/\s/g, ' ')).toBe('1.234,50 €');
  });

  it('gibt bei null einen leeren String zurück', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
