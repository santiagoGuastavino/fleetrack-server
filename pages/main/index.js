import styles from '../../styles/Main.module.css'
import Head from 'next/head'

export default function Main () {
  return (
    <>
      <Head>
        <title>Easy Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <aside className={styles.aside}>
          <div className={styles.imgBox}>
            <img src='images/logo.png' />
          </div>
          <ul className={styles.linkBox}>
            <li>Resumen</li>
            <li>Clientes</li>
            <li>Propiedades</li>
            <li>Documentos</li>
            <li>Mensajes</li>
          </ul>
        </aside>
        <section className={styles.section}>
          <nav className={styles.nav}>

          </nav>
        </section>
      </main>
    </>
  )
}
