import imgProfile from '../../assets/Perfil.jpeg';
import imgPortoesDoCeu from '../../assets/PortoesDoCeu.jpeg';
import imgPortfolio from '../../assets/Boot.jpeg';
import imgOpm from '../../assets/OPM.png';

export const pt = {
  terminal: {
    role: 'Estudante de Engenharia de Software',
    university: 'PUC Minas',
    typeMessage: 'digite',
    typeCommand: 'help',
    toSeeCommands: 'para ver os comandos',
    openingSection: 'Abrindo seção: {{title}}',
    closingSection: 'Fechando seção atual.',
    clearingHistory: 'Limpando histórico.',
    availableCommands: 'Comandos disponíveis: {{commands}}',
    commandNotFound: 'Comando não encontrado: "{{command}}"',
  },
  window: {
    back: 'Voltar',
    close: 'Fechar',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    restore: 'Restaurar',
    pageNotFound: 'Página não encontrada.',
    closeHint: 'digite <1>{{command}}</1> para fechar'
  },
  about: {
    sections: {
      education: 'Educação',
      interests: 'Interesses',
      goals: 'Metas'
    },
    profilePicture: imgProfile,
    overviewTitle: 'Leonardo Federici Pettersen',
    overviewParagraph: 'Estudante de Engenharia de Software na PUC Minas, começando na jornada da tecnologia e desenvolvimento de software. Apaixonado por tecnologia, programação e inovação.',
    education: {
      title: 'Engenharia de Software',
      period: 'Jan 2026 - Dez 2029',
      college: 'PUC Minas',
      description: 'O curso aborda conteúdos como programação de computadores, linguagens de programação, estatística, lógica matemática aplicada a especificações de software, aspectos técnicos da engenharia de software como análise, modelagem, projeto, construção e teste de software, aspectos gerenciais da engenharia de software como gerência de projetos de software, gerência de configuração e evolução de software, garantia da qualidade dos processos de software, gestão da produção de software. Contempla também os aspectos relacionados ao trabalho em equipe, gestão de pessoas, comunicação com os diversos stakeholders envolvidos em um projeto e interação humano-computador. Aborda ainda as recentes tecnologias necessárias à construção de software como bancos de dados, redes de computadores, sistemas operacionais, sistemas distribuídos, segurança e tecnologias de dispositivos móveis e em nuvem.',
      tags: ['Arquitetura de Software', 'Cloud e Mobile', 'Construção e Testes', 'Gestão de Projetos', 'Qualidade de Software']
    },
    interestsDescription: 'Além do interesse por tecnologia e desenvolvimento de software, sou apaixonado por futebol e esportes em geral, cruzeirense fanático! Acompanho o futebol brasileiro e internacional, também gosto de natação, basquete e futebol americano.',
    interestsTags: ['Esportes', 'Futebol', 'Inovação', 'Programação', 'Tecnologia'],
    goals: [
      {
        title: 'Participar de um WeMakeSoftware',
        description: 'Participar de um WeMakeSoftware juntamente com o meu grupo, para ter a experiência de apresentar um projeto de software para uma banca de avaliadores, e receber feedbacks sobre o projeto.'
      },
      {
        title: 'Contribuir para projetos open-source',
        description: 'Contribuir para projetos open-source, seja com código, documentação ou testes, para aprender com a comunidade e ajudar a melhorar softwares utilizados por muitas pessoas, já que sou um ávido usuário deles.'
      },
      {
        title: 'Estabelecer uma carreira sólida em desenvolvimento de software',
        description: 'Me tornar um desenvolvedor de software altamente qualificado, contribuindo para projetos inovadores e impactantes.'
      }
    ]
  },
  workModels: {
    onsite: 'Presencial',
    hybrid: 'Híbrido',
    remote: 'Remoto',
  },
  experiences: [
    {
      organization: 'dti digital',
      period: 'Out 2026 - Atual',
      experiencePosition: 'Estágio em Desenvolvimento de Software',
      workModel: 'hybrid',
      description: 'Atuo como estagiário em desenvolvimento de sistemas na Enterprise Aurora, em um time que segue metodologias ágeis. Trabalho no desenvolvimento de soluções de software com C# no back-end e React com TypeScript no front-end, participando das atividades do time e contribuindo com a evolução dos produtos.',
      skills: ['C#', '.NET', 'React', 'TypeScript']
    },
    {
      organization: 'PUC Minas',
      period: 'Ago 2026 - Atual',
      experiencePosition: 'Monitor de Introdução a Algoritmos',
      workModel: 'onsite',
      description: 'Atuo na monitoria da disciplina, com o objetivo de mitigar as dificuldades individuais e o histórico de retenção da matéria.',
      skills: ['Docência', 'Liderança', 'Python']
    }
  ],
  projectUI: {
    imageComingSoon: 'Imagem em breve'
  },
  projects: [
    {
      name: 'Sistema Hospitalar - Portões do Céu',
      date: 'Dez 2026',
      description: 'Sistema web de gestão hospitalar desenvolvido em Java com Spring Boot, utilizando API REST e banco de dados relacional para o gerenciamento de pacientes, profissionais, consultas e internações. A aplicação organiza processos essenciais, como agendamento, controle de quartos e histórico médico.',
      technologies: ['Java', 'SpringBoot', 'Thymeleaf', 'MySQL'],
      repoLink: 'https://github.com/leopettersen/TP-sistema-hospitalar',
      image: imgPortoesDoCeu, 
    },
    {
      name: 'Portfólio Profissional',
      date: 'Out 2026',
      description: 'O sistema apresenta minha trajetória, projetos, experiências e formas de contato em uma interface inspirada em um desktop com terminal. A navegação pode ser feita por comandos ou pelos ícones da interface, com suporte a português e inglês, temas claro e escuro e adaptação para computadores e celulares. O objetivo é apresentar meu trabalho de forma rápida, clara e interativa, sem necessidade de cadastro ou login.',
      technologies: ['TypeScript', 'React', 'Supabase', 'Docker'],
      repoLink: 'https://github.com/leopettersen/portifolio',
      image: imgPortfolio,
    },
    {
      name: 'Opera Máquinas (OPM)',
      date: 'Jul 2026',
      description: 'Interface web voltada para a otimização e gestão da produção em ambientes industriais, centralizando ferramentas essenciais para a rotina operacional. O sistema busca organizar processos críticos, como o controle de login e cadastro de usuários por função.',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      repoLink: 'https://github.com/leopettersen/trabalho-intedisciplinar1-opm',
      image: imgOpm, 
    }
  ],
  contact: {
    title: 'Enviar mensagem',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome',
    emailLabel: 'E-mail',
    emailPlaceholder: 'seu@email.com',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Digite sua mensagem...',
    sendButton: 'Enviar mensagem',
    sendingButton: 'Enviando...',
    successMsg: 'Mensagem enviada! Obrigado pelo contato.',
    errorMsg: 'Não foi possível enviar. Tente novamente ou use um dos contatos acima.',
    errors: {
      nameRequired: 'Informe seu nome.',
      emailRequired: 'Informe seu e-mail.',
      emailInvalid: 'E-mail inválido.',
      messageRequired: 'Informe sua mensagem.',
      messageMinLength: 'A mensagem deve ter pelo menos 10 caracteres.'
    }
  },
  guestbook: {
    loading: 'Carregando...',
    loadingMore: 'Carregando...',
    error: 'Não foi possível carregar as mensagens.',
    empty: 'Seja o primeiro a deixar uma mensagem!',
    loadMore: 'Carregar mais',

    form: {
        title: 'Deixe uma mensagem',
        name: 'Nome',
        namePlaceholder: 'Seu nome',
        nameError: 'Informe seu nome.',
        message: 'Mensagem',
        messagePlaceholder: 'Escreva uma mensagem...',
        messageError: 'Informe sua mensagem.',
        privacy: 'Sua mensagem ficará pública.',
        submit: 'Enviar mensagem',
        sending: 'Enviando...',
        success: 'Mensagem enviada! Obrigado pelo contato.',
        error: 'Não foi possível enviar. Tente novamente.',
        wait: 'Aguarde alguns segundos antes de enviar outra mensagem.',
    },
  },
  agent: {
    title: 'Pergunte para o Leonardo',
    status: 'respostas geradas pelo Gemini',
    typing: 'digitando...',
    reset: 'Nova conversa',
    welcome: 'Oi! Sou o Leonardo, estudante de Engenharia de Software na PUC Minas. Pergunte o que quiser sobre minha formação, experiências e projetos.',
    suggestions: [
        'Quais tecnologias você usa?',
        'Me conte sobre seus projetos',
        'Onde você trabalha hoje?',
        'Como entro em contato?',
    ],
    placeholder: 'Escreva sua pergunta...',
    inputLabel: 'Sua pergunta',
    send: 'Enviar',
    stop: 'Parar',
    stopped: 'Resposta interrompida.',
    disclaimer: 'A IA pode errar. As respostas se baseiam só nas informações deste portfólio.',
    errors: {
        missing_key: 'O agente ainda não foi configurado (falta a GEMINI_API_KEY).',
        invalid_key: 'A chave do Gemini é inválida.',
        model_not_found: 'O modelo do Gemini configurado não existe.',
        rate_limited: 'Muitas perguntas seguidas. Tente de novo em {{seconds}} s.',
        quota: 'A cota do Gemini acabou por agora. Tente mais tarde.',
        too_long: 'A pergunta pode ter até 1000 caracteres.',
        timeout: 'O Gemini demorou demais para responder.',
        network: 'Sem conexão com o servidor.',
        no_api: 'O agente não está disponível neste ambiente.',
        generic: 'Não foi possível falar com o Gemini agora. Tente novamente.',
    },
  },
  boot: {
    lines: [
        '[kernel] Inicializando sistema...',
        '[modules] Carregando módulos...',
        '[filesystem] Montando /home/guest...',
        '[network] Conectando ao guestbook...',
        '[session] Preparando ambiente...',
        '[ui] Carregando interface...',
        'Sistema pronto. Bem-vindo, guest.',
    ],
    skip: 'pressione qualquer tecla ou toque para pular',
  },
  landingInfo: {
    title: 'Olá, seja bem vindo ao meu portifólio!',
    info: 'O meu portifólio simula um Sistema Operacional. Você pode arrastar, maximizar, minimizar e fechar janelas, arrastar ícones na área de trabalho. No cabeçalho também é possível traduzir do português pro inglês.'
  },
  standard: {
    menu: {
      about: 'Sobre',
      experience: 'Experiência',
      projects: 'Projetos',
      stack: 'Stack',
      contact: 'Contato',
    },
    systemMode: 'Modo sistema',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    lightTheme: 'Ativar tema claro',
    darkTheme: 'Ativar tema escuro',
    footer: {
      text: 'Estudante de Engenharia de Software na PUC Minas, aberto a conversar sobre tecnologia, projetos e oportunidades.',
      copy: '© 2026 Leonardo Pettersen · Desenvolvido com React, Vite e Tailwind CSS.',
    },
  }
};