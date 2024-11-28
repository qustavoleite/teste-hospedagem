document
  .getElementById('adminForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Você precisa estar autenticado para realizar esta ação.')
      window.location.href = '/login.html'
      return
    }

    let nivelUsuario = 1
    try {
      const decodedToken = jwt_decode(token)
      nivelUsuario = decodedToken.data.nivel
    } catch (error) {
      console.error('Erro ao decodificar o token:', error)
      alert('Token inválido. Faça login novamente.')
      window.location.href = '/login.html'
      return
    }

    if (nivelUsuario !== '2') {
      alert('Você não tem permissão para criar novos administradores.')
      return
    }

    const nome = document.getElementById('nome').value.trim()
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '').trim()
    const email = document.getElementById('email').value.trim()
    const senha = document.getElementById('senha').value.trim()
    const tipo = document.querySelector(
      'input[name="adminType"]:checked'
    )?.value

    if (!nome || !cpf || !email || !senha || !tipo) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    const novoAdmin = { nome, cpf, email, senha, tipo: parseInt(tipo) }

    try {
      const response = await fetch('/api/admin/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoAdmin),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Novo administrador criado com sucesso!')
        window.location.href = 'administrative_panel.html'
      } else {
        alert(result.error || 'Erro ao criar o administrador.')
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error)
      alert('Erro ao conectar com o servidor.')
    }
  })

function togglePassword() {
  const passwordField = document.getElementById('senha')
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password'
}

function formatCPF(cpfField) {
  let cpf = cpfField.value.replace(/\D/g, '')
  cpf = cpf.slice(0, 11)
  cpfField.value = cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}