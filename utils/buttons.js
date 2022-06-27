export const buttons = [
  {
    text: 'CREAR CUENTA',
    type: 'submit',
    classname: 'create',
    f: function (e) {
      console.log('account creation')
    }
  },
  {
    text: 'CREAR CON GOOGLE',
    type: 'button',
    classname: 'google',
    f: function (e) {
      console.log('create w/ google')
    }
  },
  {
    text: 'CREAR CON META',
    type: 'button',
    classname: 'meta',
    f: function (e) {
      console.log('create w/ meta')
    }
  },
  {
    text: 'ENTRAR A LA CUENTA',
    type: 'button',
    classname: 'switch',
    f: function (e) {
      console.log('switch')
    }
  }
]
