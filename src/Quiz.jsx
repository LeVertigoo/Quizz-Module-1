import { useState, useEffect } from 'react'

const SUPABASE_URL = 'https://qglyfohuebgbuztjqaok.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbHlmb2h1ZWJnYnV6dGpxYW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTgxODQsImV4cCI6MjA5MTgzNDE4NH0.HKqxiTKQDV8zvfpTmE8RlDq_GsbwHATzfn1gyDkJLxQ'

const ALL_QUESTIONS = [
  {
    type: 'vf',
    q: "LinkedIn utilise une IA (et non un système mathématique fixe) pour analyser ton comportement sur la plateforme.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "C'est une IA qui scanne absolument tout — ton contenu, ce que tu consommes, le temps que tu passes sur chaque post. Plus un algorithme mathématique rigide.",
  },
  {
    type: 'vf',
    q: "L'algorithme analyse uniquement ton dernier post pour décider à qui le distribuer.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "LinkedIn lit toute ta trajectoire de contenu — chaque post passé fait partie d'une base de données que l'IA utilise pour comprendre qui tu es et vers qui t'envoyer.",
  },
  {
    type: 'qcm',
    q: "L'identité algorithmique de LinkedIn se construit à partir de :",
    opts: ['Tes statistiques de posts', 'Ton profil (titre, bio, bannière, expériences)', 'Le nombre de tes abonnés', 'Tes messages privés'], c: 1,
    e: "L'IA lit ton profil de fond en comble pour définir ta carte d'identité numérique : qui tu es, qui tu représentes, et vers qui distribuer ton contenu.",
  },
  {
    type: 'vf',
    q: "Un profil optimisé et un contenu de qualité suffisent pour générer des clients, même s'ils ne sont pas alignés entre eux.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "Sans alignement profil / contenu, l'algo ne sait pas à qui envoyer tes posts. Tu peux avoir des likes et des vues sans générer aucun client, parce que tu touches les mauvaises personnes.",
  },
  {
    type: 'vf',
    q: "Les 2 premières heures après publication sont les plus importantes pour la distribution d'un post.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "C'est dans cette fenêtre que l'algo décide s'il pousse ton post à une audience plus large ou s'il referme la distribution. Tu dois être présent et disponible pour répondre aux commentaires.",
  },
  {
    type: 'qcm',
    q: "Que se passe-t-il si tu publies un post hors de ta trajectoire habituelle ?",
    opts: ["L'algo ignore juste ce post", "L'algo confond ton identité et réduit ta portée globale", "Ça t'apporte une nouvelle audience", "Chaque post est évalué indépendamment, rien ne change"], c: 1,
    e: "Un post hors-niche n'est pas neutre. Il génère des scrolls chez des gens hors-cible, que LinkedIn utilise comme 'hard negatives' — ce qui abîme activement ton positionnement algorithmique.",
  },
  {
    type: 'qcm',
    q: "Quel est le signal le plus puissant pour l'algorithme LinkedIn ?",
    opts: ['Le like', 'La vue de profil après le post', 'Le commentaire développé et le partage', 'Le clic sur un lien externe'], c: 2,
    e: "Commentaires développés et partages sont au sommet de la hiérarchie. Le like, lui, est avant-dernier — pourtant c'est le seul que la majorité des créateurs surveillent.",
  },
  {
    type: 'vf',
    q: "Un like est plus important qu'un commentaire développé pour l'algorithme LinkedIn.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "Le like est l'un des signaux les moins valorisés. Un commentaire de 2-3 phrases avec un vrai avis vaut algorithmiquement bien plus qu'un like — ou même qu'un 'Super post !'.",
  },
  {
    type: 'qcm',
    q: "À partir de combien de secondes sur un post LinkedIn enregistre-t-il un signal positif de dwell time ?",
    opts: ['10 secondes', '20 secondes', '30 secondes', '60 secondes'], c: 2,
    e: "30 secondes est le seuil. Quelqu'un qui reste 30 secondes sur ton post sans rien faire génère quand même un signal positif — parce que retenir l'attention aussi longtemps sur LinkedIn est rare.",
  },
  {
    type: 'vf',
    q: "Quelqu'un qui reste 30 secondes sur ton post sans liker ni commenter génère quand même un signal positif pour l'algorithme.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "Le dwell time est invisible dans tes stats, mais c'est l'un des signaux les plus forts. LinkedIn voit que quelqu'un a vraiment lu ton contenu — même sans interaction visible.",
  },
  {
    type: 'qcm',
    q: "Entre ces deux posts, lequel l'algorithme va-t-il favoriser ?",
    opts: ['Post A : 300 likes, 5 commentaires, 10 sauvegardes', 'Post B : 80 likes, 30 commentaires, 50 sauvegardes'], c: 1,
    e: "Le Post B gagne malgré 3x moins de likes. Les commentaires développés et les sauvegardes sont des signaux bien plus forts que les likes aux yeux de l'algorithme.",
  },
  {
    type: 'vf',
    q: "Un commentaire 'Super post !' a autant de valeur algorithmique qu'un commentaire de 3 phrases avec un avis personnel.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "L'IA de LinkedIn est capable de détecter la qualité d'un commentaire. Un commentaire vide est pris en compte très faiblement. Un vrai commentaire avec un avis ou une expérience personnelle est valorisé fortement.",
  },
  {
    type: 'vf',
    q: "Quand quelqu'un commente ton post, ses propres abonnés peuvent voir ton post dans leur feed.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "C'est un effet souvent oublié. Un bon commentaire ce n'est pas juste un signal pour l'algo — c'est aussi de la distribution gratuite vers une nouvelle audience que tu n'as pas encore.",
  },
  {
    type: 'qcm',
    q: "Comment LinkedIn évalue-t-il la performance d'un post ?",
    opts: ["En valeur absolue (nombre de likes bruts)", "En le comparant aux posts similaires publiés au même moment (percentiles)", "En fonction du nombre d'abonnés de l'auteur", "Uniquement sur les 24 premières heures"], c: 1,
    e: "LinkedIn transforme tes chiffres en percentiles. 15 commentaires c'est bien ou pas ? Ça dépend de tous les posts publiés au même moment. Si t'es dans le top percentile, il te pousse plus loin automatiquement.",
  },
  {
    type: 'vf',
    q: "Un post sans aucun engagement est un signal neutre — il n'affecte pas les posts suivants.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "Un post sans engagement est un signal négatif actif. L'algo en déduit que ton contenu n'intéresse pas et ça joue sur la distribution de tes prochains posts. Vaut mieux ne pas publier que publier un post faible.",
  },
  {
    type: 'qcm',
    q: "Qu'est-ce que le 'topic authority' sur LinkedIn ?",
    opts: ["Le nombre total d'abonnés que tu as", "Le score que LinkedIn t'attribue sur chaque sujet que tu traites régulièrement", "Le taux d'engagement moyen de tes posts", "La fréquence à laquelle tu publies"], c: 1,
    e: "Le topic authority c'est le niveau d'expertise que LinkedIn te reconnaît sur chaque sujet. Plus il est élevé, plus LinkedIn te pousse proactivement vers des gens intéressés par ce sujet — même s'ils ne te suivent pas encore.",
  },
  {
    type: 'qcm',
    q: "Selon la règle 80/20, quelle proportion de ton contenu doit traiter de tes sujets principaux ?",
    opts: ['50%', '60%', '80%', '100%'], c: 2,
    e: "80% sur tes sujets de niche, 20% sur des sujets plus larges ou personnels. Au-delà de 20% hors-niche, tu dilues ton profil algorithmique et l'algo ne sait plus à qui t'envoyer.",
  },
  {
    type: 'vf',
    q: "Publier hors-niche trop souvent génère des 'hard negatives' qui réduisent activement ta distribution sur tes posts de niche.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "Les scrolls rapides de gens hors-cible sont utilisés par LinkedIn pour entraîner son modèle à moins te montrer à des profils similaires. Un post hors-niche n'est jamais neutre.",
  },
  {
    type: 'vf',
    q: "Publier des séries de posts liés entre eux accélère la construction de ton topic authority.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "Le Generative Recommender est conçu pour prédire 'la suite du parcours'. Une série crée une trajectoire prédictible que l'algo reconnaît et favorise mécaniquement dans sa distribution.",
  },
  {
    type: 'qcm',
    q: "Parmi ces éléments, lequel NE contribue PAS au topic authority ?",
    opts: ["La cohérence thématique dans le temps", "La qualité des profils qui interagissent avec toi", "Le nombre total d'abonnés sur ton profil", "L'alignement entre ton profil et ton contenu"], c: 2,
    e: "Le nombre d'abonnés ne construit pas le topic authority. Ce qui compte : la cohérence de ta thématique dans le temps, la pertinence des gens qui interagissent avec toi, et l'alignement profil / contenu.",
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getScoreMsg(score, total) {
  const p = score / total
  if (p >= 0.85) return "Excellent ! Tu maîtrises les mécaniques de l'algorithme LinkedIn — passons maintenant à leur mise en application."
  if (p >= 0.60) return "Bien joué ! Tu as de bonnes bases, mais quelques mécaniques clés méritent d'être approfondies."
  return "Les fondations de l'algo sont à consolider — c'est exactement le travail qu'on va faire ensemble."
}

async function sendToSupabase(name, email, score, questions, results) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/quiz_results`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        client_name: name,
        client_email: email || null,
        score,
        total_questions: questions.length,
        answers: results.map((r, i) => ({
          question: questions[i].q,
          reponse_choisie: questions[i].opts[r.selected],
          bonne_reponse: questions[i].opts[questions[i].c],
          correct: r.correct,
        })),
      }),
    })
  } catch (e) {
    console.error('Supabase error', e)
  }
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Parkinsans:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  #qroot { font-family: 'Parkinsans', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem; color: #121C28; position: relative; overflow: hidden; background: #FAF9F2; }
  #qbg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .blob { position: absolute; border-radius: 50%; background: #018EBB; filter: blur(100px); opacity: 0.25; }
  #grain { position: absolute; inset: 0; pointer-events: none; }
  .qouter { position: relative; z-index: 1; width: 100%; max-width: 640px; border-radius: 24px; border: 10px solid rgba(18,28,40,0.10); background: #FAF9F2; }
  .qcard { background: #FAF9F2; border-radius: 16px; padding: 2.5rem 2rem; width: 100%; }
  .btag { display: inline-block; background: #018EBB; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .08em; padding: 4px 12px; border-radius: 20px; margin-bottom: 1.25rem; text-transform: uppercase; }
  h1 { font-size: 22px; font-weight: 800; color: #121C28; line-height: 1.25; margin-bottom: .75rem; }
  .sub { font-size: 14px; color: #4a5568; line-height: 1.6; margin-bottom: 2rem; }
  .fg { margin-bottom: 1rem; }
  .fg label { display: block; font-size: 13px; font-weight: 700; color: #121C28; margin-bottom: 6px; }
  .fg input { width: 100%; padding: 12px 16px; border: 1.5px solid rgba(18,28,40,0.15); border-radius: 12px; font-size: 15px; font-family: 'Parkinsans', sans-serif; background: #fff; color: #121C28; outline: none; transition: border-color .2s; }
  .fg input:focus { border-color: #018EBB; }
  .btn-main { width: 100%; background: #121C28; color: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; font-family: 'Parkinsans', sans-serif; cursor: pointer; margin-top: 1.5rem; transition: background .2s; }
  .btn-main:hover { background: #1e2f44; }
  .btn-main:disabled { background: #b0b8c1; cursor: not-allowed; }
  .prog-wrap { margin-bottom: 1.75rem; }
  .prog-lbl { display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-bottom: 8px; }
  .prog-bg { height: 4px; background: rgba(18,28,40,0.08); border-radius: 4px; overflow: hidden; }
  .prog-fill { height: 4px; background: #018EBB; border-radius: 4px; transition: width .4s ease; }
  .qtag { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: .75rem; letter-spacing: .06em; }
  .qtag.vf { background: rgba(1,142,187,0.12); color: #016a8c; }
  .qtag.qcm { background: rgba(18,28,40,0.07); color: #4a5568; }
  .qtxt { font-size: 17px; font-weight: 700; line-height: 1.45; color: #121C28; margin-bottom: 1.25rem; }
  .opts { display: flex; flex-direction: column; gap: 9px; margin-bottom: 1.25rem; }
  .opt { padding: 13px 16px; border: 1.5px solid rgba(18,28,40,0.12); border-radius: 12px; font-size: 13.5px; font-family: 'Parkinsans', sans-serif; background: #fff; color: #121C28; cursor: pointer; text-align: left; line-height: 1.45; font-weight: 600; transition: all .15s; }
  .opt:hover:not(:disabled) { border-color: #018EBB; background: rgba(1,142,187,0.05); }
  .opt.correct { background: #f0fdf4; border-color: #22c55e; color: #14532d; }
  .opt.wrong { background: #fef2f2; border-color: #ef4444; color: #7f1d1d; }
  .opt.neutral-done { opacity: 0.38; cursor: default; }
  .expl { background: rgba(1,142,187,0.07); border-left: 3px solid #018EBB; border-radius: 0 12px 12px 0; padding: 12px 16px; font-size: 13px; line-height: 1.65; color: #2d4a5e; margin-bottom: 1.25rem; }
  .btn-next { background: #018EBB; color: #fff; border: none; border-radius: 12px; padding: 12px 28px; font-size: 14px; font-weight: 700; font-family: 'Parkinsans', sans-serif; cursor: pointer; transition: background .2s; }
  .btn-next:hover { background: #0179a0; }
  .score-big { font-size: 56px; font-weight: 800; color: #121C28; line-height: 1; }
  .score-lbl { font-size: 14px; color: #718096; margin-top: 6px; }
  .score-msg { font-size: 15px; font-weight: 600; line-height: 1.5; color: #121C28; margin-top: 1rem; padding: 1rem 1.25rem; background: rgba(1,142,187,0.07); border-radius: 12px; }
  .recap-title { font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 1rem; margin-top: 1.75rem; }
  .recap-item { display: flex; align-items: flex-start; gap: 10px; padding: 11px 0; border-bottom: 1px solid rgba(18,28,40,0.07); }
  .ico { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; margin-top: 1px; }
  .ico.ok { background: #dcfce7; color: #166534; }
  .ico.ko { background: #fee2e2; color: #991b1b; }
`

function Background() {
  return (
    <div id="qbg">
      <div className="blob" style={{ width: '480px', height: '480px', top: '-140px', left: '-150px' }} />
      <div className="blob" style={{ width: '350px', height: '350px', top: '35%', right: '-100px' }} />
      <div className="blob" style={{ width: '300px', height: '300px', bottom: '-80px', left: '25%' }} />
      <svg id="grain" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="f">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#f)" opacity="0.15" />
      </svg>
    </div>
  )
}

function HomeScreen({ onStart }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  return (
    <>
      <span className="btag">Quiz Module 1</span>
      <h1>Comprends-tu vraiment comment fonctionne l'algorithme LinkedIn ?</h1>
      <p className="sub">20 questions pour valider tes bases avant de passer à l'action.</p>
      <div className="fg">
        <label>Ton prénom <span style={{ color: '#ef4444' }}>*</span></label>
        <input type="text" placeholder="Ex : Thomas" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="fg">
        <label>Ton email <span style={{ color: '#718096', fontWeight: 400 }}>(optionnel)</span></label>
        <input type="email" placeholder="Ex : thomas@kalanis.fr" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button className="btn-main" disabled={!name.trim()} onClick={() => onStart(name.trim(), email.trim())}>
        Commencer le quiz
      </button>
    </>
  )
}

function QuizScreen({ questions, onFinish }) {
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([])

  const q = questions[cur]
  const pct = Math.round((cur / questions.length) * 100)

  function handleSelect(i) {
    if (answered) return
    setSel(i)
    setAnswered(true)
    setResults(prev => [...prev, { selected: i, correct: i === q.c }])
  }

  function handleNext() {
    if (cur < questions.length - 1) {
      setCur(c => c + 1)
      setSel(null)
      setAnswered(false)
    } else {
      onFinish(results)
    }
  }

  function optClass(i) {
    if (!answered) return 'opt'
    if (i === q.c) return 'opt correct'
    if (i === sel) return 'opt wrong'
    return 'opt neutral-done'
  }

  return (
    <>
      <div className="prog-wrap">
        <div className="prog-lbl">
          <span>Question {cur + 1} / {questions.length}</span>
          <span>{pct}%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className={`qtag ${q.type}`}>{q.type === 'vf' ? 'Vrai / Faux' : 'Choix multiple'}</span>
      <p className="qtxt">{q.q}</p>
      <div className="opts">
        {q.opts.map((o, i) => (
          <button key={i} className={optClass(i)} disabled={answered} onClick={() => handleSelect(i)}>{o}</button>
        ))}
      </div>
      {answered && (
        <>
          <div className="expl">{q.e}</div>
          <button className="btn-next" onClick={handleNext}>
            {cur < questions.length - 1 ? 'Question suivante' : 'Voir mes résultats'}
          </button>
        </>
      )}
    </>
  )
}

function ResultScreen({ name, email, questions, results }) {
  const [sent, setSent] = useState(false)
  const score = results.filter(r => r.correct).length

  useEffect(() => {
    sendToSupabase(name, email, score, questions, results).finally(() => setSent(true))
  }, [])

  return (
    <>
      <span className="btag">Résultats</span>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="score-big">{score}<span style={{ fontSize: '32px', color: '#718096' }}>/{questions.length}</span></div>
        <div className="score-lbl">bonnes réponses</div>
        <div className="score-msg">{getScoreMsg(score, questions.length)}</div>
      </div>
      <div className="recap-title">Détail des réponses</div>
      {results.map((r, i) => (
        <div key={i} className="recap-item">
          <div className={`ico ${r.correct ? 'ok' : 'ko'}`}>{r.correct ? '✓' : '✗'}</div>
          <div>
            <div style={{ fontWeight: 600, color: '#121C28', fontSize: '13px' }}>{questions[i].q}</div>
            <div style={{ color: '#4a5568', marginTop: '2px', fontSize: '12.5px' }}>
              Bonne réponse : {questions[i].opts[questions[i].c]}
            </div>
          </div>
        </div>
      ))}
      {!sent && <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096', marginTop: '1rem' }}>Enregistrement...</p>}
    </>
  )
}

export default function Quiz() {
  const [screen, setScreen] = useState('home')
  const [participant, setParticipant] = useState({ name: '', email: '' })
  const [finalResults, setFinalResults] = useState([])
  const [questions] = useState(() => shuffle(ALL_QUESTIONS))

  function handleStart(name, email) {
    setParticipant({ name, email })
    setScreen('quiz')
  }

  function handleFinish(results) {
    setFinalResults(results)
    setScreen('result')
  }

  return (
    <>
      <style>{css}</style>
      <div id="qroot">
        <Background />
        <div className="qouter">
          <div className="qcard">
            {screen === 'home' && <HomeScreen onStart={handleStart} />}
            {screen === 'quiz' && <QuizScreen questions={questions} onFinish={handleFinish} />}
            {screen === 'result' && (
              <ResultScreen
                name={participant.name}
                email={participant.email}
                questions={questions}
                results={finalResults}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
