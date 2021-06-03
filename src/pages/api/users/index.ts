import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Paulo' },
    { id: 2, name: 'Valquíria' },
    { id: 3, name: 'Pablo' },
  ];

  return response.status(200).json(users);
};
