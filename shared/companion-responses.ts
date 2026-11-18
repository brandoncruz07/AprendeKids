export type CompanionLanguage = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'zh' | 'hi' | 'ar' | 'ja' | 'ko'
export type WorldId = 'letters' | 'reading' | 'numbers' | 'dinosaurs' | 'thinking'

type ReplyType = 'greeting' | 'thanks' | 'goodbye' | 'help' | 'bored' | 'happy' | 'privacy' | 'care'
type Topic = ReplyType | WorldId | 'default'
type ReplyBank = Record<Topic, readonly string[]>

export const COMPANION_CONVERSATIONS: Record<CompanionLanguage, ReplyBank> = {
  es: {
    greeting: ['¡Hola! Me alegra verte. ¿Qué mundo quieres explorar?', '¡Hola! Podemos aprender con letras, cuentos, números o dinosaurios.'],
    thanks: ['¡De nada! Me gusta aprender contigo.', '¡Con gusto! ¿Qué juego quieres probar ahora?'],
    goodbye: ['¡Hasta luego! Puedes volver a jugar cuando quieras.', '¡Chao! Que tengas un día lleno de descubrimientos.'],
    help: ['Miremos la pista del juego y probemos paso a paso.', '¡Vamos con calma! Lee la pregunta otra vez y busca una pista.'],
    bored: ['¿Exploramos otro mundo o intentamos un nivel nuevo?', 'Podemos buscar parejas, seguir un patrón o contar objetos.'],
    happy: ['¡Qué bueno! ¿Qué fue lo más divertido que aprendiste?', '¡Me alegra! Cuéntame qué juego te gustó más.'],
    letters: ['En el mundo de las letras, escucha el sonido y busca una palabra que empiece igual.', '¡Juguemos con letras! ¿Qué palabra puedes formar con las pistas?'],
    reading: ['En el mundo de la lectura, mira los dibujos y piensa qué pasa primero.', '¡Vamos a leer! Una palabra del cuento puede ayudarte a encontrar la respuesta.'],
    numbers: ['En el mundo de los números, cuenta despacito y compara los grupos.', '¡A practicar números! Puedes contar los dibujos uno por uno.'],
    dinosaurs: ['En el valle de los dinosaurios, busca huellas y cuenta los fósiles.', '¡Exploradores! Observa los dinosaurios y descubre cuál es diferente.'],
    thinking: ['En los juegos para pensar, mira el patrón y busca qué figura sigue.', '¡Usa tu memoria! Observa las cartas y busca las parejas iguales.'],
    privacy: ['No compartas datos personales conmigo. ¡Mejor juguemos con letras o números!'],
    care: ['Gracias por contármelo. Busca ahora a una persona adulta de confianza que pueda ayudarte.'],
    default: ['Puedo conversar sobre letras, lectura, números, dinosaurios y juegos para pensar. ¿Cuál escoges?', 'Elige un mundo en el mapa y te daré una idea para jugar.']
  },
  en: {
    greeting: ['Hello! I am glad you are here. Which world shall we explore?', 'Hi! We can learn with letters, stories, numbers, or dinosaurs.'],
    thanks: ['You are welcome! I like learning with you.', 'Anytime! Which game would you like to try next?'],
    goodbye: ['See you later! You can come back and play any time.', 'Bye! Have a day full of discoveries.'],
    help: ['Let us look at the game hint and try one step at a time.', 'Take your time. Read the question again and look for a clue.'],
    bored: ['Shall we explore another world or try a new level?', 'We can match pairs, follow a pattern, or count objects.'],
    happy: ['That is great! What was the most fun thing you learned?', 'I am glad! Which game did you like best?'],
    letters: ['In Letter World, listen to the sound and find a word that starts the same way.', 'Let us play with letters! What word can you make from the clues?'],
    reading: ['In Reading World, look at the pictures and think about what happens first.', 'Let us read! A word in the story may help you find the answer.'],
    numbers: ['In Number World, count slowly and compare the groups.', 'Let us practice numbers! You can count the pictures one by one.'],
    dinosaurs: ['In Dinosaur Valley, look for footprints and count the fossils.', 'Explorer, look at the dinosaurs and find which one is different.'],
    thinking: ['In Thinking Games, look at the pattern and find the next shape.', 'Use your memory! Look at the cards and find matching pairs.'],
    privacy: ['Please do not share personal information with me. Let us play with letters or numbers instead.'],
    care: ['Thank you for telling me. Please find a trusted grown-up nearby who can help you.'],
    default: ['I can chat about letters, reading, numbers, dinosaurs, and thinking games. Which would you like?', 'Choose a world on the map and I will share an idea for a game.']
  },
  pt: {
    greeting: ['Olá! Que bom que você chegou. Qual mundo vamos explorar?', 'Oi! Podemos aprender com letras, histórias, números ou dinossauros.'],
    thanks: ['Por nada! Gosto de aprender com você.', 'De nada! Qual jogo você quer experimentar agora?'],
    goodbye: ['Até logo! Você pode voltar para brincar quando quiser.', 'Tchau! Tenha um dia cheio de descobertas.'],
    help: ['Vamos olhar a dica do jogo e tentar passo a passo.', 'Sem pressa. Leia a pergunta de novo e procure uma pista.'],
    bored: ['Vamos explorar outro mundo ou tentar um nível novo?', 'Podemos encontrar pares, seguir um padrão ou contar objetos.'],
    happy: ['Que legal! O que foi mais divertido de aprender?', 'Fico feliz! De qual jogo você gostou mais?'],
    letters: ['No Mundo das Letras, ouça o som e procure uma palavra que comece igual.', 'Vamos brincar com letras! Que palavra você consegue formar com as pistas?'],
    reading: ['No Mundo da Leitura, olhe os desenhos e pense no que acontece primeiro.', 'Vamos ler! Uma palavra da história pode ajudar você a encontrar a resposta.'],
    numbers: ['No Mundo dos Números, conte devagar e compare os grupos.', 'Vamos praticar números! Você pode contar os desenhos um por um.'],
    dinosaurs: ['No Vale dos Dinossauros, procure pegadas e conte os fósseis.', 'Explorador, observe os dinossauros e descubra qual é diferente.'],
    thinking: ['Nos Jogos de Pensar, observe o padrão e descubra qual forma vem depois.', 'Use a memória! Observe as cartas e encontre os pares iguais.'],
    privacy: ['Não compartilhe informações pessoais comigo. Vamos brincar com letras ou números.'],
    care: ['Obrigado por me contar. Procure um adulto de confiança que possa ajudar você.'],
    default: ['Posso conversar sobre letras, leitura, números, dinossauros e jogos de pensar. Qual você escolhe?', 'Escolha um mundo no mapa e vou sugerir uma brincadeira.']
  },
  fr: {
    greeting: ['Bonjour ! Je suis content de te voir. Quel monde veux-tu explorer ?', 'Salut ! Apprenons avec des lettres, des histoires, des nombres ou des dinosaures.'],
    thanks: ['Avec plaisir ! J’aime apprendre avec toi.', 'De rien ! Quel jeu veux-tu essayer maintenant ?'],
    goodbye: ['À bientôt ! Tu peux revenir jouer quand tu veux.', 'Au revoir ! Que ta journée soit pleine de découvertes.'],
    help: ['Regardons l’indice du jeu et avançons étape par étape.', 'Prends ton temps. Relis la question et cherche un indice.'],
    bored: ['Explorons un autre monde ou essayons un nouveau niveau ?', 'On peut trouver des paires, suivre un motif ou compter des objets.'],
    happy: ['Super ! Qu’as-tu préféré apprendre ?', 'Je suis content ! Quel jeu as-tu préféré ?'],
    letters: ['Dans le monde des lettres, écoute le son et cherche un mot qui commence pareil.', 'Jouons avec les lettres ! Quel mot peux-tu former avec les indices ?'],
    reading: ['Dans le monde de la lecture, regarde les images et pense à ce qui arrive en premier.', 'Un mot de l’histoire peut t’aider à trouver la réponse.'],
    numbers: ['Dans le monde des nombres, compte doucement et compare les groupes.', 'Entraînons-nous à compter les images une par une.'],
    dinosaurs: ['Dans la vallée des dinosaures, cherche des traces et compte les fossiles.', 'Observe les dinosaures et trouve celui qui est différent.'],
    thinking: ['Dans les jeux de réflexion, observe le motif et trouve la forme suivante.', 'Utilise ta mémoire pour retrouver les cartes identiques.'],
    privacy: ['Ne partage pas tes informations personnelles. Jouons plutôt avec les lettres ou les chiffres.'],
    care: ['Merci de me l’avoir dit. Va chercher un adulte de confiance près de toi pour t’aider.'],
    default: ['Parlons des lettres, de la lecture, des nombres, des dinosaures ou des jeux de réflexion. Que choisis-tu ?', 'Choisis un monde sur la carte et je te proposerai une idée de jeu.']
  },
  de: {
    greeting: ['Hallo! Schön, dass du da bist. Welche Welt möchtest du erkunden?', 'Hallo! Wir können mit Buchstaben, Geschichten, Zahlen oder Dinosauriern lernen.'],
    thanks: ['Gern geschehen! Ich lerne gern mit dir.', 'Sehr gern! Welches Spiel möchtest du als Nächstes ausprobieren?'],
    goodbye: ['Bis später! Du kannst jederzeit wieder spielen.', 'Tschüss! Hab einen Tag voller Entdeckungen.'],
    help: ['Schauen wir auf den Spielhinweis und gehen Schritt für Schritt vor.', 'Lass dir Zeit. Lies die Frage noch einmal und suche einen Hinweis.'],
    bored: ['Wollen wir eine andere Welt erkunden oder ein neues Level versuchen?', 'Wir können Paare finden, ein Muster fortsetzen oder Dinge zählen.'],
    happy: ['Wie schön! Was hat dir beim Lernen am meisten Spaß gemacht?', 'Das freut mich! Welches Spiel mochtest du am liebsten?'],
    letters: ['Höre in der Buchstabenwelt auf den Laut und suche ein Wort mit demselben Anfang.', 'Spielen wir mit Buchstaben! Welches Wort kannst du aus den Hinweisen bilden?'],
    reading: ['Schau dir in der Lesewelt die Bilder an und überlege, was zuerst passiert.', 'Ein Wort aus der Geschichte kann dir bei der Antwort helfen.'],
    numbers: ['Zähle in der Zahlenwelt langsam und vergleiche die Gruppen.', 'Üben wir Zahlen! Du kannst die Bilder einzeln zählen.'],
    dinosaurs: ['Suche im Dinosauriertal nach Spuren und zähle die Fossilien.', 'Schau dir die Dinosaurier an und finde heraus, welcher anders ist.'],
    thinking: ['Achte bei den Denkspielen auf das Muster und finde die nächste Form.', 'Nutze dein Gedächtnis und suche gleiche Karten.'],
    privacy: ['Teile keine persönlichen Daten mit mir. Lass uns lieber mit Buchstaben oder Zahlen spielen.'],
    care: ['Danke, dass du es mir erzählt hast. Bitte suche eine vertraute erwachsene Person in deiner Nähe.'],
    default: ['Wir können über Buchstaben, Lesen, Zahlen, Dinosaurier und Denkspiele sprechen. Was wählst du?', 'Wähle eine Welt auf der Karte und ich schlage dir ein Spiel vor.']
  },
  zh: {
    greeting: ['你好！很高兴见到你。你想探索哪个世界？', '嗨！我们可以用字母、故事、数字或恐龙来学习。'],
    thanks: ['不客气！我喜欢和你一起学习。', '不用谢！你现在想玩哪个游戏？'],
    goodbye: ['再见！欢迎随时回来玩。', '拜拜！祝你今天有很多新发现。'],
    help: ['我们看看游戏提示，一步一步来。', '别着急，再读一次问题，找找线索。'],
    bored: ['我们去探索另一个世界，还是试试新关卡？', '我们可以找配对、接着排图案，或者数一数。'],
    happy: ['真棒！你今天学到什么最开心？', '我很高兴！你最喜欢哪个游戏？'],
    letters: ['在字母世界里，听听字母的声音，找一个开头相同的词。', '我们来玩字母吧！根据线索可以拼出什么词？'],
    reading: ['在阅读世界里看看图片，想一想哪件事先发生。', '故事里的一个词语也许能帮你找到答案。'],
    numbers: ['在数字世界里慢慢数一数，再比较两组。', '我们来练习数字吧！可以一张一张地数图片。'],
    dinosaurs: ['在恐龙山谷里找找脚印，再数一数化石。', '看看这些恐龙，找出不一样的那一个。'],
    thinking: ['在思考游戏里看看图案，找出下一个形状。', '用你的记忆力找出相同的卡片吧。'],
    privacy: ['不要告诉我个人信息。我们来玩字母或数字吧。'],
    care: ['谢谢你告诉我。请去找一位值得信任的大人来帮助你。'],
    default: ['我们可以聊字母、阅读、数字、恐龙和思考游戏。你想选哪个？', '在地图上选一个世界，我会给你一个游戏点子。']
  },
  hi: {
    greeting: ['नमस्ते! तुम्हें देखकर अच्छा लगा। तुम कौन-सी दुनिया देखना चाहोगे?', 'हैलो! हम अक्षरों, कहानियों, संख्याओं या डायनासोर से सीख सकते हैं।'],
    thanks: ['तुम्हारा स्वागत है! तुम्हारे साथ सीखना अच्छा लगता है।', 'कोई बात नहीं! अब कौन-सा खेल खेलना चाहोगे?'],
    goodbye: ['फिर मिलेंगे! जब चाहो वापस आकर खेलना।', 'अलविदा! तुम्हारा दिन नई खोजों से भरा हो।'],
    help: ['खेल का संकेत देखते हैं और एक-एक कदम करके कोशिश करते हैं।', 'आराम से। सवाल फिर पढ़ो और कोई संकेत ढूँढ़ो।'],
    bored: ['दूसरी दुनिया देखें या नया स्तर आज़माएँ?', 'हम जोड़े ढूँढ़ सकते हैं, क्रम पूरा कर सकते हैं या चीज़ें गिन सकते हैं।'],
    happy: ['बहुत अच्छा! सीखने में तुम्हें सबसे मज़ेदार क्या लगा?', 'मुझे खुशी हुई! तुम्हें कौन-सा खेल सबसे पसंद आया?'],
    letters: ['अक्षरों की दुनिया में आवाज़ सुनो और उसी आवाज़ से शुरू होने वाला शब्द ढूँढ़ो।', 'अक्षरों से खेलें! संकेतों से कौन-सा शब्द बना सकते हो?'],
    reading: ['पढ़ने की दुनिया में चित्र देखो और सोचो कि पहले क्या होता है।', 'कहानी का कोई शब्द उत्तर ढूँढ़ने में मदद कर सकता है।'],
    numbers: ['संख्याओं की दुनिया में धीरे-धीरे गिनो और समूहों की तुलना करो।', 'चलो संख्याएँ सीखें! चित्रों को एक-एक करके गिनो।'],
    dinosaurs: ['डायनासोर घाटी में पैरों के निशान ढूँढ़ो और जीवाश्म गिनो।', 'डायनासोरों को ध्यान से देखो और अलग वाला ढूँढ़ो।'],
    thinking: ['सोचने वाले खेल में क्रम देखो और अगला आकार ढूँढ़ो।', 'याददाश्त का उपयोग करके एक जैसी तस्वीरें मिलाओ।'],
    privacy: ['मुझे निजी जानकारी न बताएं। चलो अक्षरों या संख्याओं से खेलते हैं।'],
    care: ['मुझे बताने के लिए धन्यवाद। कृपया किसी भरोसेमंद बड़े व्यक्ति से मदद लें।'],
    default: ['हम अक्षरों, पढ़ने, संख्याओं, डायनासोर और सोचने वाले खेलों पर बात कर सकते हैं। क्या चुनोगे?', 'नक्शे पर एक दुनिया चुनो और मैं खेल का सुझाव दूँगा।']
  },
  ar: {
    greeting: ['مرحبًا! يسعدني أن أراك. أي عالم تريد استكشافه؟', 'أهلًا! يمكننا التعلّم بالحروف والقصص والأرقام والديناصورات.'],
    thanks: ['على الرحب والسعة! أحب التعلّم معك.', 'لا شكر على واجب! أي لعبة تريد أن تجرّب الآن؟'],
    goodbye: ['إلى اللقاء! يمكنك العودة للعب متى شئت.', 'وداعًا! أتمنى لك يومًا مليئًا بالاكتشافات.'],
    help: ['لننظر إلى تلميح اللعبة ونجرب خطوة خطوة.', 'خذ وقتك. اقرأ السؤال مرة أخرى وابحث عن دليل.'],
    bored: ['هل نستكشف عالمًا آخر أم نجرب مستوى جديدًا؟', 'يمكننا إيجاد الأزواج أو متابعة نمط أو عدّ الأشياء.'],
    happy: ['رائع! ما أكثر شيء ممتع تعلمته؟', 'يسعدني ذلك! أي لعبة أحببت أكثر؟'],
    letters: ['في عالم الحروف، استمع إلى الصوت وابحث عن كلمة تبدأ بالصوت نفسه.', 'هيا نلعب بالحروف! ما الكلمة التي تساعدنا التلميحات على تكوينها؟'],
    reading: ['في عالم القراءة، انظر إلى الصور وفكر فيما يحدث أولًا.', 'قد تساعدك كلمة من القصة في إيجاد الإجابة.'],
    numbers: ['في عالم الأرقام، عُدّ بهدوء وقارن بين المجموعات.', 'لنتدرّب على الأرقام! عُدّ الصور واحدة تلو الأخرى.'],
    dinosaurs: ['في وادي الديناصورات، ابحث عن آثار الأقدام وعُدّ الأحافير.', 'انظر إلى الديناصورات واكتشف أيّها مختلف.'],
    thinking: ['في ألعاب التفكير، لاحظ النمط وابحث عن الشكل التالي.', 'استخدم ذاكرتك للعثور على البطاقات المتطابقة.'],
    privacy: ['لا تشارك معلوماتك الشخصية معي. هيا نلعب بالحروف أو الأرقام.'],
    care: ['شكرًا لأنك أخبرتني. ابحث عن شخص بالغ تثق به ليساعدك.'],
    default: ['يمكننا التحدث عن الحروف والقراءة والأرقام والديناصورات وألعاب التفكير. ماذا تختار؟', 'اختر عالمًا من الخريطة وسأقترح عليك لعبة.']
  },
  ja: {
    greeting: ['こんにちは！会えてうれしいよ。どの世界を探検する？', 'やあ！文字、お話、数字、恐竜で楽しく学ぼう。'],
    thanks: ['どういたしまして！いっしょに学べてうれしいよ。', 'いつでもどうぞ！次はどのゲームをする？'],
    goodbye: ['またね！いつでも遊びに来てね。', 'バイバイ！新しい発見がいっぱいの一日になりますように。'],
    help: ['ゲームのヒントを見て、一つずつ試してみよう。', 'ゆっくりで大丈夫。問題をもう一度読んでヒントを探そう。'],
    bored: ['別の世界を探検する？それとも新しいレベルに挑戦する？', 'ペア探し、パターン、ものを数えるゲームができるよ。'],
    happy: ['よかったね！何を学ぶのが一番楽しかった？', 'うれしいな！どのゲームが一番好きだった？'],
    letters: ['文字の世界で音を聞いて、同じ音から始まる言葉を探そう。', '文字で遊ぼう！ヒントからどんな言葉が作れるかな？'],
    reading: ['読書の世界で絵を見て、最初に何が起きるか考えよう。', 'お話の中の言葉が答えを見つけるヒントになるよ。'],
    numbers: ['数字の世界でゆっくり数えて、グループをくらべよう。', '数字の練習をしよう！絵を一つずつ数えてみてね。'],
    dinosaurs: ['恐竜の谷で足あとを探して、化石を数えてみよう。', '恐竜をよく見て、ちがうものを探そう。'],
    thinking: ['考えるゲームでパターンを見て、次の形を見つけよう。', '記憶を使って同じカードを見つけよう。'],
    privacy: ['個人情報は教えないでね。文字や数字で遊ぼう！'],
    care: ['話してくれてありがとう。信頼できる大人に助けてもらおう。'],
    default: ['文字、読書、数字、恐竜、考えるゲームのお話ができるよ。どれにする？', 'マップで世界を選んでね。ゲームのアイデアを紹介するよ。']
  },
  ko: {
    greeting: ['안녕! 만나서 반가워. 어떤 세계를 탐험할까?', '안녕! 글자, 이야기, 숫자, 공룡과 함께 배워 보자.'],
    thanks: ['천만에! 너와 함께 배우는 게 좋아.', '언제든지! 이제 어떤 게임을 해 볼까?'],
    goodbye: ['또 만나! 언제든 돌아와서 놀아도 돼.', '잘 가! 새로운 발견이 가득한 하루 보내.'],
    help: ['게임 힌트를 보고 한 단계씩 해 보자.', '천천히 해도 괜찮아. 문제를 다시 읽고 단서를 찾아보자.'],
    bored: ['다른 세계를 탐험할까, 새 레벨을 해 볼까?', '짝 맞추기, 패턴 잇기, 물건 세기를 해 볼 수 있어.'],
    happy: ['정말 좋다! 무엇을 배울 때 가장 재미있었어?', '기뻐! 어떤 게임이 가장 좋았어?'],
    letters: ['글자 세계에서 소리를 듣고 같은 소리로 시작하는 말을 찾아보자.', '글자로 놀아 보자! 힌트로 어떤 말을 만들 수 있을까?'],
    reading: ['읽기 세계에서 그림을 보고 무엇이 먼저 일어나는지 생각해 봐.', '이야기 속 낱말이 답을 찾는 데 도움이 될 수 있어.'],
    numbers: ['숫자 세계에서 천천히 세고 두 묶음을 비교해 보자.', '숫자를 연습하자! 그림을 하나씩 세어 봐.'],
    dinosaurs: ['공룡 골짜기에서 발자국을 찾고 화석을 세어 보자.', '공룡들을 잘 보고 다른 하나를 찾아보자.'],
    thinking: ['생각 게임에서 패턴을 보고 다음 모양을 찾아보자.', '기억력을 사용해 같은 카드를 찾아보자.'],
    privacy: ['개인정보를 알려주지 마세요. 글자나 숫자로 함께 놀아요!'],
    care: ['말해 줘서 고마워요. 가까이에 있는 믿을 수 있는 어른에게 도움을 요청해요.'],
    default: ['글자, 읽기, 숫자, 공룡, 생각 게임에 대해 이야기할 수 있어. 무엇을 고를래?', '지도에서 세계를 골라 봐. 게임 아이디어를 알려 줄게.']
  }
}

const INTENTS: Partial<Record<ReplyType, RegExp>> = {
  greeting: /\b(hola|hello|hi|hey|oi|ola|bonjour|salut|hallo)\b/i,
  thanks: /\b(gracias|thank you|thanks|obrigado|obrigada|merci|danke|danke schon)\b/i,
  goodbye: /\b(adios|hasta luego|chao|bye|goodbye|see you|tchau|au revoir|tschuss)\b/i,
  help: /\b(ayuda|ayudame|help|please help|ajuda|me ajude|aide|hilfe)\b/i,
  bored: /\b(aburrid|bored|entediad|ennui|langweil)\b/i,
  happy: /\b(feliz|content|alegre|happy|glad|excited|contente|heureux|glucklich)\b/i
}

const TOPICS: Record<WorldId, RegExp> = {
  letters: /\b(letra|letras|alfabeto|letter|letters|alphabet)\b/i,
  reading: /\b(lectura|leer|cuento|libro|reading|read|story|book|leitura|ler|histoire|lesen)\b/i,
  numbers: /\b(numero|numeros|contar|cuenta|number|numbers|count|math|nombre|zahl|zahlen)\b/i,
  dinosaurs: /\b(dinosaurio|dinosaurios|dino|dinosaur|dinosaurs|dinossauro|dinosaures)\b/i,
  thinking: /\b(pensar|memoria|patron|patrones|thinking|memory|pattern|puzzle|penser|gedachtnis)\b/i
}

const NON_LATIN_TERMS: Partial<Record<ReplyType, string[]>> = {
  greeting: ['你好', '嗨', 'नमस्ते', 'سلام', 'こんにちは', '안녕'],
  thanks: ['谢谢', 'धन्यवाद', 'شكرا', 'ありがとう', '고마워'],
  goodbye: ['再见', '拜拜', 'अलविदा', 'مع السلامة', 'さようなら', '안녕히'],
  help: ['帮助', '帮帮我', 'मदद', 'सहायता', 'ساعدني', '助けて', '도와줘'],
  bored: ['无聊', 'बोर', 'ملل', '退屈', '심심'],
  happy: ['开心', '高兴', 'खुश', 'संतुष्ट', 'سعيد', 'うれしい', '행복']
}

const NON_LATIN_TOPICS: Record<WorldId, string[]> = {
  letters: ['字母', 'अक्षर', 'حرف', 'حروف', '文字', '글자'],
  reading: ['阅读', '故事', 'पढ़', 'قصة', '読む', '読み', '읽기'],
  numbers: ['数字', 'गिन', 'رقم', '数', '숫자'],
  dinosaurs: ['恐龙', 'डायनासोर', 'ديناصور', '恐竜', '공룡'],
  thinking: ['思考', '记忆', 'पैटर्न', 'ذاكرة', '考える', '기억']
}

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

function selectReply(replies: readonly string[], input: string) {
  const seed = [...input].reduce((value, character) => value + (character.codePointAt(0) ?? 0), 0)
  return replies[seed % replies.length]
}

export function replyForMessage(
  messageOrKind: string,
  language: CompanionLanguage,
  worldId?: WorldId
) {
  const normalized = normalize(messageOrKind)
  const isDirectKind = Object.prototype.hasOwnProperty.call(COMPANION_CONVERSATIONS[language], messageOrKind)
  let topic: Topic = isDirectKind ? messageOrKind as Topic : 'default'

  if (!isDirectKind) {
    const intent = (Object.entries(INTENTS) as [ReplyType, RegExp][])
      .find(([kind, pattern]) =>
        pattern.test(normalized) || (NON_LATIN_TERMS[kind] ?? []).some((term) => messageOrKind.includes(term))
      )?.[0]
    if (intent) topic = intent
    else {
      const messageTopic = (Object.entries(TOPICS) as [WorldId, RegExp][])
        .find(([world, pattern]) =>
          pattern.test(normalized) || NON_LATIN_TOPICS[world].some((term) => messageOrKind.includes(term))
        )?.[0]
      topic = messageTopic ?? worldId ?? 'default'
    }
  }

  return selectReply(COMPANION_CONVERSATIONS[language][topic], messageOrKind)
}
