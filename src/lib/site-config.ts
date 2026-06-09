// Edite aqui os dados de contato e identidade do profissional.
export const siteConfig = {
  name: "AquaTherm Instalações",
  tagline: "Instalações & Manutenção Hidráulica",
  professional: "Seu Nome",
  // Telefone no formato internacional, somente números (DDI + DDD + número)
  whatsapp: "5514998629458",
  phoneDisplay: "(14) 99862-9458",
  email: "contato@aquatherm.com.br",
  city: "São Paulo e Região",
  whatsappMessage: "Olá! Vim pelo site e gostaria de um orçamento.",
};

export const whatsappLink = (message = siteConfig.whatsappMessage) =>
  `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
