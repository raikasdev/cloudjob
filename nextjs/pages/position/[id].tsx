import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import Head from 'next/head'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/PositionIndex.module.css'
import { useEffect, useState } from 'react';
import config from '../../config';

const PositionIndex: NextPage = () => {
  const router = useRouter()
  const { id } = router.query;
  
  const [data, setData] = useState({});
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${config.baseUrl}/api/positions/${id}`);
        const json = await res.json();
        if (json.error) {
          window.location.href = '/';
        }
        setData(json);
      } catch (e) {
        window.location.href = '/';
      }
    }
    run();
  }, [id]);
  return (
    <div className={styles.container}>
      <Head>
        <title>CloudJob</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="container">
          <header className="d-flex justify-content-center py-3">
            <ul className="nav nav-pills">
              <li className="nav-item">
                  <Link href="/">
                    <a className="nav-link active" aria-current="page">Positions</a>
                  </Link>
                </li>
              <li className="nav-item">
                <Link href="/admin">
                  <a className="nav-link">Admin</a>
                </Link>
              </li>
            </ul>
          </header>
          <h1>{(data as {name: string;}).name}</h1>
          <ReactMarkdown>{(data as {description: string;}).description}</ReactMarkdown>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps({ params }: {params: {id:string;}}): Promise<Record<string, unknown>> {
  // params contains the post `id`.
  const res = await fetch(`${config.baseUrl}/api/positions/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export async function getStaticPaths(): Promise<Record<string, unknown>> {
  const res = await fetch(`${config.baseUrl}/api/positions`)
  const data = await res.json()
  return {
    paths: data.map((id: string) => {
      return { params: { id } };
    }),
    fallback: true,
  };
}

export default PositionIndex;
