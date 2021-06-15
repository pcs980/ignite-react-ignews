import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";
import styles from './post.module.scss';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return(
    <>
      <Head>
        <title>ig.news | {post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = getSession({ req });
  const { slug } = params;

  if (!session) {
    console.log('not logged');
  }

  const client = getPrismicClient(req);
  const response = await client.getByUID('post', slug as string, {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return {
    props: {
      post
    }
  };
};
