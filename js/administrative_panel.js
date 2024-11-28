function verificarNivelAcesso() {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Token não encontrado. Faça login novamente.')
    window.location.href = '../login.html'
    return
  }

  try {
    const decodedToken = jwt_decode(token)
    const tipo = decodedToken.data.nivel

    if (tipo === 1 || tipo === '1') {
      document.querySelector('a[href="./create_adm.html"]').style.display =
        'none'
      document.querySelector('a[href="./tutor_registre.html"]').style.display =
        'none'
      document.querySelector('a[href="./pet_registre.html"]').style.display =
        'none'

      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.disabled = true
        btn.classList.add('disabled')
      })
    }
  } catch (error) {
    console.error('Erro ao decodificar o token:', error)
    alert('Erro ao validar token. Faça login novamente.')
    window.location.href = './login.html'
  }
}

async function buscarPets() {
  try {
    const response = await fetch('http://apiconectapet.42web.io/pets') 
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Dados recebidos da API:', data)

    const headers = [
      'ID',
      'Nome',
      'Sexo',
      'Microchip',
      'Raça',
      'Animal',
      'Responsável',
      'Ações',
    ]

    const rows = data.map((pet) => {
      const animalString =
        pet.animal === 0 || pet.animal === '0' ? 'Cachorro' : 'Gato'

      const petId = pet.ID || pet.id || '—'

      console.log(`ID processado: ${petId}`)

      return [
        petId,
        pet.nome,
        pet.sexo,
        pet.microchip,
        pet.raca,
        animalString,
        formatCPF(pet.cliente_cpf),
      ]
    })

    createTable(headers, rows)
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function createTable(headers, rows) {
  const tableContainer = document.getElementById('table-container')
  tableContainer.innerHTML = ''
  const table = document.createElement('table')
  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')

  const headerRow = document.createElement('tr')
  headers.forEach((header) => {
    const th = document.createElement('th')
    th.textContent = header
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)

  rows.forEach((rowData) => {
    const row = document.createElement('tr')
    rowData.forEach((cellData, index) => {
      const td = document.createElement('td')
      td.textContent = cellData !== undefined ? cellData : '—'
      row.appendChild(td)
    })

    const actionTd = document.createElement('td')

    const token = localStorage.getItem('token')
    let nivelUsuario = '1'
    if (token) {
      try {
        const decodedToken = jwt_decode(token)
        nivelUsuario = decodedToken.data.nivel
      } catch (error) {
        console.error('Erro ao decodificar o token:', error)
      }
    }

    if (nivelUsuario === 2 || nivelUsuario === '2') {
      actionTd.innerHTML = `
        <button class="action-btn delete-btn" data-id="${rowData[0]}">
          <i class="ph-fill ph-trash"></i>
        </button>
        <button class="action-btn edit-btn" data-id="${rowData[0]}">
          <i class="ph-fill ph-pencil-simple"></i>
        </button>
      `
    } else {
      actionTd.textContent = 'Sem permissões'
    }

    row.appendChild(actionTd)
    tbody.appendChild(row)

    const deleteButton = actionTd.querySelector('.delete-btn')
    if (deleteButton) {
      deleteButton.addEventListener('click', (event) => {
        const button = event.target.closest('.delete-btn')
        const id = button.getAttribute('data-id')
        deletarPet(id, row)
      })
    }

    const editButton = actionTd.querySelector('.edit-btn')
    if (editButton) {
      editButton.addEventListener('click', (event) => {
        const button = event.target.closest('.edit-btn')
        const id = button.getAttribute('data-id')
        abrirModalEdicao(id, rowData)
      })
    }
  })

  table.appendChild(thead)
  table.appendChild(tbody)
  tableContainer.appendChild(table)
}

async function deletarPet(id, rowElement) {
  const confirmacao = confirm('Tem certeza de que deseja deletar este pet?')
  if (!confirmacao) return

  try {
    const response = await fetch(`http://apiconectapet.42web.io/pets/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao deletar pet')
    }

    alert('Pet deletado com sucesso!')
    rowElement.remove()
  } catch (error) {
    console.error('Erro ao deletar o pet:', error.message)
    alert('Não foi possível deletar o pet. Tente novamente.')
  }
}

function abrirModalEdicao(id, rowData) {
  const modal = document.createElement('div')
  modal.classList.add('modalEdit')
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Editar dados do animal</h2>
      <form id="edit-form">
        <label>Nome: <input type="text" id="edit-nome" value="${
          rowData[1]
        }" /></label>
        <label>Sexo: 
          <select id="edit-sexo">
            <option value="M" ${
              rowData[2] === 'M' ? 'selected' : ''
            }>Macho</option>
            <option value="F" ${
              rowData[2] === 'F' ? 'selected' : ''
            }>Fêmea</option>
          </select>
        </label>
        <label>Microchip: <input type="text" id="edit-microchip" value="${
          rowData[3]
        }" /></label>
        <label>Raça: <input type="text" id="edit-raca" value="${
          rowData[4]
        }" /></label>
        <label>Animal: 
          <select id="edit-animal">
            <option value="0" ${
              rowData[5] === 'Cachorro' ? 'selected' : ''
            }>Cachorro</option>
            <option value="1" ${
              rowData[5] === 'Gato' ? 'selected' : ''
            }>Gato</option>
          </select>
        </label>
        <div class="group-button">
          <button type="submit" class="btn-primary">Salvar</button>
          <button type="button" class="btn-secondary" id="cancel-edit">Cancelar</button>
        </div>
      </form>
    </div>
  `
  document.body.appendChild(modal)

  const editForm = document.getElementById('edit-form')
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const updatedData = {
      nome: document.getElementById('edit-nome').value,
      sexo: document.getElementById('edit-sexo').value,
      microchip: document.getElementById('edit-microchip').value,
      raca: document.getElementById('edit-raca').value,
      animal: document.getElementById('edit-animal').value,
    }

    try {
      const response = await fetch(`http://apiconectapet.42web.io/pets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar pet')
      }

      alert('Pet atualizado com sucesso!')
      modal.remove()
      buscarPets()
    } catch (error) {
      console.error('Erro ao atualizar o pet:', error.message)
      alert('Não foi possível atualizar o pet. Tente novamente.')
    }
  })

  document.getElementById('cancel-edit').addEventListener('click', () => {
    modal.remove()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  verificarNivelAcesso()
  buscarPets()
})

function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const logoutBtn = document.querySelector('.ph-sign-out')
const logoutModal = document.getElementById('logoutModal')
const confirmLogout = document.getElementById('confirmLogout')
const cancelLogout = document.getElementById('cancelLogout')

logoutBtn.addEventListener('click', () => {
  logoutModal.classList.remove('hidden')
})

confirmLogout.addEventListener('click', () => {
  localStorage.removeItem('authToken')
  window.location.href = '../views/login.html'
})

cancelLogout.addEventListener('click', () => {
  logoutModal.classList.add('hidden')
})