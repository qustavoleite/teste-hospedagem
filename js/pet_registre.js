document.getElementById('petForm').addEventListener('submit', async (event) => {
  event.preventDefault()

  const tipoAnimal = {
    Cachorro: 0,
    Gato: 1,
  }

  const petData = {
    nome: document.getElementById('nome').value,
    raca: document.getElementById('raca').value,
    sexo: document.querySelector('input[name="sexo"]:checked').value,
    animal:
      tipoAnimal[document.querySelector('input[name="animal"]:checked').value], 
    microchip: document.getElementById('microchip').value,
    cliente_cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
  }

  console.log('Dados do pet:', petData)

  try {
    const response = await fetch('http://apiconectapet.42web.io/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData),
    })

    const data = await response.json()

    if (response.ok) {
      alert('Pet registrado com sucesso!')
      window.location.href = 'administrative_panel.html'
    } else {
      console.error('Erro do backend:', data.error)
      alert(`Erro ao registrar pet: ${data.error}`)
    }
  } catch (error) {
    console.error('Erro ao registrar pet:', error)
    alert('Erro ao registrar pet.')
  }
})

function formatCPF(cpfField) {
  let cpf = cpfField.value.replace(/\D/g, '')
  cpf = cpf.slice(0, 11)
  cpfField.value = cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}