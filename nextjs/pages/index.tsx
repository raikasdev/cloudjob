import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import config from '../config';
import styles from '../styles/Home.module.css'

const Home: NextPage = ({ jobs }) => {
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
              <li className="nav-item"><a href="/admin" className="nav-link">Admin</a></li>
            </ul>
          </header>
          <div className="accordion" id="accordionExample">
            {jobs ? 
              jobs.map((job, i: number) => (
                <div className="accordion-item" key={i}>
                  <h2 className="accordion-header" id={`heading${i}`}>
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      {job.name}
                    </button>
                  </h2>
                  <div id={`collapse${i}`} className="accordion-collapse collapse show" aria-labelledby={`heading${i}`} data-bs-parent="#accordionExample">
                    {job.applications.map((application: {name:string;experience:string;education:string;application:string;}, i: number) => (
                      <div className="application" key={i}>
                        <h3>{application.name}</h3>
                        <h4>Experience</h4>
                        <ReactMarkdown>{application.experience}</ReactMarkdown>
                        <h4>Education</h4>
                        <ReactMarkdown>{application.education}</ReactMarkdown>
                        <h4>Application</h4>
                        <ReactMarkdown>{application.application}</ReactMarkdown>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              )) 
            : 'Loading'}
          </div>
          <ul className="list-group">
            
          </ul>
          
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(): Promise<Record<string, unknown>> {
  const res = await fetch(`${config.baseUrl}/api/positions/`)
  const post = await res.json();
  
  return {
    props: { jobs: await Promise.all(post.map(async (id: string) => {
      return { id, ...(await (await fetch(`${config.baseUrl}/api/positions/${id}`)).json()), applications: (await (await fetch(`${config.baseUrl}/api/positions/${id}/applications`)).json()) }; 
    }))}, // will be passed to the page component as props
  }
}

export default Home