import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Lang = 'es' | 'en' | 'pt'
export const LANGS: { id: Lang; flag: string; label: string; speech: string }[] = [
  { id: 'es', flag: '🇨🇴', label: 'Español', speech: 'es-ES' },
  { id: 'en', flag: '🇺🇸', label: 'English', speech: 'en-US' },
  { id: 'pt', flag: '🇧🇷', label: 'Português', speech: 'pt-BR' },
]

// key, español, english, português.  Frases con "|" = varias opciones al azar. {n}=niño, {c}=mascota
const rows: [string, string, string, string][] = [
  ['app', 'Aprende Jugando', 'Learn by Playing', 'Aprender Brincando'],
  ['tag', '¡Aprende, juega y crece con tu amigo!', 'Learn, play and grow with your buddy!', 'Aprenda, brinque e cresça com seu amigo!'],
  ['login', 'Entrar', 'Log in', 'Entrar'],
  ['reg', 'Crear cuenta', 'Sign up', 'Criar conta'],
  ['email', 'Correo de papá o mamá', 'Parent email', 'E-mail dos pais'],
  ['pass', 'Contraseña', 'Password', 'Senha'],
  ['pname', 'Nombre del adulto', 'Adult name', 'Nome do adulto'],
  ['to_reg', '¿Primera vez? Regístrate', 'First time? Sign up', 'Primeira vez? Cadastre-se'],
  ['to_login', '¿Ya tienes cuenta? Entra', 'Have an account? Log in', 'Já tem conta? Entre'],
  ['e_cred', 'Correo o contraseña incorrectos', 'Wrong email or password', 'E-mail ou senha incorretos'],
  ['e_exist', 'Ese correo ya está registrado', 'That email is already registered', 'Este e-mail já está cadastrado'],
  ['e_fill', 'Completa todo (contraseña de 4 o más caracteres)', 'Fill everything in (password 4+ characters)', 'Preencha tudo (senha com 4 ou mais caracteres)'],
  ['who', '¿Quién va a jugar?', 'Who is playing?', 'Quem vai brincar?'],
  ['addkid', 'Agregar niño o niña', 'Add a child', 'Adicionar criança'],
  ['kname', 'Nombre del niño o niña', 'Child name', 'Nome da criança'],
  ['age', 'Edad', 'Age', 'Idade'],
  ['pickc', 'Elige a tu amigo', 'Choose your buddy', 'Escolha seu amigo'],
  ['save', '¡Listo!', 'Done!', 'Pronto!'],
  ['out', 'Salir', 'Log out', 'Sair'],
  ['back', 'Volver', 'Back', 'Voltar'],
  ['map', 'Mapa', 'Map', 'Mapa'],
  ['shop', 'Tienda', 'Shop', 'Loja'],
  ['prog', 'Mi progreso', 'My progress', 'Meu progresso'],
  ['ach', 'Logros', 'Awards', 'Conquistas'],
  ['choose', 'Escoge un mundo para aprender jugando', 'Pick a world and learn by playing', 'Escolha um mundo para aprender brincando'],
  ['w_letters', 'Mundo de las Letras', 'Letter World', 'Mundo das Letras'],
  ['w_reading', 'Mundo de la Lectura', 'Reading World', 'Mundo da Leitura'],
  ['w_numbers', 'Mundo de los Números', 'Number World', 'Mundo dos Números'],
  ['w_dinosaurs', 'Valle de los Dinosaurios', 'Dinosaur Valley', 'Vale dos Dinossauros'],
  ['w_thinking', 'Juegos para Pensar', 'Thinking Games', 'Jogos de Pensar'],
  ['play', '¡Jugar!', 'Play!', 'Jogar!'],
  ['level', 'Nivel', 'Level', 'Nível'],
  ['ql1', '¿Con qué letra empieza?', 'What letter does it start with?', 'Com que letra começa?'],
  ['ql2', 'Completa la palabra', 'Complete the word', 'Complete a palavra'],
  ['qr1', '¿Qué palabra es?', 'Which word is it?', 'Qual é a palavra?'],
  ['qr2', '¿Cuál es el dibujo?', 'Which picture is it?', 'Qual é o desenho?'],
  ['qn1', '¿Cuántos hay?', 'How many are there?', 'Quantos tem?'],
  ['qn2', '¿Cuánto es?', 'What is the answer?', 'Quanto é?'],
  ['qd', '¿Qué sigue?', 'What comes next?', 'O que vem depois?'],
  ['qt', '¿Cuál es diferente?', 'Which one is different?', 'Qual é diferente?'],
  ['done', '¡Actividad lograda!', 'Activity complete!', 'Atividade concluída!'],
  ['cont', 'Continuar', 'Continue', 'Continuar'],
  ['acc', 'Aciertos', 'Accuracy', 'Acertos'],
  ['tries', 'Intentos', 'Attempts', 'Tentativas'],
  ['streak', 'Días seguidos', 'Day streak', 'Dias seguidos'],
  ['mins', 'Minutos', 'Minutes', 'Minutos'],
  ['curve', 'Curva de aprendizaje', 'Learning curve', 'Curva de aprendizagem'],
  ['curve_h', 'Aciertos (promedio móvil de 5 intentos)', 'Accuracy (5-attempt moving average)', 'Acertos (média móvel de 5 tentativas)'],
  ['nodata', 'Juega unas actividades para ver la curva', 'Play a few activities to see the curve', 'Jogue algumas atividades para ver a curva'],
  ['up', '¡Va mejorando! 📈', 'Getting better! 📈', 'Melhorando! 📈'],
  ['flat', 'Estable 👍', 'Steady 👍', 'Estável 👍'],
  ['down', 'Necesita refuerzo 💪', 'Needs practice 💪', 'Precisa reforçar 💪'],
  ['byw', 'Dominio por mundo', 'Mastery by world', 'Domínio por mundo'],
  ['reinf', 'Para reforzar:', 'To practice:', 'Para reforçar:'],
  ['csv', 'Descargar CSV', 'Download CSV', 'Baixar CSV'],
  ['buy', 'Comprar', 'Buy', 'Comprar'],
  ['equip', 'Poner', 'Equip', 'Usar'],
  ['on', 'Puesto', 'Equipped', 'Em uso'],
  ['a_first', 'Primer paso', 'First step', 'Primeiro passo'],
  ['a_let', 'Amigo de las letras', 'Letter buddy', 'Amigo das letras'],
  ['a_num', 'Genio de números', 'Number whiz', 'Gênio dos números'],
  ['a_rd', 'Gran lector', 'Great reader', 'Grande leitor'],
  ['a_exp', 'Explorador', 'Explorer', 'Explorador'],
  ['a_str', '5 seguidos', '5 in a row', '5 seguidos'],
  ['talk', 'Háblame…', 'Talk to me…', 'Fale comigo…'],
  ['hi', '¡Hola {n}! Soy {c}, ¡qué alegría verte!|¡Qué bueno verte, {n}! ¿Jugamos?|¡Hola, {n}! Hoy vamos a aprender cosas increíbles.',
    "Hello {n}! I'm {c}, so happy to see you!|Great to see you, {n}! Shall we play?|Hi {n}! Today we'll learn amazing things.",
    'Olá, {n}! Eu sou {c}. Que alegria te ver!|Que bom te ver, {n}! Vamos brincar?|Oi, {n}! Hoje vamos aprender coisas incríveis.'],
  ['ok', '¡Excelente, {n}!|¡Lo lograste! Eres genial.|¡Muy bien! Estoy muy orgulloso de ti.|¡Bravo! ¡Qué inteligente eres!|¡Increíble, {n}! ¡Sigue así!',
    'Excellent, {n}!|You did it! You are awesome.|Very good! I am so proud of you.|Bravo! You are so smart!|Amazing, {n}! Keep it up!',
    'Excelente, {n}!|Você conseguiu! Você é demais.|Muito bem! Estou muito orgulhoso de você.|Bravo! Que inteligente você é!|Incrível, {n}! Continue assim!'],
  ['no', 'Casi lo logras, ¡intentemos otra vez!|No pasa nada, equivocarse es aprender.|¡Tú puedes, {n}! Inténtalo de nuevo.|Respira y mira con calma, ¡confío en ti!',
    'Almost! Let us try again.|It is okay, mistakes help us learn.|You can do it, {n}! Try again.|Take a breath and look closely, I believe in you!',
    'Quase! Vamos tentar de novo.|Tudo bem, errar faz parte de aprender.|Você consegue, {n}! Tente outra vez.|Respire e olhe com calma, eu confio em você!'],
  ['win', '¡Terminaste la actividad! ¡Eres un campeón, {n}!|¡Ganaste estrellas! ¡Qué gran trabajo!',
    'You finished the activity! You are a champion, {n}!|You won stars! What great work!',
    'Você terminou a atividade! Você é um campeão, {n}!|Você ganhou estrelas! Que trabalho incrível!'],
  ['cheer', '¡Tú puedes con todo, {n}!|¡Cada día aprendes más!|¡Aprender requiere valentía y tú la tienes!|¡Me encanta jugar contigo!|¡Estoy orgulloso de ti!',
    'You can do anything, {n}!|You learn more every day!|Learning takes courage, and you have it!|I love playing with you!|I am proud of you!',
    'Você consegue tudo, {n}!|A cada dia você aprende mais!|Aprender exige coragem e você tem!|Eu adoro brincar com você!|Estou orgulhoso de você!'],
  ['c_how', '¡Feliz de jugar contigo! ¿Y tú?', "I'm happy playing with you! And you?", 'Estou feliz brincando com você! E você?'],
  ['c_love', '¡Yo también te quiero mucho, {n}!', 'I like you very much too, {n}!', 'Eu também gosto muito de você, {n}!'],
  ['c_sad', 'Un abrazo fuerte. Descansa un poquito y seguimos, ¡tú puedes!', 'Big hug. Rest a little and then we continue, you can do it!', 'Um abraço forte. Descanse um pouquinho e continuamos, você consegue!'],
  ['c_thx', '¡De nada, {n}!', "You're welcome, {n}!", 'De nada, {n}!'],
]
const D: Record<Lang, Record<string, string>> = { es: {}, en: {}, pt: {} }
rows.forEach(([k, es, en, pt]) => { D.es[k] = es; D.en[k] = en; D.pt[k] = pt })

type Vars = Record<string, string>
const Ctx = createContext({ lang: 'es' as Lang, setLang: (_: Lang) => {}, t: (k: string, _v?: Vars) => k })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem('ak_lang') as Lang) || 'es' } catch { return 'es' }
  })
  useEffect(() => {
    try { localStorage.setItem('ak_lang', lang) } catch {}
    document.documentElement.lang = lang
  }, [lang])
  const t = (k: string, v: Vars = {}) => (D[lang][k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '')
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}
export const useI18n = () => useContext(Ctx)

export function LangSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="inline-flex gap-1 bg-white/90 p-1 rounded-full border-2 border-yellow-300 shadow">
      {LANGS.map((l) => (
        <button key={l.id} onClick={() => setLang(l.id)} title={l.label} aria-label={l.label}
          className={`px-2.5 py-1 rounded-full text-lg font-black cursor-pointer transition ${lang === l.id ? 'bg-yellow-300 scale-110' : 'hover:bg-slate-100'}`}>
          {l.flag}
        </button>
      ))}
    </div>
  )
}
