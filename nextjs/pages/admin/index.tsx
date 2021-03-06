import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import config from "../../config";
import styles from "../../styles/Admin.module.css";

const Home: NextPage = ({ jobs }: any) => {
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
                  <a className="nav-link">Positions</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin">
                  <a className="nav-link active" aria-current="page">
                    Admin
                  </a>
                </Link>
              </li>
            </ul>
          </header>
          <Accordion>
            {jobs
              ? jobs.map(
                  (
                    job: {
                      name: string,
                      applications: {
                        experience: string,
                        name: string,
                        education: string,
                        application: string,
                      }[],
                    },
                    i: number
                  ) => (
                    <Accordion.Item eventKey={`${i}`} key={i}>
                      <Accordion.Header>{job.name}</Accordion.Header>
                      <Accordion.Body>
                        {job.applications.map(
                          (
                            application: {
                              name: string,
                              experience: string,
                              education: string,
                              application: string,
                            },
                            i: number
                          ) => (
                            <div className="application" key={i}>
                              <h3>{application.name}</h3>
                              <h4>Experience</h4>
                              {application.experience
                                .split("\n")
                                .map((t: string, i: number) => {
                                  return <p key={i}>{t}</p>;
                                })}

                              <h4>Education</h4>
                              {application.education
                                .split("\n")
                                .map((t: string, i: number) => {
                                  return <p key={i}>{t}</p>;
                                })}
                              <h4>Application</h4>
                              {application.application
                                .split("\n")
                                .map((t: string, i: number) => {
                                  return <p key={i}>{t}</p>;
                                })}
                              <hr />
                            </div>
                          )
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                )
              : "Loading"}
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(): Promise<Record<string, unknown>> {
  const res = await fetch(`${config.baseUrl}/api/positions/`);
  const post = await res.json();

  return {
    props: {
      jobs: await Promise.all(
        post.map(async (id: string) => {
          return {
            id,
            ...(await (
              await fetch(`${config.baseUrl}/api/positions/${id}`)
            ).json()),
            applications: await (
              await fetch(
                `${config.baseUrl}/api/positions/${id}/applications?admin_key=${process.env.ADMIN_KEY}`
              )
            ).json(),
          };
        })
      ),
    }, // will be passed to the page component as props
  };
}

export default Home;
