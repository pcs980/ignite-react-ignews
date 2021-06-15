import { GetStaticProps } from 'next';
import Head from 'next/head';
import prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[],
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>ig.news | Posts</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map((post) => (
              <a href={`posts/${post.slug}`} key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>

            ))
          }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();
  const response = await client.query(
    prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt: post.data.content.find((c) => c.type === 'paragraph')?.text ?? '',
    updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }));

  return {
    revalidate: 1 * 60,
    props: {
      posts
    }
  };
};
