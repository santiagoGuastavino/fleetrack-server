import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Auth from '../components/Auth'

export default function Home () {
  return (
    <>
      <Head>
        <title>Easy Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.homeImg}>
          <img src='/images/home.jpg' alt='home-img' />
        </div>

        <div className={styles.rightPanelWrapper}>

          <section className={styles.section}>

            <div className={styles.logoImg}>
              <img src='/images/logo.png' alt='logo-img' />
            </div>

            <h1 className={styles.title}>
              Texto por definir
            </h1>

            <Auth />
          </section>

        </div>

      </main>
    </>
  )
}
