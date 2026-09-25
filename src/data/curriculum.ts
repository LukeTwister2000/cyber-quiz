import { 
  QuizQuestion, 
  CliLab, 
  CtfMission, 
  SkillNode, 
  Achievement, 
  BossChallenge, 
  PeerStudent 
} from '../types';

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  // 1. NETWORKING
  {
    id: 'net-01',
    moduleId: 'networking',
    moduleTitle: 'Fundamentos de Redes',
    difficulty: 'beginner',
    question: 'Uma estação de trabalho consegue disparar ping para um servidor de banco de dados remoto diretamente pelo seu endereço IP (192.168.10.45), mas conexões para "db-internal.corp" falham com "Host not found". Qual serviço é a causa raiz da falha?',
    options: [
      { id: 'a', text: 'Domain Name System (DNS)' },
      { id: 'b', text: 'Dynamic Host Configuration Protocol (DHCP)' },
      { id: 'c', text: 'Network Address Translation (NAT)' },
      { id: 'd', text: 'Secure Shell (SSH)' },
    ],
    correctOptionId: 'a',
    explanation: 'A conectividade direta via IP confirma que as Camadas 1 a 4 (física, enlace de dados, roteamento IP e ICMP) estão operacionais. A impossibilidade de resolver o nome de domínio aponta especificamente para falha no DNS (Camada 7).',
    whyItMatters: 'Na triagem de incidentes corporativos, distinguir rapidamente entre conectividade de rede e resolução de nomes evita horas desperdiçadas em regras de firewall e identifica envenenamento de DNS ou indisponibilidade de resolvers.',
    xpReward: 120,
    srsBox: 1,
  },
  {
    id: 'net-02',
    moduleId: 'networking',
    moduleTitle: 'Fundamentos de Redes',
    difficulty: 'intermediate',
    question: 'Durante um handshake de três vias do TCP (Three-Way Handshake), o cliente envia um pacote SYN com SEQ=1000. Quais flags de controle e número de confirmação o servidor retornará no estabelecimento normal da conexão?',
    options: [
      { id: 'a', text: 'SYN-ACK com ACK=1001' },
      { id: 'b', text: 'ACK com ACK=1000' },
      { id: 'c', text: 'FIN-ACK com ACK=1001' },
      { id: 'd', text: 'RST com ACK=0' },
    ],
    correctOptionId: 'a',
    explanation: 'O servidor responde com as flags SYN e ACK habilitadas. O número ACK confirma o recebimento do SYN do cliente incrementando o número de sequência em 1 (1000 + 1 = 1001).',
    whyItMatters: 'Compreender a mecânica do handshake é essencial para detectar ataques DDoS por SYN Flood, varreduras de portas half-open (como Nmap -sS) e exaustão de tabelas de estado em firewalls.',
    xpReward: 150,
    srsBox: 1,
  },
  {
    id: 'net-03',
    moduleId: 'networking',
    moduleTitle: 'Fundamentos de Redes',
    difficulty: 'advanced',
    question: 'Um invasor na mesma sub-rede local transmite respostas ARP gratuitas mapeando o IP do gateway padrão (10.0.0.1) para seu próprio endereço MAC (00:0c:29:ab:cd:ef). Qual ataque está ocorrendo ativamente?',
    options: [
      { id: 'a', text: 'ARP Spoofing / Man-In-The-Middle (MITM)' },
      { id: 'b', text: 'BGP Route Hijacking' },
      { id: 'c', text: 'DNS Amplification' },
      { id: 'd', text: 'VLAN Hopping via DTP' },
    ],
    correctOptionId: 'a',
    explanation: 'Como o protocolo ARP não possui estado nem autenticação, os dispositivos armazenam em cache respostas não solicitadas. Quando as vítimas associam o IP do gateway ao MAC do atacante, todos os pacotes de saída são roteados através do invasor.',
    whyItMatters: 'O envenenamento de ARP possibilita sniffing passivo de tráfego e captura de credenciais em redes locais não segmentadas. Defesas como Dynamic ARP Inspection (DAI) e segurança de portas 802.1X mitigam essa vulnerabilidade.',
    xpReward: 180,
    srsBox: 1,
  },

  // 2. LINUX & PRIVILÉGIOS
  {
    id: 'lnx-01',
    moduleId: 'linux',
    moduleTitle: 'Segurança & Internals do Linux',
    difficulty: 'beginner',
    question: 'Um engenheiro de segurança descobre um arquivo com permissões "-rwsr-xr-x" cujo proprietário é o root. O que o caractere "s" nas permissões do usuário indica?',
    options: [
      { id: 'a', text: 'Flag SetUID (SUID): executa com os privilégios do proprietário do arquivo (root)' },
      { id: 'b', text: 'Sticky bit: apenas o root pode excluir ou renomear o arquivo' },
      { id: 'c', text: 'Flag de Link Simbólico: aponta para uma página de memória externa' },
      { id: 'd', text: 'Flag imutável do sistema: não pode ser alterado ou concatenado' },
    ],
    correctOptionId: 'a',
    explanation: 'O bit SetUID (numérico 4000) faz com que um binário executável rode com as permissões do dono do arquivo em vez do usuário que o invocou. Se o dono for o root, ele roda com privilégios de superusuário.',
    whyItMatters: 'Binários com SUID mal configurados ou desatualizados (como versões vulneráveis do pkexec ou utilitários customizados) são o principal vetor para escalação local de privilégios (LPE) em servidores Linux.',
    xpReward: 120,
    srsBox: 1,
  },
  {
    id: 'lnx-02',
    moduleId: 'linux',
    moduleTitle: 'Segurança & Internals do Linux',
    difficulty: 'intermediate',
    question: 'Qual arquivo de log em sistemas Debian/Ubuntu registra autenticações bem-sucedidas e falhas de login, invocações do comando sudo e tentativas de acesso via SSH?',
    options: [
      { id: 'a', text: '/var/log/auth.log' },
      { id: 'b', text: '/var/log/syslog' },
      { id: 'c', text: '/var/log/kern.log' },
      { id: 'd', text: '/var/log/dmesg' },
    ],
    correctOptionId: 'a',
    explanation: 'O /var/log/auth.log (ou /var/log/secure em distribuições Red Hat/CentOS/Fedora) é o log de auditoria dedicado para autenticação PAM, logins SSH e invocações sudo.',
    whyItMatters: 'Durante uma invasão ativa ou perícia pós-incidente, o auth.log é o primeiro artefato inspecionado para detectar ataques de força bruta, movimentação lateral e comprometimento de credenciais.',
    xpReward: 140,
    srsBox: 1,
  },

  // 3. SEGURANÇA WEB
  {
    id: 'web-01',
    moduleId: 'web_security',
    moduleTitle: 'Segurança de Aplicações Web',
    difficulty: 'intermediate',
    question: 'Uma aplicação web recebe um parâmetro de entrada e executa: "SELECT * FROM users WHERE email = \'" + userInput + "\'". Um invasor insere "\' OR \'1\'=\'1\' --". Qual vulnerabilidade está presente?',
    options: [
      { id: 'a', text: 'SQL Injection (SQLi)' },
      { id: 'b', text: 'Cross-Site Scripting (XSS)' },
      { id: 'c', text: 'Insecure Direct Object Reference (IDOR)' },
      { id: 'd', text: 'Server-Side Request Forgery (SSRF)' },
    ],
    correctOptionId: 'a',
    explanation: 'A concatenação de strings em consultas SQL dinâmicas permite que dados não confiáveis quebrem o contexto sintático e modifiquem a lógica da consulta. A condição \'1\'=\'1\' sempre retorna verdadeiro para todos os registros.',
    whyItMatters: 'O SQL Injection expõe a confidencialidade do banco de dados, permite alterações não autorizadas e pode possibilitar execução remota de comandos via extensões do banco de dados.',
    xpReward: 160,
    srsBox: 1,
  },
  {
    id: 'web-02',
    moduleId: 'web_security',
    moduleTitle: 'Segurança de Aplicações Web',
    difficulty: 'advanced',
    question: 'Qual cabeçalho HTTP de resposta previne com eficácia ataques de Clickjacking ao instruir o navegador se a renderização da página em <iframe> ou <frame> deve ser bloqueada?',
    options: [
      { id: 'a', text: 'X-Frame-Options: DENY (ou CSP frame-ancestors)' },
      { id: 'b', text: 'Strict-Transport-Security (HSTS)' },
      { id: 'c', text: 'X-Content-Type-Options: nosniff' },
      { id: 'd', text: 'Access-Control-Allow-Origin: *' },
    ],
    correctOptionId: 'a',
    explanation: 'O cabeçalho X-Frame-Options: DENY (e o moderno Content-Security-Policy: frame-ancestors \'none\') instrui o navegador a rejeitar a inclusão da página dentro de qualquer frame ou iframe embutido.',
    whyItMatters: 'O Clickjacking induz a vítima a clicar em botões invisíveis sobrepostos a sites legítimos, acionando transferências bancárias indesejadas ou concessões perigosas de permissão de conta.',
    xpReward: 170,
    srsBox: 1,
  },

  // 4. CRIPTOGRAFIA
  {
    id: 'crypto-01',
    moduleId: 'cryptography',
    moduleTitle: 'Criptografia & Proteção de Dados',
    difficulty: 'intermediate',
    question: 'Por que a adição de um Salt criptográfico antes de gerar o hash de senhas de usuários com bcrypt ou Argon2 é indispensável?',
    options: [
      { id: 'a', text: 'Invalida ataques pré-computados com Rainbow Tables e garante que senhas idênticas resultem em hashes distintos' },
      { id: 'b', text: 'Criptografa a senha com uma chave privada permitindo recuperá-la depois' },
      { id: 'c', text: 'Compacta a senha para reduzir o uso de armazenamento em disco no banco de dados' },
      { id: 'd', text: 'Acelera o tempo de processamento de login durante picos de tráfego' },
    ],
    correctOptionId: 'a',
    explanation: 'O Salt é uma sequência aleatória exclusiva adicionada à senha antes da computação do hash. Isso neutraliza Rainbow Tables e impede que invasores identifiquem senhas repetidas entre diferentes contas.',
    whyItMatters: 'Sem Salts, um invasor que obtenha o dump da base de dados de senhas consegue reverter instantaneamente milhões de credenciais comuns usando tabelas de consulta offline pré-calculadas.',
    xpReward: 150,
    srsBox: 1,
  },

  // 5. ARQUITETURA DEFENSIVA
  {
    id: 'def-01',
    moduleId: 'defensive',
    moduleTitle: 'Arquitetura Defensiva & Blue Team',
    difficulty: 'intermediate',
    question: 'Sob o modelo de arquitetura "Zero Trust", qual princípio fundamental substitui a confiança implícita baseada em perímetro de rede?',
    options: [
      { id: 'a', text: '"Nunca confiar, sempre verificar" com autenticação contínua, mútua e menor privilégio' },
      { id: 'b', text: 'Confiar em todos os dispositivos fisicamente conectados à rede interna corporativa' },
      { id: 'c', text: 'Desativar a autenticação de dois fatores para tráfego interno servidor a servidor' },
      { id: 'd', text: 'Depender exclusivamente da inspeção de pacotes no firewall de borda' },
    ],
    correctOptionId: 'a',
    explanation: 'O Zero Trust elimina a confiança implícita fundamentada em localização de rede. Toda requisição precisa ser autenticada de forma robusta, autorizada dinamicamente com base em contexto e criptografada ponta a ponta.',
    whyItMatters: 'Violações corporativas modernas frequentemente se originam de credenciais internas comprometidas por phishing; defesas de perímetro sozinhas não impedem a movimentação lateral de invasores.',
    xpReward: 160,
    srsBox: 1,
  },

  // 6. FORENSE DIGITAL
  {
    id: 'for-01',
    moduleId: 'forensics',
    moduleTitle: 'Forense Digital & Resposta a Incidentes',
    difficulty: 'intermediate',
    question: 'Na perícia forense digital, qual é a principal finalidade de calcular o hash criptográfico (ex: SHA-256) de uma imagem de disco imediatamente após sua aquisição?',
    options: [
      { id: 'a', text: 'Estabelecer e validar a cadeia de custódia, comprovando que a evidência não sofreu adulteração' },
      { id: 'b', text: 'Comprimir a imagem de disco para transferência mais rápida pela rede' },
      { id: 'c', text: 'Descriptografar automaticamente partições BitLocker' },
      { id: 'd', text: 'Escanear a imagem em busca de assinaturas conhecidas de antivírus' },
    ],
    correctOptionId: 'a',
    explanation: 'A integridade pericial baseia-se na comprovação de que as evidências permaneceram inalteradas. A correspondência de hashes entre a cópia inicial e as análises subsequentes atesta a fidelidade probatória em juízo.',
    whyItMatters: 'Sem a verificação formal de hashes criptográficos, evidências digitais podem ser impugnadas e descartadas como inadmissíveis em processos jurídicos e auditorias regulatórias.',
    xpReward: 150,
    srsBox: 1,
  },

  // 7. SCRIPTING & PYTHON
  {
    id: 'prog-01',
    moduleId: 'programming',
    moduleTitle: 'Scripting de Segurança & Python',
    difficulty: 'beginner',
    question: 'Em Python, qual módulo da biblioteca padrão é utilizado para abrir conexões diretas via sockets TCP para varredura de portas e captura de banners?',
    options: [
      { id: 'a', text: 'socket' },
      { id: 'b', text: 'math' },
      { id: 'c', text: 'tkinter' },
      { id: 'd', text: 'csv' },
    ],
    correctOptionId: 'a',
    explanation: 'O módulo `socket` provê acesso direto à interface BSD Socket, permitindo criar endpoints de rede, conectar em portas remotas e trocar fluxos de bytes brutos.',
    whyItMatters: 'Scripts customizados em Python usando sockets puros capacitam analistas a construir probes de protocolos, verificadores de conectividade e testes automatizados sem dependências externas.',
    xpReward: 130,
    srsBox: 1,
  },

  // 8. OSINT
  {
    id: 'osint-01',
    moduleId: 'osint',
    moduleTitle: 'OSINT & Reconhecimento',
    difficulty: 'beginner',
    question: 'Qual sistema de registro publicamente auditável cataloga a emissão de todos os certificados SSL/TLS por autoridades certificadoras, atuando como excelente fonte para enumeração de subdomínios?',
    options: [
      { id: 'a', text: 'Logs de Certificate Transparency (CT)' },
      { id: 'b', text: 'Base de dados de registro WHOIS' },
      { id: 'c', text: 'Cache de validação DNSSEC' },
      { id: 'd', text: 'Tabela de roteamento BGP RIB' },
    ],
    correctOptionId: 'a',
    explanation: 'Certificate Transparency (CT) é um ecossistema aberto para monitoramento de certificados TLS. Motores de busca como crt.sh expõem todos os subdomínios registrados que requisitaram certificados HTTPS.',
    whyItMatters: 'Tanto analistas defensivos quanto invasores consultam logs de CT para identificar novos subdomínios de homologação, APIs e servidores internos logo após a emissão de novos certificados.',
    xpReward: 140,
    srsBox: 1,
  }
];

export const INITIAL_LABS: CliLab[] = [
  {
    id: 'lab-first-access',
    moduleId: 'linux',
    title: 'PRIMEIRO ACESSO / BATISMO DE TERMINAL',
    objective: 'Explore a árvore de diretórios do ambiente sandbox, inspecione os arquivos e descubra sua primeira chave de autorização (flag).',
    initialDirectory: '/home/student',
    targetFlag: 'CYBER{first_access_granted}',
    xpReward: 100,
    hint: 'Use "ls" para listar arquivos e "cat welcome.txt" para ler o documento de orientação operacional.',
    directories: ['/home/student', '/home/student/projects', '/home/student/logs'],
    files: {
      '/home/student/welcome.txt': 'Bem-vindo ao Sandbox de Terminal do CYBERQUIZ.\n\nSeu primeiro objetivo é simples: leia as anotações operacionais para recuperar sua chave inicial de autorização.\n\nFLAG: CYBER{first_access_granted}',
      '/home/student/notes.txt': 'BRIEFING OPERACIONAL: Sempre inspecione permissões de arquivos usando `ls -la`. Mantenha documentação rigorosa de todos os artefatos de rede.',
      '/home/student/projects/scanner.py': '#!/usr/bin/env python3\n# Script de amostragem de portas do Cyberquiz\nimport socket\ndef check_port(host, port):\n    s = socket.socket()\n    s.settimeout(1)\n    return s.connect_ex((host, port)) == 0\nprint("[+] Probe inicializado.")\n',
      '/home/student/logs/auth.log': 'Sep 23 14:02:11 lab-node sshd[4190]: Accepted publickey for student from 10.0.4.12 port 54882 ssh2\nSep 23 14:05:00 lab-node sudo: student : TTY=pts/0 ; COMMAND=/usr/bin/id\n',
    },
  },
  {
    id: 'lab-net-recon',
    moduleId: 'networking',
    title: 'LAB 02 / RECONHECIMENTO DE REDE & FILTRAGEM DE LOGS',
    objective: 'Inspecione o log de tráfego de pacotes em /var/log/traffic.log usando grep para isolar o IP de uma exfiltração não autorizada e recuperar a flag.',
    initialDirectory: '/home/student',
    targetFlag: 'CYBER{p4ck3t_fl0w_4n4lyz3d}',
    xpReward: 150,
    hint: 'Tente executar: grep "EXFIL" /var/log/traffic.log ou inspecione o arquivo diretamente.',
    directories: ['/home/student', '/var/log'],
    files: {
      '/var/log/traffic.log': '10.0.0.5 -> 10.0.0.1 DNS Q A internal.corp\n10.0.0.5 -> 172.16.88.9 HTTP GET /api/v1/status\n10.0.0.12 -> 198.51.100.42 TCP SYN [EXFIL DETECTED] Flag: CYBER{p4ck3t_fl0w_4n4lyz3d}\n10.0.0.2 -> 10.0.0.1 NTP request\n',
      '/home/student/mission.txt': 'MISSÃO: Uma estação comprometida transmitiu telemetria sensível para um destino externo não autorizado. Rastreie o arquivo traffic.log em /var/log/ para localizar a flag.',
    },
  },
  {
    id: 'lab-suid-priv',
    moduleId: 'linux',
    title: 'LAB 03 / DESCOBERTA DE ESCALAÇÃO DE PRIVILÉGIOS',
    objective: 'Localize binários com permissões anômalas em /usr/local/bin para descobrir a flag administrativa oculta.',
    initialDirectory: '/home/student',
    targetFlag: 'CYBER{r00t_pr1v1l3g3_unl0ck3d}',
    xpReward: 180,
    hint: 'Navegue até /usr/local/bin e inspecione security_check.sh usando o comando cat.',
    directories: ['/home/student', '/usr/local/bin'],
    files: {
      '/usr/local/bin/security_check.sh': '#!/bin/bash\n# Utilitário de Diagnóstico v2.1\n# Auditoria de permissões SUID\necho "[*] Executando verificação diagnóstica..."\n# SYSTEM_FLAG="CYBER{r00t_pr1v1l3g3_unl0ck3d}"\necho "[+] Verificação concluída."\n',
      '/home/student/instructions.txt': 'Inspecione os binários administrativos customizados instalados sob /usr/local/bin para identificar variáveis sensíveis embutidas no código.',
    },
  }
];

export const INITIAL_CTFS: CtfMission[] = [
  {
    id: 'ctf-black-ice',
    codeName: 'OPERAÇÃO: BLACK ICE',
    title: 'Intrusão Não Autorizada & Análise de Pivot via SSH',
    category: 'forensics',
    difficulty: 'Medium',
    briefing: 'Às 03:14 UTC, nosso IDS de perímetro disparou alertas de anomalias de autenticação direcionadas ao servidor bastion. Investigadores forenses coletaram os logs de rede, autenticação e sistema operacional. Sua missão: rastrear o IP do invasor, determinar como ele contornou a autenticação e recuperar a flag de exfiltração.',
    timeLimitMinutes: 30,
    solved: false,
    hints: [
      'Examine o arquivo auth.log procurando por tentativas com falha seguidas por um login aceito.',
      'Verifique o system.log para identificar comandos executados via cron ou sudo após a invasão.',
      'Procure pela string de beacon codificada presente no network.log.'
    ],
    flag: 'CYBER{ssh_brut3_f0rc3_id3nt1f13d}',
    xpReward: 350,
    evidenceFiles: [
      {
        name: 'auth.log',
        description: 'Logs de auditoria do subsistema de autenticação do servidor bastion.',
        content: `Sep 23 03:12:01 bastion sshd[2201]: Failed password for invalid user admin from 198.51.100.77 port 48112 ssh2
Sep 23 03:12:04 bastion sshd[2205]: Failed password for invalid user admin from 198.51.100.77 port 48116 ssh2
Sep 23 03:12:09 bastion sshd[2210]: Failed password for invalid user root from 198.51.100.77 port 48120 ssh2
Sep 23 03:14:22 bastion sshd[2245]: Accepted password for deploy from 198.51.100.77 port 48202 ssh2
Sep 23 03:14:23 bastion systemd-logind[910]: New session 14 of user deploy.
Sep 23 03:15:10 bastion sudo: deploy : TTY=pts/1 ; PWD=/home/deploy ; USER=root ; COMMAND=/bin/bash`,
      },
      {
        name: 'network.log',
        description: 'Telemetria de fluxo de pacotes capturada na porta do switch interno.',
        content: `03:14:22 198.51.100.77:48202 -> 10.0.1.10:22 [TCP ESTABLISHED]
03:16:05 10.0.1.10:55120 -> 203.0.113.8:443 [HTTPS OUTBOUND]
03:16:40 10.0.1.10:33410 -> 203.0.113.8:8080 Payload: FLAG=CYBER{ssh_brut3_f0rc3_id3nt1f13d}`,
      },
      {
        name: 'system.log',
        description: 'Eventos de kernel e daemons extraídos de /var/log/syslog.',
        content: `Sep 23 03:14:23 bastion kernel: [14201.120] audit: type=1006 audit(1695438863.120:88): pid=2245 uid=1001 auid=1001 ses=14
Sep 23 03:15:40 bastion cron[801]: (CRON) STARTUP (fork ok)
Sep 23 03:17:00 bastion kernel: [14358.890] Conexão de saída confirmada para ASN externo 64496.`,
      }
    ],
    solutionDebrief: 'O invasor realizou um ataque de credential stuffing a partir do IP 198.51.100.77, comprometendo a conta "deploy" com senha fraca. Em seguida, escalou privilégios via sudo e transmitiu um beacon HTTP para 203.0.113.8:8080 com a flag.',
  },
  {
    id: 'ctf-shadow-cipher',
    codeName: 'OPERAÇÃO: SHADOW CIPHER',
    title: 'Exfiltração de Dados Sobre Canais Ocultos de DNS',
    category: 'cryptography',
    difficulty: 'Hard',
    briefing: 'Analistas de SOC interceptaram um volume anormal de consultas DNS de alta frequência direcionadas a um resolver externo não homologado. Os prefixos das requisições contêm sequências hexadecimais codificadas. Reconstrua a carga útil exfiltrada para recuperar a flag.',
    timeLimitMinutes: 45,
    solved: false,
    hints: [
      'Inspecione os subdomínios requisitados nos registros de consulta DNS.',
      'Observe que os rótulos de consulta formam pares hexadecimais: 43 59 42 45 52 ...',
      'Converta a sequência hexadecimal ASCII concatenada em texto plano legível.'
    ],
    flag: 'CYBER{dns_tunn3l_c0v3rt_d3t3ct3d}',
    xpReward: 450,
    evidenceFiles: [
      {
        name: 'dns_capture.pcap.log',
        description: 'Sequência de consultas DNS extraída da captura Wireshark.',
        content: `QUERY 1: 4359424552.tunnel.c2-server.net (Type TXT) -> Answer: OK
QUERY 2: 7b646e735f.tunnel.c2-server.net (Type TXT) -> Answer: OK
QUERY 3: 74756e6e33.tunnel.c2-server.net (Type TXT) -> Answer: OK
QUERY 4: 6c5f633076.tunnel.c2-server.net (Type TXT) -> Answer: OK
QUERY 5: 3372745f64.tunnel.c2-server.net (Type TXT) -> Answer: OK
QUERY 6: 3374336374.tunnel.c2-server.net (Type TXT) -> Answer: OK
QUERY 7: 33647d.tunnel.c2-server.net (Type TXT) -> Answer: COMPLETE
[HEX ASSEMBLED]: 43594245527b646e735f74756e6e336c5f6330763372745f64337433637433647d`,
      },
      {
        name: 'incident_notes.txt',
        description: 'Anotações periciais do time de resposta.',
        content: `As regras de firewall perimetral permitiam saída UDP na porta 53 para qualquer destino da internet.
O invasor explorou DNS Tunneling (similar ao dnscat2 / iodine) para exfiltrar dados sem acionar a inspeção HTTP.`,
      }
    ],
    solutionDebrief: 'A string hexadecimal 43594245527b... decodifica diretamente para CYBER{dns_tunn3l_c0v3rt_d3t3ct3d}. A filtragem de saída deve restringir requisições DNS exclusivamente a resolvers recursivos internos autorizados.',
  }
];

export const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 'sk-net-1',
    title: 'Arquitetura TCP/IP',
    category: 'networking',
    tier: 1,
    description: 'Domine o modelo OSI de 7 Camadas, encapsulamento de pacotes e conversão NAT/PAT.',
    prerequisites: [],
    xpRequired: 0,
    unlocked: true,
    mastered: true,
    relatedLabId: 'lab-net-recon',
  },
  {
    id: 'sk-lnx-1',
    title: 'Sistemas Linux & POSIX',
    category: 'linux',
    tier: 1,
    description: 'Fluência em linha de comando, máscara de permissões, avaliação de SUID e auditoria de logs.',
    prerequisites: [],
    xpRequired: 0,
    unlocked: true,
    mastered: false,
    relatedLabId: 'lab-first-access',
  },
  {
    id: 'sk-net-2',
    title: 'Análise de Protocolos & Wireshark',
    category: 'networking',
    tier: 2,
    description: 'Inspecione streams pcap, detecte ARP Spoofing e isole payloads maliciosos em trânsito.',
    prerequisites: ['sk-net-1'],
    xpRequired: 200,
    unlocked: true,
    mastered: false,
  },
  {
    id: 'sk-web-1',
    title: 'Defesa Web OWASP Top 10',
    category: 'web_security',
    tier: 1,
    description: 'Compreenda injeção SQL, Cross-Site Scripting (XSS) e mecânica de tokens CSRF.',
    prerequisites: [],
    xpRequired: 150,
    unlocked: true,
    mastered: false,
  },
  {
    id: 'sk-cry-1',
    title: 'Primitivas Criptográficas',
    category: 'cryptography',
    tier: 1,
    description: 'Criptografia assimétrica vs simétrica, resistência a colisões e hashing com salt.',
    prerequisites: [],
    xpRequired: 150,
    unlocked: true,
    mastered: false,
  },
  {
    id: 'sk-for-1',
    title: 'Forense Digital & Triagem',
    category: 'forensics',
    tier: 2,
    description: 'Aquisição de dumps de memória volátil, reconstrução de linhas do tempo e validação de hashes.',
    prerequisites: ['sk-lnx-1'],
    xpRequired: 300,
    unlocked: false,
    mastered: false,
  },
  {
    id: 'sk-def-1',
    title: 'SIEM & Detecção Blue Team',
    category: 'defensive',
    tier: 2,
    description: 'Correlação de eventos, criação de regras de IDS/IPS e modelagem de arquitetura Zero Trust.',
    prerequisites: ['sk-net-2'],
    xpRequired: 350,
    unlocked: false,
    mastered: false,
  },
  {
    id: 'sk-ctf-1',
    title: 'Tradecraft Operacional de CTF',
    category: 'ctf',
    tier: 3,
    description: 'Resposta simulada a incidentes em espectro completo e triagem tática de exploração.',
    prerequisites: ['sk-for-1', 'sk-def-1'],
    xpRequired: 500,
    unlocked: false,
    mastered: false,
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-access',
    title: 'Primeiro Acesso',
    description: 'Concluiu o onboarding inicial e recuperou sua primeira flag no terminal.',
    category: 'terminal',
    icon: 'Terminal',
    unlockedAt: null,
    xpBonus: 100,
    rarity: 'Common',
  },
  {
    id: 'ach-packet-whisperer',
    title: 'Analista de Pacotes',
    description: 'Respondeu corretamente a 3 questões de redes com 100% de precisão.',
    category: 'mastery',
    icon: 'Network',
    unlockedAt: null,
    xpBonus: 150,
    rarity: 'Rare',
  },
  {
    id: 'ach-streak-fire',
    title: 'Sentinela Persistente',
    description: 'Manteve uma sequência ativa de 7 dias consecutivos de treinamento.',
    category: 'streak',
    icon: 'Flame',
    unlockedAt: null,
    xpBonus: 200,
    rarity: 'Epic',
  },
  {
    id: 'ach-ctf-blackice',
    title: 'Operador Black Ice',
    description: 'Recuperou a flag exfiltrada na Operação: Black Ice dentro do tempo limite.',
    category: 'ctf',
    icon: 'ShieldAlert',
    unlockedAt: null,
    xpBonus: 250,
    rarity: 'Epic',
  },
  {
    id: 'ach-srs-master',
    title: 'Retenção Cognitiva',
    description: 'Revisou com êxito 5 cartões do sistema de repetição espaçada no cronograma.',
    category: 'mastery',
    icon: 'Brain',
    unlockedAt: null,
    xpBonus: 120,
    rarity: 'Common',
  },
  {
    id: 'ach-architect',
    title: 'Arquiteto de Segurança',
    description: 'Alcançou a patente de Sentinela Cibernético acumulando mais de 2.000 XP.',
    category: 'special',
    icon: 'Award',
    unlockedAt: null,
    xpBonus: 500,
    rarity: 'Legendary',
  }
];

export const INITIAL_BOSS: BossChallenge = {
  id: 'boss-net-01',
  moduleId: 'networking',
  title: 'INCIDENTE BOSS: INCIDENTE 402 — A INTERCEPTAÇÃO SILENCIOSA',
  incidentCode: 'INC-402-MITM',
  description: 'Colaboradores internos relatam avisos intermitentes de certificados inválidos ao acessar o portal corporativo de folha de pagamento. Como líder de resposta a incidentes, analise a captura de pacotes, identifique o ataque de rede ativo e aplique a regra exata de mitigação no switch de acesso.',
  packetSummary: [
    '09:44:12.102 ARP request who-has 10.0.0.1 tell 10.0.0.50',
    '09:44:12.103 ARP reply 10.0.0.1 is-at 00:50:56:c0:00:08 (Router MAC)',
    '09:44:14.550 ARP reply 10.0.0.1 is-at 00:0c:29:88:fe:12 (Rogue MAC - Workstation 10.0.0.88)',
    '09:44:14.551 ARP reply 10.0.0.50 is-at 00:0c:29:88:fe:12 (Rogue MAC - Workstation 10.0.0.88)',
    '09:44:16.200 SSL/TLS ClientHello internal-payroll.corp -> Intercepted with untrusted self-signed root cert',
  ],
  questions: [
    {
      question: 'Com base no trace de pacotes, qual ataque de Camada 2 a estação 10.0.0.88 está executando?',
      options: [
        'Gratuitous ARP Poisoning / Man-In-The-Middle',
        'Ataque de Exaustão DHCP (Starvation)',
        'Inundação por Amplificação DNS',
        'Reflexão ICMP Smurf',
      ],
      correctIndex: 0,
      explanation: 'A estação 10.0.0.88 (MAC 00:0c:29:88:fe:12) está injetando respostas ARP forjadas afirmando possuir tanto o IP do roteador (10.0.0.1) quanto o IP da vítima (10.0.0.50), envenenando ambas as tabelas ARP para interceptar o fluxo.',
    },
    {
      question: 'Por que os navegadores exibiram alertas de certificado SSL/TLS durante o incidente?',
      options: [
        'O invasor forjou registros DNS para a autoridade raiz',
        'O invasor interceptou o tráfego HTTPS e apresentou um certificado autoassinado não confiável para terminar o TLS',
        'A memória RAM do roteador local esgotou',
        'O cache do navegador expirou prematuramente',
      ],
      correctIndex: 1,
      explanation: 'Como o HTTPS é criptografado ponta a ponta, o proxy MITM precisa apresentar seu próprio certificado para inspecionar os dados em texto plano. Como o sistema operacional do cliente não confiava na CA do atacante, o navegador alertou o usuário.',
    }
  ],
  mitigationConfig: {
    ruleLabel: 'Selecione a diretiva de mitigação ótima no switch para neutralizar o ataque na camada de acesso:',
    options: [
      'Habilitar Dynamic ARP Inspection (DAI) com validação de tabela de associação do DHCP Snooping',
      'Agrupar todas as estações de trabalho em uma única sub-rede plana não gerenciada',
      'Desativar o Spanning Tree Protocol (STP) em todas as portas de acesso',
      'Aumentar o tempo limite de cache ARP nas máquinas finais para 24 horas',
    ],
    correctIndex: 0,
  },
  xpReward: 300,
};

export const INITIAL_PEERS: PeerStudent[] = [
  {
    id: 'peer-1',
    name: 'Elena Rostova',
    avatar: 'ER',
    score: 840,
    isMuted: false,
    hasCam: true,
    statusText: 'Analisando logs de consultas DNS...',
  },
  {
    id: 'peer-2',
    name: 'Marcus Vance',
    avatar: 'MV',
    score: 920,
    isMuted: true,
    hasCam: true,
    statusText: 'Revisando máscara de permissões no Linux',
  },
  {
    id: 'peer-3',
    name: 'Aisha Al-Mansoor',
    avatar: 'AA',
    score: 1150,
    isMuted: false,
    hasCam: false,
    statusText: 'Pronta para a próxima questão',
  }
];
