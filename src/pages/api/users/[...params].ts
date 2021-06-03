import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  // api/users/edit/1/more
  const [ action, id, option ] = request.query.params as string[];
  console.log({ action, id, option });

  const users = [
    { id: 1, name: 'Paulo' },
    { id: 2, name: 'Valquíria' },
    { id: 3, name: 'Pablo' },
  ];

  return response.status(200).json(users);
};
