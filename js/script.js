//menu
function menuShow() {
  let menuMobile = document.querySelector('.mobile-menu')
  if (menuMobile.classList.contains('open')) {
    menuMobile.classList.remove('open')
    document.querySelector('.icon').src = './assets/hamburguer.svg'
  } else {
    menuMobile.classList.add('open')
    document.querySelector('.icon').src = './assets/x.svg'
  }
}

function closeMenu() {
  let menuMobile = document.querySelector('.mobile-menu')
  if (menuMobile.classList.contains('open')) {
    menuMobile.classList.remove('open')
    document.querySelector('.icon').src = './assets/hamburguer.svg'
  }
}

document.querySelectorAll('.mobile-menu a').forEach((item) => {
  item.addEventListener('click', closeMenu)
})

//slide
const images = document.querySelectorAll('.carousel-images img')
let currentIndex = 0

function showNextImage() {
  images[currentIndex].classList.remove('active')
  currentIndex = (currentIndex + 1) % images.length
  images[currentIndex].classList.add('active')
}

setInterval(showNextImage, 3000)

//animation AOS
AOS.init({
  duration: 700,
  once: true,
})

//mensagem whatsapp
function sendToWhatsApp() {
  let name = document.getElementById('name').value
  let email = document.getElementById('email').value
  let message = document.getElementById('message').value
  let phoneNumber = '5588998378542'
  let text = `Olá, meu nome é ${name}, meu e-mail é ${email}. ${message}`
  let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    text
  )}`

  document.getElementById('name').value = ''
  document.getElementById('email').value = ''
  document.getElementById('message').value = ''
  window.open(whatsappURL, '_blank')

  return false
}