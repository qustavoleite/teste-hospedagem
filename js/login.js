async function login() {
  const email = document.getElementById('email').value
  const senha = document.getElementById('password').value

  if (!email || !senha) {
    alert('Preencha todos os campos')
    return
  }

  const body = JSON.stringify({ email: email, senha: senha })

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('token', data.token) 
      const decodedToken = jwt_decode(data.token)

      console.log('Token decodificado:', decodedToken)

      if (!decodedToken.data || !decodedToken.data.nivel) {
        alert('Erro ao identificar o nível de usuário.')
        return
      }

      alert('Login realizado com sucesso!')
      window.location.href = './administrative_panel.html'
    } else {
      alert(data.error || 'Erro ao fazer login')
    }
  } catch (error) {
    console.error('Erro na requisição:', error)
    alert('Erro de rede. Verifique sua conexão.')
  }
}

function togglePassword() {
  const passwordField = document.getElementById('password')
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password'
}
