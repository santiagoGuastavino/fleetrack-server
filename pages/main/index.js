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
            <li><p>Resumen</p></li>
            <li><p>Clientes</p></li>
            <li><p>Propiedades</p></li>
            <li><p>Documentos</p></li>
            <li><p>Mensajes</p></li>
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
