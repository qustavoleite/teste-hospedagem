document.addEventListener('DOMContentLoaded', async () => {
  const microchip = localStorage.getItem('microchip')
  const redirectionFlag = localStorage.getItem('redirection_flag')

  console.log('Microchip recebido:', microchip)

  if (microchip) {
    try {
      const response = await fetch('/api/pets/microchip/:microchip')
      console.log('Status da resposta:', response.status)

      if (response.ok) {
        const pet = await response.json()
        console.log('Dados do pet:', pet)

        if (pet && pet.length > 0) {
          const petData = pet[0]

          document.getElementById('resultId').innerText =
            petData.ID || 'Não disponível'
          document.getElementById('resultNome').innerText =
            petData.nome || 'Não disponível'
          document.getElementById('resultSexo').innerText =
            petData.sexo || 'Não disponível'
          document.getElementById('resultAnimal').innerText =
            petData.animal === 0 ? 'Cachorro' : 'Gato'
          document.getElementById('resultMicrochip').innerText =
            petData.microchip || 'Não disponível'
          document.getElementById('resultResponsavel').innerText =
            petData.cliente_cpf || 'Não disponível'

          localStorage.removeItem('redirection_flag')
        } else {
          console.log(
            'Pet não encontrado. Redirecionando para pet_not_found.html.'
          )

          if (!redirectionFlag) {
            localStorage.setItem('redirection_flag', 'pet_not_found')
            window.location.href = './pet_not_found.html'
          }
        }
      } else {
        console.log('Resposta não OK. Redirecionando para pet_not_found.html.')

        if (!redirectionFlag) {
          localStorage.setItem('redirection_flag', 'pet_not_found')
          window.location.href = './pet_not_found.html'
        }
      }
    } catch (error) {
      console.error('Erro ao buscar animal:', error)

      if (!redirectionFlag) {
        localStorage.setItem('redirection_flag', 'pet_not_found')
        window.location.href = './pet_not_found.html'
      }
    }
  } else {
    console.log(
      'Nenhum microchip encontrado. Redirecionando para find_pet.html.'
    )

    if (!redirectionFlag) {
      localStorage.setItem('redirection_flag', 'find_pet')
      window.location.href = './find_pet.html'
    }
  }
})