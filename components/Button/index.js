import styles from '../../styles/Button.module.css'

export default function Button (props) {
  return (
    <button
      type={props.type}
      className={styles.button + ' ' + styles[props.classname]}
      onClick={props.f}
    >
      {props.text}
    </button>
  )
}