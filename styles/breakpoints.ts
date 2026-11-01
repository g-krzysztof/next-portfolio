const values = [
  '320px',
  '375px',
  '420px',
  '568px',
  '768px',
  '1024px',
  '1140px',
  '1366px',
  '1680px',
];

// tablica dla styled-system, nazwane klucze dla własnych media queries
const breakpoints = Object.assign(values, {
  mobile: values[0],
  mobileM: values[1],
  mobileXM: values[2],
  mobileL: values[3],
  tablet: values[4],
  tabletL: values[5],
  laptopS: values[6],
  laptop: values[7],
  desktop: values[8],
  minHeight: '800px',
});

export default breakpoints;
