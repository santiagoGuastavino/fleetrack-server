import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useState } from 'react'
import { buttons } from '../utils/buttons'
import Button from '../components/Button'

const INITIAL_STATE = {
  name: '',
  surname: '',
  email: '',
  password: ''
}

export default function Home () {
  const [formData, setFormData] = useState(INITIAL_STATE)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

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

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputBoxHalf}>
                <label>
                  Nombre
                </label>
                <input
                  name='name'
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputBoxHalf}>
                <label>
                  Apellido
                </label>
                <input
                  name='surname'
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputBox}>
                <label>
                  Correo Electrónico
                </label>
                <input
                  name='email'
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputBox}>
                <label>
                  Contraseña
                </label>
                <input
                  name='password'
                  onChange={handleChange}
                />
              </div>
            </form>

            <div className={styles.buttonBox}>
              {buttons.map((button, i) => (
                <Button key={i} {...button} />
              ))}
            </div>

          </section>

        </div>

      </main>
    </>
  )
}
