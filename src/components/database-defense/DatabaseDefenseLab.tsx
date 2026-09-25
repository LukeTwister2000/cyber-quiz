import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Terminal, 
  Lock, 
  Key, 
  CheckCircle2, 
  Play, 
  Pause,
  RefreshCw, 
  Plus, 
  Trash2, 
  Flame, 
  Sparkles,
  Server,
  Eye,
  Filter,
  Download,
  MapPin,
  ExternalLink,
  Search,
  Sliders,
  Radio,
  FileText,
  Activity,
  Zap,
  Info,
  Globe,
  Network,
  Cpu,
  Layers,
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { useCyberStore } from '../../store/useCyberStore';
import { 
  DatabaseTable, 
  FirewallRule, 
  DatabaseAccessLog, 
  AttackScript, 
  DatabaseMetrics, 
  MapsGroundingLink, 
  DefenseHardeningOption 
} from '../../types';

interface DatabaseDefenseLabProps {
  onOpenMentorWithContext: (topic: string, question: string) => void;
}

export const DatabaseDefenseLab: React.FC<DatabaseDefenseLabProps> = ({ onOpenMentorWithContext }) => {
  const { addXp, user } = useCyberStore();

  // Abas do Laboratório
  const [activeTab, setActiveTab] = useState<'firewall' | 'logs' | 'attacks' | 'database' | 'geo-intel'>('firewall');

  // Estado das Métricas da Base de Dados
  const [dbMetrics, setDbMetrics] = useState<DatabaseMetrics>({
    healthScore: 68,
    cpuLoad: 74,
    activeConnections: 18,
    blockedAttacksTotal: 42,
    allowedLegitQueriesTotal: 310,
    breachesDetectedTotal: 3,
    isCompromised: false
  });

  // Tabelas do Banco de Dados Corporativo "CyberVault"
  const [tables, setTables] = useState<DatabaseTable[]>([
    {
      id: 'tbl-users',
      name: 'tb_usuarios_admin',
      recordsCount: 1420,
      columns: [
        { name: 'id', type: 'INT PRIMARY KEY' },
        { name: 'usuario', type: 'VARCHAR(50)' },
        { name: 'senha_hash', type: 'VARCHAR(255)', isSensitive: true, isEncrypted: false },
        { name: 'email', type: 'VARCHAR(100)' },
        { name: 'permissao_role', type: 'VARCHAR(20)' }
      ]
    },
    {
      id: 'tbl-customers',
      name: 'tb_clientes_vip',
      recordsCount: 890,
      columns: [
        { name: 'id', type: 'INT PRIMARY KEY' },
        { name: 'cliente_nome', type: 'VARCHAR(120)' },
        { name: 'cpf', type: 'VARCHAR(14)', isSensitive: true, isEncrypted: false },
        { name: 'cartao_tokenizado', type: 'VARCHAR(19)', isSensitive: true, isEncrypted: false },
        { name: 'saldo_bancario', type: 'DECIMAL(12,2)', isSensitive: true, isEncrypted: false }
      ]
    },
    {
      id: 'tbl-transactions',
      name: 'tb_transacoes_pix',
      recordsCount: 124500,
      columns: [
        { name: 'id', type: 'BIGINT PRIMARY KEY' },
        { name: 'origem_id', type: 'INT' },
        { name: 'destino_chave_pix', type: 'VARCHAR(100)' },
        { name: 'valor_transferencia', type: 'DECIMAL(10,2)' },
        { name: 'data_hora', type: 'TIMESTAMP' }
      ]
    },
    {
      id: 'tbl-audit',
      name: 'tb_logs_auditoria',
      recordsCount: 54300,
      columns: [
        { name: 'id', type: 'BIGINT PRIMARY KEY' },
        { name: 'evento', type: 'VARCHAR(100)' },
        { name: 'ip_origem', type: 'VARCHAR(45)' },
        { name: 'status_sql', type: 'VARCHAR(20)' },
        { name: 'timestamp', type: 'TIMESTAMP' }
      ]
    }
  ]);

  // Regras de Firewall e ACLs ativas
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([
    {
      id: 'rule-web-allow',
      priority: 10,
      name: 'Permitir Aplicação Web Interna (Cluster NGINX)',
      description: 'Tráfego legítimo oriundo da subnet de servidores de aplicação (10.0.1.0/24)',
      sourceIp: '10.0.1.0/24',
      destinationPort: 3306,
      protocol: 'TCP',
      action: 'ALLOW',
      inspectionMode: 'PACKET_FILTER',
      enabled: true,
      hitCount: 4210,
      createdAt: 'Inicial'
    },
    {
      id: 'rule-db-repl',
      priority: 20,
      name: 'Replicação de Banco em Read-Replica',
      description: 'Conexão segura para nó de backup standby em 10.0.2.50',
      sourceIp: '10.0.2.50',
      destinationPort: 3306,
      protocol: 'TCP',
      action: 'ALLOW',
      inspectionMode: 'PACKET_FILTER',
      enabled: true,
      hitCount: 890,
      createdAt: 'Inicial'
    },
    {
      id: 'rule-block-tor',
      priority: 30,
      name: 'Bloquear Nó de Saída Malicioso Conhecido',
      description: 'IP detectado em listas de inteligência de ameaças internacionais disparando varreduras',
      sourceIp: '185.220.101.5',
      destinationPort: 'ANY',
      protocol: 'ANY',
      action: 'DENY',
      inspectionMode: 'PACKET_FILTER',
      enabled: true,
      hitCount: 312,
      createdAt: 'Inicial'
    }
  ]);

  // Política padrão do firewall (Default Policy)
  const [defaultPolicy, setDefaultPolicy] = useState<'DROP' | 'ACCEPT'>('ACCEPT');

  // Nível de Verbosidade de Logs
  const [logVerbosity, setLogVerbosity] = useState<'INFO' | 'DEBUG' | 'SECURITY' | 'FORENSIC'>('SECURITY');
  const [logFilterAction, setLogFilterAction] = useState<'ALL' | 'BLOCKED' | 'ALLOWED' | 'ALERT'>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [isLogStreamPaused, setIsLogStreamPaused] = useState(false);

  // Lista de Logs de Acesso e Auditoria
  const [logs, setLogs] = useState<DatabaseAccessLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 14000).toLocaleTimeString(),
      sourceIp: '10.0.1.15',
      originCountry: 'Brasil',
      originCity: 'São Paulo (Intranet Privada)',
      protocol: 'TCP',
      sourcePort: 49210,
      destinationPort: 3306,
      action: 'ALLOWED',
      matchedRuleId: 'rule-web-allow',
      severity: 'info',
      query: 'SELECT * FROM tb_transacoes_pix WHERE origem_id = ? LIMIT 10;',
      userOrAccount: 'db_app_service'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 11000).toLocaleTimeString(),
      sourceIp: '185.220.101.5',
      originCountry: 'Alemanha',
      originCity: 'Frankfurt am Main',
      originLat: 50.1109,
      originLng: 8.6821,
      protocol: 'TCP',
      sourcePort: 55432,
      destinationPort: 3306,
      action: 'BLOCKED',
      matchedRuleId: 'rule-block-tor',
      severity: 'critical',
      payload: "' UNION SELECT 1, usuario, senha_hash, email, 5 FROM tb_usuarios_admin --",
      threatActor: 'APT-Shadow Botnet',
      threatVector: 'sql_union'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 7000).toLocaleTimeString(),
      sourceIp: '45.154.255.8',
      originCountry: 'Holanda',
      originCity: 'Amsterdam',
      originLat: 52.3676,
      originLng: 4.9041,
      protocol: 'TCP',
      sourcePort: 38910,
      destinationPort: 3306,
      action: 'ALLOWED',
      severity: 'critical',
      payload: "root:password123 (Tentativa de conexão direta sem WAF)",
      threatActor: 'Hydra Automated Bruteforcer',
      threatVector: 'db_bruteforce'
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
      sourceIp: '103.145.12.89',
      originCountry: 'Cingapura',
      originCity: 'Singapore Hub',
      originLat: 1.3521,
      originLng: 103.8198,
      protocol: 'TCP',
      sourcePort: 41200,
      destinationPort: 3306,
      action: 'ALLOWED',
      severity: 'critical',
      payload: "'; DROP TABLE tb_logs_auditoria; --",
      threatActor: 'Ransomware Destructive Bot',
      threatVector: 'sql_drop'
    }
  ]);

  // Scripts de Ataque Automatizados em Execução
  const [attackScripts, setAttackScripts] = useState<AttackScript[]>([
    {
      id: 'script-sqli',
      name: 'sqlmap_distributed_crawler.py',
      fileName: 'botnet_sqlmap_v2.py',
      vector: 'sqli',
      description: 'Script automatizado que injeta payloads UNION e Boolean-blind em massa tentando exfiltrar hashes de senhas e dados bancários.',
      attackerIp: '185.220.101.5',
      originLocation: 'Frankfurt, Alemanha',
      datacenter: 'Equinix Data Center FR5',
      originLat: 50.1109,
      originLng: 8.6821,
      targetPort: 3306,
      targetTable: 'tb_usuarios_admin',
      frequencyIntervalMs: 2500,
      payloadSamples: [
        "' UNION SELECT 1, usuario, senha_hash, email, 5 FROM tb_usuarios_admin --",
        "admin' OR '1'='1' --",
        "1' AND (SELECT 42 FROM (SELECT(SLEEP(5)))b) AND '1'='1"
      ],
      mitigationRuleType: 'waf_sqli',
      status: 'attacking',
      packetsSent: 142,
      packetsBlocked: 80
    },
    {
      id: 'script-bruteforce',
      name: 'hydra_mysql_bruteforce.sh',
      fileName: 'hydra_fast_crack.sh',
      vector: 'bruteforce',
      description: 'Script de força bruta de dicionário direcionado à porta 3306 exposta na Internet, tentando adivinhar credenciais de root e admin.',
      attackerIp: '45.154.255.8',
      originLocation: 'Amsterdam, Holanda',
      datacenter: 'DigitalOcean AMS3 Datacenter',
      originLat: 52.3676,
      originLng: 4.9041,
      targetPort: 3306,
      targetTable: 'Sessões de Conexão MySQL',
      frequencyIntervalMs: 1800,
      payloadSamples: [
        "Conexão TCP: usuário 'root', senha 'admin123' [PORT 3306]",
        "Conexão TCP: usuário 'db_master', senha 'password' [PORT 3306]",
        "Conexão TCP: usuário 'administrator', senha 'toor' [PORT 3306]"
      ],
      mitigationRuleType: 'firewall_port',
      status: 'attacking',
      packetsSent: 280,
      packetsBlocked: 0
    },
    {
      id: 'script-wipe',
      name: 'ransom_ddl_wiper.py',
      fileName: 'wipe_and_extort.py',
      vector: 'wipe',
      description: 'Script de extorsão que tenta injetar comandos DDL destrutivos (DROP TABLE / TRUNCATE) para deletar os registros de auditoria forense.',
      attackerIp: '103.145.12.89',
      originLocation: 'Cingapura',
      datacenter: 'Singtel Cyber Nexus Hub',
      originLat: 1.3521,
      originLng: 103.8198,
      targetPort: 3306,
      targetTable: 'tb_logs_auditoria',
      frequencyIntervalMs: 3200,
      payloadSamples: [
        "'; DROP TABLE tb_logs_auditoria; --",
        "'; TRUNCATE TABLE tb_transacoes_pix; --",
        "'; ALTER TABLE tb_usuarios_admin DROP COLUMN senha_hash; --"
      ],
      mitigationRuleType: 'firewall_ip',
      status: 'attacking',
      packetsSent: 68,
      packetsBlocked: 0
    },
    {
      id: 'script-exfil',
      name: 'pii_exfiltrator_daemon.go',
      fileName: 'exfil_streamer.go',
      vector: 'exfil',
      description: 'Varredor furtivo buscando números de CPF e cartões de crédito em texto puro sem criptografia para vazamento em mercados ilegais.',
      attackerIp: '194.26.29.112',
      originLocation: 'Moscou, Rússia',
      datacenter: 'Selectel Cloud Transit Node',
      originLat: 55.7558,
      originLng: 37.6173,
      targetPort: 3306,
      targetTable: 'tb_clientes_vip',
      frequencyIntervalMs: 4000,
      payloadSamples: [
        "SELECT cpf, cartao_tokenizado, saldo_bancario FROM tb_clientes_vip WHERE 1=1;",
        "SELECT * FROM tb_clientes_vip INTO OUTFILE '/tmp/dump_pii.csv';"
      ],
      mitigationRuleType: 'rate_limit',
      status: 'attacking',
      packetsSent: 94,
      packetsBlocked: 0
    }
  ]);

  // Controles de Adição de Nova Regra
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleIp, setNewRuleIp] = useState('');
  const [newRulePort, setNewRulePort] = useState<string>('3306');
  const [newRuleProtocol, setNewRuleProtocol] = useState<'TCP' | 'UDP' | 'ANY'>('TCP');
  const [newRuleAction, setNewRuleAction] = useState<'ALLOW' | 'DENY'>('DENY');
  const [newRuleInspection, setNewRuleInspection] = useState<'PACKET_FILTER' | 'WAF_SQLI' | 'RATE_LIMIT' | 'HONEYPOT_GUARD'>('PACKET_FILTER');

  // Simulação Contínua
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState(1);
  const [labCompleted, setLabCompleted] = useState(false);

  // Estado do Google Maps Grounding
  const [selectedGeoTarget, setSelectedGeoTarget] = useState<{
    ip?: string;
    city?: string;
    datacenter?: string;
    lat?: number;
    lng?: number;
  } | null>(null);
  const [geoIntelLoading, setGeoIntelLoading] = useState(false);
  const [geoIntelResult, setGeoIntelResult] = useState<{
    text: string;
    mapsLinks: MapsGroundingLink[];
    isSimulated: boolean;
  } | null>(null);
  const [geoSearchQuery, setGeoSearchQuery] = useState('');

  // Auto-scroll ref para os logs
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Avalia o bloqueio de cada script com base nas regras de firewall e na política padrão
  useEffect(() => {
    const updatedScripts = attackScripts.map(script => {
      let isBlocked = false;

      // 1. Checa se o IP do atacante está explicitamente bloqueado por uma regra ativa
      const ipBlockedRule = firewallRules.find(r => 
        r.enabled && 
        r.action === 'DENY' && 
        (r.sourceIp === script.attackerIp || r.sourceIp === '*' || script.attackerIp.startsWith(r.sourceIp.replace('.0/24', '')))
      );

      // 2. Checa se a porta do banco está fechada para o mundo externo
      const portBlockedRule = firewallRules.find(r =>
        r.enabled &&
        r.action === 'DENY' &&
        (r.destinationPort === script.targetPort || r.destinationPort === 'ANY') &&
        (r.sourceIp === '*' || r.sourceIp === '0.0.0.0/0')
      );

      // 3. Checa WAF heurístico ativo
      const wafActive = firewallRules.some(r =>
        r.enabled && r.inspectionMode === 'WAF_SQLI' && r.action === 'DENY'
      );

      // 4. Checa política padrão DROP ALL
      if (defaultPolicy === 'DROP') {
        const hasExplicitAllow = firewallRules.some(r => 
          r.enabled && 
          r.action === 'ALLOW' && 
          (r.sourceIp === script.attackerIp || r.sourceIp === '*')
        );
        if (!hasExplicitAllow) {
          isBlocked = true;
        }
      }

      if (ipBlockedRule) isBlocked = true;
      if (portBlockedRule && script.vector === 'bruteforce') isBlocked = true;
      if (wafActive && script.vector === 'sqli') isBlocked = true;

      // Rate limit blocks exfil
      const rateLimitActive = firewallRules.some(r =>
        r.enabled && r.inspectionMode === 'RATE_LIMIT'
      );
      if (rateLimitActive && script.vector === 'exfil') isBlocked = true;

      return {
        ...script,
        status: isBlocked ? 'blocked' : 'attacking'
      };
    });

    setAttackScripts(updatedScripts as AttackScript[]);

    // Recalcula métricas de integridade
    const blockedCount = updatedScripts.filter(s => s.status === 'blocked').length;
    const totalScripts = updatedScripts.length;
    const allMitigated = blockedCount === totalScripts;

    const newHealth = Math.min(100, Math.round(40 + (blockedCount / totalScripts) * 60));
    const newCpu = Math.max(12, Math.round(85 - (blockedCount / totalScripts) * 65));

    setDbMetrics(prev => ({
      ...prev,
      healthScore: newHealth,
      cpuLoad: newCpu,
      isCompromised: blockedCount < 2,
      blockedAttacksTotal: prev.blockedAttacksTotal + (blockedCount > 0 ? 1 : 0)
    }));

    if (allMitigated && !labCompleted) {
      setLabCompleted(true);
      addXp(300, 'Laboratório Concluído: Simulador de Defesa de Banco de Dados Blindado');
    }
  }, [firewallRules, defaultPolicy]);

  // Loop de Simulação de Tráfego e Geração de Logs em Tempo Real
  useEffect(() => {
    if (!isSimulating || isLogStreamPaused) return;

    const interval = setInterval(() => {
      // Sorteia um script de ataque ou requisição legítima
      const isLegit = Math.random() > 0.65;

      if (isLegit) {
        const legitLog: DatabaseAccessLog = {
          id: 'log-' + Math.random().toString(36).slice(2, 7),
          timestamp: new Date().toLocaleTimeString(),
          sourceIp: '10.0.1.' + Math.floor(Math.random() * 20 + 10),
          originCountry: 'Brasil',
          originCity: 'Cluster de Aplicação (VPC Privada)',
          protocol: 'TCP',
          sourcePort: Math.floor(Math.random() * 20000 + 40000),
          destinationPort: 3306,
          action: 'ALLOWED',
          matchedRuleId: 'rule-web-allow',
          severity: 'info',
          query: 'SELECT cliente_nome, saldo_bancario FROM tb_clientes_vip WHERE id = ' + Math.floor(Math.random() * 500) + ';',
          userOrAccount: 'db_app_service'
        };

        setLogs(prev => [legitLog, ...prev.slice(0, 49)]);
        setDbMetrics(m => ({ ...m, allowedLegitQueriesTotal: m.allowedLegitQueriesTotal + 1 }));
      } else {
        const randomScript = attackScripts[Math.floor(Math.random() * attackScripts.length)];
        const isBlocked = randomScript.status === 'blocked';
        const randomPayload = randomScript.payloadSamples[Math.floor(Math.random() * randomScript.payloadSamples.length)];

        const attackLog: DatabaseAccessLog = {
          id: 'log-' + Math.random().toString(36).slice(2, 7),
          timestamp: new Date().toLocaleTimeString(),
          sourceIp: randomScript.attackerIp,
          originCountry: randomScript.originLocation.split(',')[1]?.trim() || 'Internacional',
          originCity: randomScript.originLocation.split(',')[0]?.trim() || 'Desconhecido',
          originLat: randomScript.originLat,
          originLng: randomScript.originLng,
          protocol: 'TCP',
          sourcePort: Math.floor(Math.random() * 20000 + 35000),
          destinationPort: typeof randomScript.targetPort === 'number' ? randomScript.targetPort : 3306,
          action: isBlocked ? 'BLOCKED' : 'ALLOWED',
          matchedRuleId: isBlocked ? 'Regra de Firewall Ativa' : undefined,
          severity: isBlocked ? 'warning' : 'critical',
          payload: randomPayload,
          threatActor: randomScript.name,
          threatVector: randomScript.vector,
          wafBlocked: isBlocked && randomScript.vector === 'sqli'
        };

        setLogs(prev => [attackLog, ...prev.slice(0, 49)]);

        // Atualiza contadores do script
        setAttackScripts(prev => prev.map(s => {
          if (s.id === randomScript.id) {
            return {
              ...s,
              packetsSent: s.packetsSent + 1,
              packetsBlocked: isBlocked ? s.packetsBlocked + 1 : s.packetsBlocked
            };
          }
          return s;
        }));

        if (isBlocked) {
          setDbMetrics(m => ({ ...m, blockedAttacksTotal: m.blockedAttacksTotal + 1 }));
        } else {
          setDbMetrics(m => ({ ...m, breachesDetectedTotal: m.breachesDetectedTotal + 1 }));
        }
      }
    }, 2400 / simulationSpeedMultiplier);

    return () => clearInterval(interval);
  }, [isSimulating, isLogStreamPaused, attackScripts, simulationSpeedMultiplier]);

  // Ações de Firewall
  const handleToggleRule = (ruleId: string) => {
    setFirewallRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    setFirewallRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleAddNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleIp.trim()) return;

    const newRule: FirewallRule = {
      id: 'rule-' + Math.random().toString(36).slice(2, 7),
      priority: firewallRules.length * 10 + 10,
      name: newRuleName.trim(),
      description: `Regra configurada pelo operador para tráfego de ${newRuleIp}`,
      sourceIp: newRuleIp.trim(),
      destinationPort: newRulePort === 'ANY' ? 'ANY' : parseInt(newRulePort, 10),
      protocol: newRuleProtocol,
      action: newRuleAction,
      inspectionMode: newRuleInspection,
      enabled: true,
      hitCount: 0,
      createdAt: 'Agora'
    };

    setFirewallRules(prev => [newRule, ...prev]);
    setShowAddRuleModal(false);
    setNewRuleName('');
    setNewRuleIp('');
  };

  // Presets de Hardening
  const applyPresetPrivateDatabase = () => {
    // 1. Bloquear acesso público na porta 3306 para qualquer IP externo não autorizado
    const blockPublicPortRule: FirewallRule = {
      id: 'preset-block-public-db',
      priority: 5,
      name: 'Isolamento de Banco de Dados: Bloquear 3306 Externo (0.0.0.0/0)',
      description: 'Garante que portas de banco de dados (3306/5432) nunca fiquem expostas diretamente na Internet',
      sourceIp: '*',
      destinationPort: 3306,
      protocol: 'TCP',
      action: 'DENY',
      inspectionMode: 'PACKET_FILTER',
      enabled: true,
      hitCount: 412,
      createdAt: 'Preset Aplicado'
    };

    setFirewallRules(prev => [blockPublicPortRule, ...prev.filter(r => r.id !== 'preset-block-public-db')]);
  };

  const applyPresetWafAntiSqli = () => {
    const wafRule: FirewallRule = {
      id: 'preset-waf-sqli',
      priority: 2,
      name: 'WAF Heurístico: Bloqueio de Assinaturas SQL Injection',
      description: 'Inspeciona corpos HTTP e queries em busca de palavras-chave perigosas (UNION, OR 1=1, SLEEP, DROP TABLE)',
      sourceIp: '*',
      destinationPort: 'ANY',
      protocol: 'ANY',
      action: 'DENY',
      inspectionMode: 'WAF_SQLI',
      enabled: true,
      hitCount: 198,
      createdAt: 'Preset Aplicado'
    };

    setFirewallRules(prev => [wafRule, ...prev.filter(r => r.id !== 'preset-waf-sqli')]);
  };

  const applyPresetRateLimiting = () => {
    const rateLimitRule: FirewallRule = {
      id: 'preset-rate-limit',
      priority: 8,
      name: 'Rate Limiting Defensivo: Máximo 5 req/s por IP',
      description: 'Impede crawlers e scripts automatizados de despejarem consultas rápidas de exfiltração em lote',
      sourceIp: '*',
      destinationPort: 3306,
      protocol: 'TCP',
      action: 'DENY',
      inspectionMode: 'RATE_LIMIT',
      rateLimitRps: 5,
      enabled: true,
      hitCount: 154,
      createdAt: 'Preset Aplicado'
    };

    setFirewallRules(prev => [rateLimitRule, ...prev.filter(r => r.id !== 'preset-rate-limit')]);
  };

  const handleAddHoneytokenTable = () => {
    const canaryTable: DatabaseTable = {
      id: 'tbl-honeytoken-' + Math.random().toString(36).slice(2, 6),
      name: 'tb_admin_segredos_canario',
      recordsCount: 1,
      isCanary: true,
      columns: [
        { name: 'id', type: 'INT PRIMARY KEY' },
        { name: 'master_token', type: 'VARCHAR(255)', isSensitive: true },
        { name: 'alarme_honeytoken_disparado', type: 'BOOLEAN' }
      ]
    };

    const canaryRule: FirewallRule = {
      id: 'rule-honeytoken-auto',
      priority: 1,
      name: 'Armadilha Canário: Bloqueio Imediato por Honeytoken',
      description: 'Qualquer IP que tente ler a tabela tb_admin_segredos_canario é sumariamente banido no firewall perimetral',
      sourceIp: '103.145.12.89',
      destinationPort: 'ANY',
      protocol: 'ANY',
      action: 'DENY',
      inspectionMode: 'HONEYPOT_GUARD',
      enabled: true,
      hitCount: 12,
      createdAt: 'Honeytoken Implantado'
    };

    setTables(prev => [...prev, canaryTable]);
    setFirewallRules(prev => [canaryRule, ...prev]);
  };

  // Google Maps Grounding via Gemini Endpoint
  const handleFetchGeoIntel = async (target: { ip?: string; city?: string; datacenter?: string; lat?: number; lng?: number }) => {
    setSelectedGeoTarget(target);
    setActiveTab('geo-intel');
    setGeoIntelLoading(true);
    setGeoIntelResult(null);

    try {
      const response = await fetch('/api/threat-intel/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetIp: target.ip,
          locationName: target.city || target.datacenter,
          query: `Pesquise a localização exata no Google Maps de data centers, pontos de presença de rede e centros de resposta a incidentes cibernéticos (CSIRT / CERT) na região de ${target.city || target.datacenter || 'Frankfurt'}.`,
          userLocation: target.lat && target.lng ? { latitude: target.lat, longitude: target.lng } : undefined
        })
      });

      const data = await response.json();
      setGeoIntelResult(data);
    } catch (err: any) {
      console.error('Falha ao buscar inteligência no Google Maps:', err);
      // Fallback gracioso
      setGeoIntelResult({
        text: `### Análise de Inteligência Geoespacial\n\n**Alvo Selecionado:** ${target.city || target.ip}\n**Instalação Estimada:** ${target.datacenter || 'Instalação de Colocation Regional'}\n\nO endereço IP \`${target.ip || '185.220.101.5'}\` opera através de trânsito BGP regional com histórico de varreduras automatizadas. Recomendamos aplicar a regra DENY no perímetro de firewall.`,
        mapsLinks: [
          {
            title: `Buscar no Google Maps: ${target.datacenter || target.city || 'Frankfurt'}`,
            uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((target.datacenter || target.city || 'Frankfurt') + ' data center')}`,
            address: target.city || 'Região Metropolitana'
          }
        ],
        isSimulated: true
      });
    } finally {
      setGeoIntelLoading(false);
    }
  };

  const handleSearchCustomGeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geoSearchQuery.trim()) return;
    handleFetchGeoIntel({
      city: geoSearchQuery.trim(),
      datacenter: `Centro de Segurança / Data Center em ${geoSearchQuery.trim()}`
    });
  };

  // Filtragem de logs
  const filteredLogs = logs.filter(log => {
    if (logFilterAction === 'BLOCKED' && log.action !== 'BLOCKED') return false;
    if (logFilterAction === 'ALLOWED' && log.action !== 'ALLOWED') return false;
    if (logFilterAction === 'ALERT' && log.action !== 'ALERT') return false;

    if (logVerbosity === 'INFO' && log.severity === 'critical') return true;
    if (logVerbosity === 'SECURITY' && log.severity === 'info') return false;

    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchIp = log.sourceIp.toLowerCase().includes(q);
      const matchPayload = log.payload?.toLowerCase().includes(q);
      const matchQuery = log.query?.toLowerCase().includes(q);
      const matchActor = log.threatActor?.toLowerCase().includes(q);
      if (!matchIp && !matchPayload && !matchQuery && !matchActor) return false;
    }

    return true;
  });

  const exportLogsAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cyberquiz_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const blockedCount = attackScripts.filter(s => s.status === 'blocked').length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8 font-sans">
      
      {/* Cabeçalho Editorial com Telemetria em Tempo Real */}
      <div className="border border-neutral-800 bg-neutral-900/40 p-6 rounded-lg dark:border-neutral-800 dark:bg-neutral-900/40 light:border-neutral-200 light:bg-white space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              WAR ROOM DEFENSIVO
            </span>
            <span>·</span>
            <span className="text-neutral-300">SIMULADOR DE DEFESA DE BANCO DE DADOS</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">+300 XP</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded font-bold uppercase text-[11px] border ${
              dbMetrics.healthScore > 80 
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400' 
                : 'bg-rose-950/60 border-rose-500/60 text-rose-400 animate-pulse'
            }`}>
              STATUS: {dbMetrics.healthScore > 80 ? 'BLINDADO' : 'SOB ATAQUE ATIVO'}
            </span>
            <button
              onClick={() => onOpenMentorWithContext(
                'Defesa de Banco de Dados & Firewall',
                'Como proteger portas de banco de dados (3306/5432) contra scripts automatizados de SQLi e força bruta usando regras ACL de firewall e WAF?'
              )}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cyber Mentor</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-neutral-950 tracking-tight">
            Simulador de Defesa de Banco de Dados & Firewall Perimetral
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-600 mt-1 leading-relaxed">
            Scripts automatizados de cibercriminosos estão executando ataques contínuos de SQL Injection, força bruta em portas abertas e tentativas de destruição de logs contra o seu banco de dados fictício <strong>CyberVault Core</strong>. Configure regras de firewall (ACL), ative inspeção heurística WAF, monitore os logs de auditoria e utilize rastreamento via Google Maps para localizar e neutralizar as ameaças.
          </p>
        </div>

        {/* 4 Cards de Métricas Técnicas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded border border-neutral-800 bg-neutral-950/60 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Integridade do Banco</span>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className={`h-4 w-4 ${dbMetrics.healthScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-base font-bold font-mono text-white dark:text-white light:text-neutral-900 tabular-nums">
                {dbMetrics.healthScore}%
              </span>
            </div>
          </div>

          <div className="p-3 rounded border border-neutral-800 bg-neutral-950/60 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Carga de CPU (Servidor DB)</span>
            <div className="flex items-center gap-2 mt-1">
              <Cpu className={`h-4 w-4 ${dbMetrics.cpuLoad > 60 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span className="text-base font-bold font-mono text-white dark:text-white light:text-neutral-900 tabular-nums">
                {dbMetrics.cpuLoad}%
              </span>
            </div>
          </div>

          <div className="p-3 rounded border border-neutral-800 bg-neutral-950/60 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Ataques Neutralizados</span>
            <div className="flex items-center gap-2 mt-1">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {blockedCount} de {attackScripts.length} Vetores
              </span>
            </div>
          </div>

          <div className="p-3 rounded border border-neutral-800 bg-neutral-950/60 dark:border-neutral-800 light:bg-neutral-50 light:border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Total de Pacotes Interceptados</span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="h-4 w-4 text-sky-400" />
              <span className="text-base font-bold font-mono text-sky-400 tabular-nums">
                {dbMetrics.blockedAttacksTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Superior de Abas Internas do Lab */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('firewall')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium uppercase transition-colors ${
              activeTab === 'firewall'
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-sky-400" />
            <span>Regras de Firewall (ACL & WAF)</span>
            <span className="text-[10px] bg-neutral-900 px-1.5 py-0.2 rounded text-neutral-400">
              {firewallRules.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium uppercase transition-colors ${
              activeTab === 'logs'
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Console de Logs em Tempo Real</span>
            <span className="text-[10px] bg-neutral-900 px-1.5 py-0.2 rounded text-neutral-400">
              {logs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('attacks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium uppercase transition-colors ${
              activeTab === 'attacks'
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>Scripts de Ataque Automatizados</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              blockedCount === attackScripts.length ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
            }`}>
              {blockedCount}/{attackScripts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium uppercase transition-colors ${
              activeTab === 'database'
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5 text-amber-400" />
            <span>Tabelas & Hardening DB</span>
            <span className="text-[10px] bg-neutral-900 px-1.5 py-0.2 rounded text-neutral-400">
              {tables.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('geo-intel')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium uppercase transition-colors ${
              activeTab === 'geo-intel'
                ? 'bg-sky-950/80 text-sky-200 border border-sky-600/60'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-rose-400" />
            <span>Geo-Inteligência (Google Maps)</span>
          </button>
        </div>

        {/* Controles de Simulação */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 transition-colors"
          >
            {isSimulating ? <Pause className="h-3 w-3 text-amber-400" /> : <Play className="h-3 w-3 text-emerald-400" />}
            <span>{isSimulating ? 'Pausar Simulação' : 'Retomar Simulação'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: REGRAS DE FIREWALL (ACL & WAF) */}
      {/* ========================================================================= */}
      {activeTab === 'firewall' && (
        <div className="space-y-6">
          
          {/* Barra de Presets de Hardening em 1 Clique */}
          <div className="border border-neutral-800 bg-neutral-900/30 p-4 rounded-lg space-y-3 dark:border-neutral-800 light:border-neutral-200 light:bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-neutral-300 uppercase flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                CONTRAMEDIDAS RÁPIDAS & PRESETS DE HARDENING (OWASP & ZERO TRUST)
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Clique para aplicar</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <button
                onClick={applyPresetPrivateDatabase}
                className="p-3 text-left rounded border border-neutral-800 bg-neutral-950/40 hover:border-sky-500/80 transition-colors group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-sky-300 flex items-center justify-between">
                  <span>Isolamento da Porta 3306</span>
                  <Plus className="h-3.5 w-3.5 text-sky-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Bloqueia conexões públicas na porta do banco (3306/5432) contra scripts de força bruta.
                </p>
              </button>

              <button
                onClick={applyPresetWafAntiSqli}
                className="p-3 text-left rounded border border-neutral-800 bg-neutral-950/40 hover:border-emerald-500/80 transition-colors group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center justify-between">
                  <span>WAF Heurístico Anti-SQLi</span>
                  <Plus className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Inspeciona assinaturas de injeção SQL (UNION, Boolean-Blind, DROP) antes de chegarem à query.
                </p>
              </button>

              <button
                onClick={applyPresetRateLimiting}
                className="p-3 text-left rounded border border-neutral-800 bg-neutral-950/40 hover:border-purple-500/80 transition-colors group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-purple-300 flex items-center justify-between">
                  <span>Rate Limiting (5 req/s)</span>
                  <Plus className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Limita velocidade de requisições por IP impedindo exfiltração em lote e scanners de varredura.
                </p>
              </button>
            </div>
          </div>

          {/* Cabeçalho da Tabela de Regras + Botões de Ação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold font-mono text-white dark:text-white light:text-neutral-950 uppercase flex items-center gap-2">
                <Sliders className="h-4 w-4 text-sky-400" />
                TABELA DE REGRAS DE ACESSO (ACCESS CONTROL LIST - ACL)
              </h2>
              <p className="text-xs text-neutral-400">
                As regras são avaliadas de cima para baixo. A primeira regra coincidente determina se o pacote é aceito (ALLOW) ou descartado (DENY).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddRuleModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Adicionar Nova Regra</span>
              </button>
            </div>
          </div>

          {/* Tabela de Regras de Firewall */}
          <div className="overflow-x-auto rounded border border-neutral-800 bg-neutral-950/40">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] border-b border-neutral-800 select-none">
                <tr>
                  <th className="py-2.5 px-3">Prioridade</th>
                  <th className="py-2.5 px-3">Nome / Descrição</th>
                  <th className="py-2.5 px-3">IP de Origem</th>
                  <th className="py-2.5 px-3">Porta Alvo</th>
                  <th className="py-2.5 px-3">Proto</th>
                  <th className="py-2.5 px-3">Modo de Inspeção</th>
                  <th className="py-2.5 px-3">Ação</th>
                  <th className="py-2.5 px-3">Disparos (Hits)</th>
                  <th className="py-2.5 px-3 text-right">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {firewallRules.map((rule) => {
                  const isDeny = rule.action === 'DENY';

                  return (
                    <tr 
                      key={rule.id}
                      className={`hover:bg-neutral-900/40 transition-colors ${
                        !rule.enabled ? 'opacity-40 bg-neutral-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-neutral-400">
                        #{rule.priority}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white dark:text-white light:text-neutral-900">
                          {rule.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 line-clamp-1 font-sans">
                          {rule.description}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700/80 text-neutral-300">
                          {rule.sourceIp}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sky-400 font-semibold">
                        {rule.destinationPort === 'ANY' ? 'QUALQUER' : rule.destinationPort}
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {rule.protocol}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                          {rule.inspectionMode}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${
                          isDeny 
                            ? 'bg-rose-950/70 border-rose-600/70 text-rose-300' 
                            : 'bg-emerald-950/70 border-emerald-600/70 text-emerald-300'
                        }`}>
                          {rule.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400 tabular-nums">
                        {rule.hitCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleRule(rule.id)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                              rule.enabled 
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-emerald-400' 
                                : 'bg-neutral-900 text-neutral-500 hover:text-white'
                            }`}
                          >
                            {rule.enabled ? 'ATIVO' : 'INATIVO'}
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            title="Remover regra"
                            className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Configuração de Política Padrão (Default Policy) */}
          <div className="border border-neutral-800 p-4 rounded-lg bg-neutral-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                POLÍTICA PADRÃO DE BLOQUEIO (DEFAULT POLICY)
              </span>
              <p className="text-xs text-neutral-400">
                Define o comportamento caso um pacote de rede não coincida com nenhuma das regras ACL acima.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDefaultPolicy('DROP')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase border transition-all ${
                  defaultPolicy === 'DROP'
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                DROP ALL (Zero Trust - Recomendado)
              </button>
              <button
                onClick={() => setDefaultPolicy('ACCEPT')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase border transition-all ${
                  defaultPolicy === 'ACCEPT'
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                ACCEPT ALL (Permissivo / Inseguro)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CONSOLE DE LOGS EM TEMPO REAL */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros e Verbosidade */}
          <div className="border border-neutral-800 bg-neutral-900/40 p-4 rounded-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Filtro por Ação */}
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-neutral-500 mr-1 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Ação:
                </span>
                {(['ALL', 'BLOCKED', 'ALLOWED', 'ALERT'] as const).map(action => (
                  <button
                    key={action}
                    onClick={() => setLogFilterAction(action)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      logFilterAction === action
                        ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {action === 'ALL' ? 'Todos' : action === 'BLOCKED' ? 'Bloqueados (DROP)' : action === 'ALLOWED' ? 'Permitidos' : 'Alertas'}
                  </button>
                ))}
              </div>

              {/* Nível de Verbosidade */}
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-neutral-500 mr-1">Verbosidade:</span>
                {(['INFO', 'SECURITY', 'FORENSIC'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLogVerbosity(lvl)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                      logVerbosity === lvl
                        ? 'bg-sky-950 text-sky-300 font-bold border border-sky-700'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Ações de Download / Limpeza */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLogStreamPaused(!isLogStreamPaused)}
                  className="px-2.5 py-1 rounded text-xs font-mono border border-neutral-800 hover:border-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                >
                  {isLogStreamPaused ? <Play className="h-3 w-3 text-emerald-400" /> : <Pause className="h-3 w-3 text-amber-400" />}
                  <span>{isLogStreamPaused ? 'Retomar Stream' : 'Pausar Stream'}</span>
                </button>
                <button
                  onClick={exportLogsAsJson}
                  className="px-2.5 py-1 rounded text-xs font-mono border border-neutral-800 hover:border-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3 w-3 text-sky-400" />
                  <span>Exportar .JSON</span>
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="px-2 py-1 rounded text-xs font-mono text-neutral-500 hover:text-rose-400 transition-colors"
                >
                  Limpar
                </button>
              </div>

            </div>

            {/* Campo de Busca Textual */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder="Filtrar por IP (ex: 185.220), query SQL (ex: UNION SELECT), payload ou botnet..."
                className="w-full pl-9 pr-4 py-1.5 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
              />
            </div>
          </div>

          {/* Console Screen dos Logs */}
          <div className="rounded border border-neutral-800 bg-[#090C10] font-mono text-xs overflow-hidden shadow-2xl">
            <div className="px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span className="font-semibold text-neutral-200">
                  /var/log/cybervault/audit_access.log (Conexões ativas: {dbMetrics.activeConnections})
                </span>
              </div>
              <span className="text-neutral-500">
                Mostrando {filteredLogs.length} eventos
              </span>
            </div>

            <div className="p-4 space-y-2 max-h-[520px] overflow-y-auto divide-y divide-neutral-900">
              {filteredLogs.length === 0 ? (
                <div className="py-8 text-center text-neutral-500 text-xs">
                  Nenhum log encontrado para os filtros selecionados.
                </div>
              ) : (
                filteredLogs.map(log => {
                  const isBlocked = log.action === 'BLOCKED';
                  const isAlert = log.action === 'ALERT';

                  return (
                    <div key={log.id} className="pt-2 pb-1.5 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500">{log.timestamp}</span>
                          <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] border ${
                            isBlocked 
                              ? 'bg-rose-950/70 border-rose-800/80 text-rose-300' 
                              : isAlert
                              ? 'bg-amber-950/70 border-amber-800/80 text-amber-300'
                              : 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-sky-300 font-medium">
                            {log.sourceIp}:{log.sourcePort}
                          </span>
                          <span className="text-neutral-500">→</span>
                          <span className="text-neutral-400">
                            :{log.destinationPort}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-sans">
                            ({log.originCity})
                          </span>
                        </div>

                        {/* Botão Rastrear no Google Maps */}
                        {log.sourceIp !== '10.0.1.15' && !log.sourceIp.startsWith('10.0.') && (
                          <button
                            onClick={() => handleFetchGeoIntel({
                              ip: log.sourceIp,
                              city: log.originCity,
                              lat: log.originLat,
                              lng: log.originLng
                            })}
                            className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-sans transition-colors"
                          >
                            <MapPin className="h-3 w-3 text-rose-400" />
                            <span>Rastrear no Google Maps</span>
                          </button>
                        )}
                      </div>

                      {/* Payload / Query Inspecionada */}
                      {log.payload && (
                        <div className="pl-4 border-l-2 border-rose-500/60 text-[11px] text-rose-300 break-all bg-rose-950/10 py-1 px-2 rounded">
                          <span className="text-neutral-500 mr-2 font-bold">[PAYLOAD INTERCEPTADO]:</span>
                          <span className="font-semibold">{log.payload}</span>
                        </div>
                      )}

                      {log.query && (
                        <div className="pl-4 border-l-2 border-emerald-500/60 text-[11px] text-emerald-300 break-all bg-emerald-950/10 py-1 px-2 rounded">
                          <span className="text-neutral-500 mr-2 font-bold">[QUERY PARAMETRIZADA]:</span>
                          <span>{log.query}</span>
                        </div>
                      )}

                      {/* Detalhe Forense de Regra */}
                      <div className="text-[10px] text-neutral-500 flex items-center gap-3">
                        {log.threatActor && (
                          <span>Vetor: <strong className="text-neutral-400">{log.threatActor}</strong></span>
                        )}
                        {log.matchedRuleId && (
                          <span>Regra: <strong className="text-neutral-400">{log.matchedRuleId}</strong></span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: SCRIPTS DE ATAQUE AUTOMATIZADOS */}
      {/* ========================================================================= */}
      {activeTab === 'attacks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm font-bold font-mono text-white dark:text-white light:text-neutral-950 uppercase flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-400" />
                VETORES DE ATAQUE AUTOMATIZADOS DISPARADOS EM TEMPO REAL
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Simula scripts de adversários externos conectados via botnets globais tentando comprometer a base de dados fictícia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Velocidade:</span>
              <button
                onClick={() => setSimulationSpeedMultiplier(1)}
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  simulationSpeedMultiplier === 1 ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-500'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setSimulationSpeedMultiplier(3)}
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  simulationSpeedMultiplier === 3 ? 'bg-rose-950 text-rose-300 font-bold border border-rose-700' : 'text-neutral-500'
                }`}
              >
                3x (Stress Test)
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {attackScripts.map(script => {
              const isBlocked = script.status === 'blocked';

              return (
                <div
                  key={script.id}
                  className={`p-5 rounded-lg border space-y-4 transition-all ${
                    isBlocked 
                      ? 'border-emerald-800/60 bg-emerald-950/20 text-neutral-300' 
                      : 'border-rose-700/80 bg-rose-950/20 text-neutral-200 ring-1 ring-rose-500/20'
                  }`}
                >
                  {/* Cabeçalho do Script */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Terminal className={`h-4 w-4 ${isBlocked ? 'text-emerald-400' : 'text-rose-400'}`} />
                        <h3 className="font-mono font-bold text-sm text-white">
                          {script.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 mt-0.5 block">
                        IP de Origem: <strong className="text-sky-300">{script.attackerIp}</strong> · {script.originLocation}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                      isBlocked 
                        ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300' 
                        : 'bg-rose-900/80 border-rose-500 text-rose-200 animate-pulse'
                    }`}>
                      {isBlocked ? 'BLOQUEADO' : 'ATACANDO AO VIVO'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {script.description}
                  </p>

                  {/* Amostra do Payload disparado */}
                  <div className="p-3 rounded bg-black/80 border border-neutral-800 text-[11px] font-mono space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold block">Amostra do Payload Injetado:</span>
                    <p className={isBlocked ? 'line-through text-neutral-500 break-all' : 'text-rose-400 font-semibold break-all'}>
                      {script.payloadSamples[0]}
                    </p>
                  </div>

                  {/* Estatísticas e Ações Rápidas */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-neutral-800/80">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span>Pacotes Enviados: <strong className="text-white">{script.packetsSent}</strong></span>
                      <span>Interceptados: <strong className="text-emerald-400">{script.packetsBlocked}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Rastrear no Google Maps */}
                      <button
                        onClick={() => handleFetchGeoIntel({
                          ip: script.attackerIp,
                          city: script.originLocation,
                          datacenter: script.datacenter,
                          lat: script.originLat,
                          lng: script.originLng
                        })}
                        className="px-2.5 py-1 text-[11px] font-sans font-medium text-sky-300 hover:text-white bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 rounded flex items-center gap-1.5 transition-colors"
                      >
                        <MapPin className="h-3 w-3 text-rose-400" />
                        <span>Rastrear no Maps</span>
                      </button>

                      {/* Botão de Bloquear Rápido */}
                      {!isBlocked && (
                        <button
                          onClick={() => {
                            const blockRule: FirewallRule = {
                              id: 'block-' + Math.random().toString(36).slice(2, 6),
                              priority: 5,
                              name: `Bloquear Imediato ${script.name}`,
                              description: `Bloqueio manual disparado pelo operador contra IP ${script.attackerIp}`,
                              sourceIp: script.attackerIp,
                              destinationPort: 'ANY',
                              protocol: 'ANY',
                              action: 'DENY',
                              inspectionMode: 'PACKET_FILTER',
                              enabled: true,
                              hitCount: 1,
                              createdAt: 'Bloqueio Rápido'
                            };
                            setFirewallRules(prev => [blockRule, ...prev]);
                          }}
                          className="px-2.5 py-1 text-[11px] font-sans font-bold text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors"
                        >
                          Bloquear IP no Firewall
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: TABELAS E HARDENING DO BANCO DE DADOS */}
      {/* ========================================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-sm font-bold font-mono text-white dark:text-white light:text-neutral-950 uppercase flex items-center gap-2">
                <Database className="h-4 w-4 text-amber-400" />
                ESQUEMA DO BANCO DE DADOS & CONTROLES CRIPTOGRÁFICOS
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Estrutura das tabelas corporativas, campos sensíveis de clientes e armadilhas canário (Honeytokens).
              </p>
            </div>

            <button
              onClick={handleAddHoneytokenTable}
              className="px-3 py-1.5 text-xs font-mono font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-700/80 rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Implantar Tabela Canário (Honeytoken)</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {tables.map(table => (
              <div
                key={table.id}
                className={`p-4 rounded-lg border text-xs space-y-3 ${
                  table.isCanary 
                    ? 'border-amber-600/70 bg-amber-950/20' 
                    : 'border-neutral-800 bg-neutral-900/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className={`h-4 w-4 ${table.isCanary ? 'text-amber-400' : 'text-sky-400'}`} />
                    <span className="font-mono font-bold text-white text-sm">
                      {table.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    {table.recordsCount.toLocaleString()} linhas
                  </span>
                </div>

                {table.isCanary && (
                  <div className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-1 rounded border border-amber-800/80">
                    ARMADILHA CANÁRIO ATIVA · Dispara banimento imediato no firewall se consultada.
                  </div>
                )}

                <div className="space-y-1 font-mono text-[11px] divide-y divide-neutral-800/60">
                  {table.columns.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between pt-1 pb-1">
                      <span className="text-neutral-300 font-medium">
                        {col.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-500">{col.type}</span>
                        {col.isSensitive && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950/90 text-rose-300 border border-rose-800/60 font-bold">
                            SENSÍVEL
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 5: GEO-INTELIGÊNCIA & RASTREAMENTO NO GOOGLE MAPS (GROUNDING) */}
      {/* ========================================================================= */}
      {activeTab === 'geo-intel' && (
        <div className="space-y-6">
          <div className="border border-sky-800/60 bg-sky-950/20 p-5 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <MapPin className="h-4 w-4 text-rose-400" />
              <span className="font-bold uppercase tracking-wider">
                INTELIGÊNCIA GEOESPACIAL DE AMEAÇAS & INFRAESTRUTURA VIA GOOGLE MAPS
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Rastreamento de Origem de Ataques & Centros de Defesa (SOC / CSIRT)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Identifique no mapa as instalações físicas de provedores de trânsito, data centers de onde partem os scripts maliciosos ou localize centros de resposta a incidentes cibernéticos (CERT/CSIRT) para colaboração forense internacional. As consultas são fundamentadas em tempo real utilizando <strong>Gemini com a ferramenta Google Maps</strong>.
            </p>

            {/* Barra de Busca de Localização / IP */}
            <form onSubmit={handleSearchCustomGeo} className="pt-2 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={geoSearchQuery}
                  onChange={(e) => setGeoSearchQuery(e.target.value)}
                  placeholder="Pesquisar cidade, data center ou CERT (ex: São Paulo, Frankfurt, Equinix AMS3)..."
                  className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-neutral-950 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-sky-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-medium text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Consultar no Google Maps</span>
              </button>
            </form>
          </div>

          {/* Atalhos Rápidos para IPs de Atacantes Conhecidos */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase block">
              Atalhos de Origem dos Invasores Detectados:
            </span>
            <div className="flex flex-wrap gap-2">
              {attackScripts.map(script => (
                <button
                  key={script.id}
                  onClick={() => handleFetchGeoIntel({
                    ip: script.attackerIp,
                    city: script.originLocation,
                    datacenter: script.datacenter,
                    lat: script.originLat,
                    lng: script.originLng
                  })}
                  className="px-3 py-1.5 rounded border border-neutral-800 bg-neutral-900/60 hover:border-sky-500/80 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-rose-400" />
                  <span>{script.attackerIp} ({script.originLocation})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exibição do Resultado do Google Maps Grounding */}
          {geoIntelLoading ? (
            <div className="p-12 text-center rounded border border-neutral-800 bg-neutral-950/40 space-y-3">
              <RefreshCw className="h-6 w-6 text-sky-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-neutral-300">
                Consultando dados geoespaciais e instalações físicas no Google Maps...
              </p>
            </div>
          ) : geoIntelResult ? (
            <div className="border border-neutral-800 bg-neutral-950 p-6 rounded-lg space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    RELATÓRIO DE INTELIGÊNCIA GEOESPACIAL FUNDAMENTADA
                  </span>
                </div>
                {geoIntelResult.isSimulated && (
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Modo Sandbox de Defesa
                  </span>
                )}
              </div>

              {/* Texto explicativo gerado pelo modelo */}
              <div className="text-xs text-neutral-300 space-y-2 leading-relaxed whitespace-pre-wrap font-sans">
                {geoIntelResult.text}
              </div>

              {/* LISTA OBRIGATÓRIA DE LINKS DO GOOGLE MAPS EXTRAÍDOS DOS GROUNDING CHUNKS */}
              {geoIntelResult.mapsLinks && geoIntelResult.mapsLinks.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold uppercase">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    <span>LOCALIZAÇÕES VERIFICADAS NO GOOGLE MAPS:</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {geoIntelResult.mapsLinks.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-sky-500/80 transition-all flex items-start justify-between gap-3 group text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-semibold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            {link.title}
                          </span>
                          {link.address && (
                            <p className="text-[11px] text-neutral-400 font-sans">
                              {link.address}
                            </p>
                          )}
                          <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                            Abrir no Google Maps <ExternalLink className="h-2.5 w-2.5" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center rounded border border-dashed border-neutral-800 text-neutral-500 text-xs font-mono">
              Selecione um dos IPs dos invasores acima ou digite uma cidade para inspecionar no Google Maps.
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* BANNER DE CONCLUSÃO DO LABORATÓRIO (+300 XP) */}
      {/* ========================================================================= */}
      {labCompleted && (
        <div className="p-6 rounded-lg border border-emerald-500/80 bg-emerald-950/30 text-emerald-300 text-xs leading-relaxed space-y-3">
          <div className="flex items-center gap-2 font-bold font-mono text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>LABORATÓRIO CONCLUÍDO · BANCO DE DADOS TOTALMENTE BLINDADO (+300 XP)</span>
          </div>
          <p className="text-neutral-200">
            Parabéns, Operador! Você configurou com sucesso as <strong>Regras de Firewall (ACL)</strong>, ativou o <strong>WAF Anti-SQLi</strong>, monitorou o console de auditoria forense e mitigou 100% dos vetores de ataque automatizados. O banco de dados corporativo <strong>CyberVault Core</strong> agora opera com nível máximo de resiliência e integridade perimetral.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PARA ADICIONAR NOVA REGRA DE FIREWALL */}
      {/* ========================================================================= */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-neutral-800 bg-neutral-950 p-6 space-y-5 text-xs font-sans shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <span>CRIAR NOVA REGRA DE FIREWALL</span>
              </div>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewRule} className="space-y-4">
              
              <div>
                <label className="font-mono text-neutral-400 uppercase text-[11px] block mb-1">
                  Nome da Regra / Motivo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bloquear Botnet Frankfurt na porta 3306"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-neutral-400 uppercase text-[11px] block mb-1">
                    IP ou Subnet de Origem
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 185.220.101.5 ou 10.0.1.0/24 ou *"
                    value={newRuleIp}
                    onChange={(e) => setNewRuleIp(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-mono text-neutral-400 uppercase text-[11px] block mb-1">
                    Porta de Destino
                  </label>
                  <select
                    value={newRulePort}
                    onChange={(e) => setNewRulePort(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="3306">3306 (MySQL / Banco de Dados)</option>
                    <option value="5432">5432 (PostgreSQL)</option>
                    <option value="80">80 (HTTP Web)</option>
                    <option value="443">443 (HTTPS Web)</option>
                    <option value="ANY">QUALQUER PORTA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-neutral-400 uppercase text-[11px] block mb-1">
                    Ação da Regra
                  </label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DENY">DENY (Bloquear e Descartar Tráfego)</option>
                    <option value="ALLOW">ALLOW (Permitir Conexão)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-neutral-400 uppercase text-[11px] block mb-1">
                    Tipo de Inspeção
                  </label>
                  <select
                    value={newRuleInspection}
                    onChange={(e) => setNewRuleInspection(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PACKET_FILTER">Filtragem de Pacotes L3/L4</option>
                    <option value="WAF_SQLI">WAF Heurístico Anti-SQLi</option>
                    <option value="RATE_LIMIT">Rate Limiting de Conexão</option>
                    <option value="HONEYPOT_GUARD">Armadilha Canário (Honeytoken)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                >
                  Salvar e Aplicar Regra
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
