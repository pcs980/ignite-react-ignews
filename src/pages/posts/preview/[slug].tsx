import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useSession } from "next-auth/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Want to continue reading?
            <Link href='#'>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const client = getPrismicClient();
  const response = await client.getByUID('post', slug as string, {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return {
    revalidate: 60 * 30, // 30 minutos
    props: {
      post
    }
  };
};
