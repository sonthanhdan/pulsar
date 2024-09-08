import { Example } from './types';

const examples: Example[] = [
  {
    code: '(cos(x * t / 5) + sin(y * t / 5)) / 2',
  },
  {
    code: '(cos(sqrt(x * x + y * y) - t) + 1) / 2',
    grid: 'hex',
  },
  {
    code: '(cos(sin(x * y) + t * 0.66) + 1) / 2',
  },
  {
    code: '((cos(t + x + cos(t)) + sin(t + y)) + 2) / 4',
  },
  {
    code: 'sqrt(x*x + y*y) > (cos(x + t) + 1) / 2 * 5  ? noise(x + t, y + t) * 0.3 : 1',
  },
  {
    code: 'cos(x + t) > y * 0.3 + 0.5 ? (cos(x + t) + 1) / 4 + 0.5 : 0', // 'cos(x + t) > y * 0.3 + 0.5 ? 0.8 : 0',
  },
  {
    code: 'cos(t * 0.5) * 0.5 + 0.5', // pulse
    animate: 'opacity',
  },
  {
    code: 'sin(0.5 * x + y * t * 0.8) * sin(t / 4)',
    grid: 'triangular',
  },
  {
    code: 'sin(x * cos(t * 0.5)) + cos(y * sin(t * 0.5))',
    grid: 'hex',
  },
  {
    code: ' sin(t) * sin(x) + cos(t) * cos(y)',
    grid: 'triangular',
    animate: 'opacity',
  },
  {
    code: 'abs(abs(x) - abs(y)) < t % 7 ? 1 : 0',
    grid: 'hex',
  },
  {
    code: 'sin(3 * atan2(y,x) + t)',
    grid: 'hex',
  },
  {
    code: '1 - (((x + 3) * (x + 4) + y + t * 0.3 * (1 + x * x % 5) * 3) % 36) / 12',
    animate: 'opacity',
  },
  {
    code: '1 / abs((x + y) + (t * 4) % 70 - 35)',
  },
  {
    code: 'abs(sin(t / 3 * x / 2) * exp(1 - sqrt(pow(x / 2, 2) + pow(y / 2, 2))))',
  },
  {
    code: '(3 / sqrt(((x * 1.5) - 6 * cos(t * 0.5)) ** 2 + ((y * 1.5) - 6 * sin(t * 0.5)) ** 2)) ** 2.5',
    grid: 'hex',
  },
  /*
  https://news.ycombinator.com/item?id=41478068

  // This script recognizes 17 regions and paints each region according to
  // the lookup table, where the following number corresponds to `c`.
  //
  //    |12|   7   | 2|
  //    +--+-------+--+
  //    |  |       |  |
  //    |11|   6   | 1|
  //    |  |       |  |
  //    +--+-------+--+
  // XX |10|   5   | 0| XX
  //    +--+-------+--+
  //    |  |       |  |
  //    | 9|   4   |-1|
  //    |  |       |  |
  //    +--+-------+--+
  //    | 8|   3   |-2|
  //
  (abs(x)<5)*   // Removes the left and right edge (XX above)
  (1-t%1)**.3*  // Blinks every time the digit changes, but not too quickly
  ((c,d)=>      // c: region index (see above), d: the current digit
    c&1&        // Even-numbered region is always blank
    ~(c+1?      // Due to the JS number semantics, at least one segment
                // should be encoded outside of the lookup table
      //          d=4     d=3    d=2    d=1    d=0
      // d<5:  0b011010_110000_100000_111110_000100
      // d>=5: 0b010000_000000_110110_000001_010001
      //          d=9     d=8    d=7    d=6    d=5
      268656721+(d<5)*180268851
      // Read the lookup table; c/2 will be truncated by `>>`
      >>d%5*6+c/2
    :
      d==2      // c==-1 case is handled separately
    )
  )(
    (y>4)-5*(x>2)+(y>0)-(y<0)+5*(x<-2)-(y<-4)+5, // Calculate a region index
    t%10|0                                       // `|0` for `Math.floor`
  )
  */
  {
    code: '(abs(x)<5)*(1-t%1)**.3*((c,d)=>c&1&~(c+1?268656721+(d<5)*180268851>>d%5*6+c/2:d==2))((y>4)-5*(x>2)+(y>0)-(y<0)+5*(x<-2)-(y<-4)+5,t%10|0)'
  }
];

export function getRandomExample(): Example {
  return {
    grid: 'classic',
    animate: 'scale',
    ...examples[Math.floor(Math.random() * examples.length)],
  };
}

export const randomExample = getRandomExample();
