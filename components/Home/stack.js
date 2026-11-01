// Technologia z content/{pl,en}.json: { name, detail?, strong? }.
// Linia stacku to kilka technologii, które w CV stoją obok siebie.

export const techLabel = ({ name, detail }) =>
  detail ? `${name} [${detail}]` : name;

export const lineLabel = (line) => line.map(techLabel).join(', ');
