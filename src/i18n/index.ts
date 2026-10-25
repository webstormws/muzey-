import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  uz: {
    translation: {
      create_museum: "Muzey yaratish",
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      my_museums: "Mening muzeylarim",
      enter_museum: "Muzeyga kirish",
      share: "Do‘stlarga ulashish",
      logout: "Chiqish",
      step1: "1-qadam",
      step2: "2-qadam",
      step3: "3-qadam",
      museum_name: "Muzey nomi",
      description: "Qisqacha tavsif",
      upload_pics: "Rasmlarni yuklash",
      publish: "Muzeyni yaratish",
      success: "Muvaffaqiyatli yaratildi!",
      copy_link: "Havolani nusxalash",
      view_public: "Muzey sahifasi",
      enter_3d: "3D da kirish",
      controls_hint: "WASD / strelkalar, sichqon tortib aylantirish, g‘ildirak yaqinlashtirish"
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'uz',
  fallbackLng: 'uz',
  interpolation: { escapeValue: false }
})

export default i18n
