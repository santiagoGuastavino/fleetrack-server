import styles from '../../styles/Auth.module.css'
import { useState } from 'react'
import Button from '../Button'

const INITIAL_DATA = {
  name: '',
  surname: '',
  email: '',
  password: ''
}

const FORMS = {
  register: 0,
  login: 1
}

export default function Auth () {
  const [form, setForm] = useState(FORMS.register)
  const [formData, setFormData] = useState(INITIAL_DATA)

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

  const simple = {
    text: 'CREAR CUENTA',
    altText: 'ENTRAR A LA CUENTA',
    type: 'submit',
    classname: 'simple',
    f: function () {
      console.log('simple auth')
    }
  }

  const google = {
    text: 'CREAR CON GOOGLE',
    altText: 'ENTRAR CON GOOGLE',
    type: 'button',
    classname: 'google',
    f: function () {
      console.log('google auth')
    }
  }

  const meta = {
    text: 'CREAR CON META',
    altText: 'ENTRAR CON META',
    type: 'button',
    classname: 'meta',
    f: function () {
      console.log('meta auth')
    }
  }

  const change = {
    text: 'ENTRAR A LA CUENTA',
    altText: 'CREAR CUENTA',
    type: 'button',
    classname: 'switch',
    f: function () {
      form === FORMS.register && setForm(FORMS.login)
      form === FORMS.login && setForm(FORMS.register)
    }
  }

  const buttons = [
    simple,
    google,
    meta,
    change
  ]

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        {form === FORMS.login &&
          <>
            <div className={styles.inputBoxHalf}>
              <label>
                Nombre
              </label>
              <input
                name='name'
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div className={styles.inputBoxHalf}>
              <label>
                Apellido
              </label>
              <input
                name='surname'
                onChange={handleChange}
                value={formData.surname}
              />
            </div>
          </>
        }
        <div className={styles.inputBox}>
          <label>
            Correo Electrónico
          </label>
          <input
            name='email'
            onChange={handleChange}
            value={formData.email}
          />
        </div>
        <div className={styles.inputBox}>
          <label>
            Contraseña
          </label>
          <input
            name='password'
            onChange={handleChange}
            value={formData.password}
          />
        </div>
      </form>

      {form === FORMS.register &&
        <div className={styles.buttonBox}>
          {buttons.map((button, i) => (
            <Button key={i} {...button} register />
          ))}
        </div>
      }

      {form === FORMS.login &&
        <div className={styles.buttonBox}>
          {buttons.map((button, i) => (
            <Button key={i} {...button} login />
          ))}
        </div>
      }
    </>
  )
}
