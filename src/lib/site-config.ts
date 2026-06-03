// Edite aqui os dados de contato e identidade do profissional.
export const siteConfig = {
  name: "AquaTherm Instalações",
  tagline: "Instalações & Manutenção Hidráulica",
  professional: "Seu Nome",
  // Telefone no formato internacional, somente números (DDI + DDD + número)
  whatsapp: "5511999999999",
  phoneDisplay: "(11) 99999-9999",
  email: "contato@aquatherm.com.br",
  city: "São Paulo e Região",
  whatsappMessage: "Olá! Vim pelo site e gostaria de um orçamento.",
};

export const whatsappLink = (message = siteConfig.whatsappMessage) =>
  `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
