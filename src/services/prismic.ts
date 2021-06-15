import prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown) {
  const url = process.env.PRISMIC_ENTRYPOINT;
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
  const client = prismic.client(url, {
    req,
    accessToken,
  });

  return client;
}
