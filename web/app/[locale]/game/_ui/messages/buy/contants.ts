export type Package = {
  name: string;
  title: string;
  description: string;
  amount: number;
};

// ['10', '30', '50', '200', '1000', '5000']
export const packages = [
  {
    name: 'pouch',
    amount: 10,
  },
  {
    name: 'bag',
    amount: 30,
  },
  {
    name: 'sack',
    amount: 50,
  },
  {
    name: 'chest',
    amount: 200,
  },
  {
    name: 'vault',
    amount: 1000,
  },
  {
    name: 'treasure',
    amount: 5000,
  },
];
