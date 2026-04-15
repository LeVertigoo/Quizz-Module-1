import { useState } from 'react'

const SUPABASE_URL = 'https://qglyfohuebgbuztjqaok.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbHlmb2h1ZWJnYnV6dGpxYW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTgxODQsImV4cCI6MjA5MTgzNDE4NH0.HKqxiTKQDV8zvfpTmE8RlDq_GsbwHATzfn1gyDkJLxQ'

const QUESTIONS = [
  {
    q: "LinkedIn favorise les posts qui génèrent des commentaires longs plutôt que des likes.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "Le dwell time (temps passé sur un post) est un signal fort pour l'algo. Les commentaires longs augmentent le dwell time des autres utilisateurs qui les lisent.",
  },
  {
    q: "Combien de temps par jour est recommandé pour ta routine d'engagement ?",
    opts: ['5 minutes', '15-20 minutes', '1 heure'], c: 1,
    e: "15-20 minutes suffisent si tu commentes les bonnes personnes avec des commentaires de valeur. 5 minutes c'est trop peu pour créer de vrais liens, 1 heure c'est du temps perdu.",
  },
  {
    q: "Quel est le facteur qui impacte le plus l'acceptation d'une demande de connexion ?",
    opts: ['Avoir un titre accrocheur', 'Avoir un profil complet et cohérent', 'Envoyer une note personnalisée'], c: 1,
    e: "La première chose que fait la personne est de visiter ton profil. Si ton profil est flou ou incohérent, même la meilleure note ne passera pas. Le profil est le fondement de tout.",
  },
  {
    q: "Il vaut mieux poster 5 fois par semaine avec du contenu moyen que 2 fois par semaine avec du contenu excellent.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "La qualité bat la quantité sur LinkedIn. 2 posts excellents par semaine qui génèrent de l'engagement valent plus que 5 posts moyens qui passent inaperçus.",
  },
  {
    q: "Quel type de post génère le plus d'impressions organiques sur LinkedIn en 2024-2025 ?",
    opts: ['Les posts avec des liens externes', 'Les posts texte ou carousel sans lien', 'Les articles LinkedIn natifs'], c: 1,
    e: "LinkedIn pénalise les posts qui font sortir les utilisateurs de la plateforme. Les posts sans lien externe sont systématiquement mieux distribués.",
  },
  {
    q: "Un message de prospection doit idéalement être envoyé :",
    opts: ["Juste après avoir envoyé la demande de connexion", "Quelques jours après l'acceptation, en démarrant une vraie conversation", "Uniquement si la personne a interagi avec tes posts"], c: 1,
    e: "Envoyer un pitch immédiatement après l'acceptation est l'erreur la plus courante. Construire un minimum de relation avant de proposer quelque chose augmente drastiquement le taux de réponse.",
  },
  {
    q: "Le SSI (Social Selling Index) de LinkedIn a un impact direct sur la portée de tes posts.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "LinkedIn n'a jamais confirmé de lien direct entre le SSI et la portée des posts. C'est un score indicatif de ta présence, mais ce n'est pas un levier algorithmique validé.",
  },
  {
    q: "Quel est le nombre idéal de hashtags à utiliser dans un post LinkedIn ?",
    opts: ['0 — les hashtags sont contre-productifs', '3 à 5 hashtags ciblés', '10+ pour maximiser la visibilité'], c: 1,
    e: "3 à 5 hashtags pertinents et ciblés suffisent. En mettre trop donne un signal de spam à l'algo. En mettre 0 prive ton post de toute catégorisation thématique.",
  },
  {
    q: "La bannière LinkedIn a un impact sur la décision d'une personne d'accepter ta demande de connexion.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "La bannière est la première chose visible quand on visite un profil. Elle doit renforcer ton positionnement en 3 secondes, avant même que la personne lise ton titre ou ton résumé.",
  },
  {
    q: "Quelle section du profil LinkedIn a le plus de poids pour convaincre un prospect de te contacter ?",
    opts: ["Le titre (headline)", "La section 'À propos'", "Les recommandations"], c: 1,
    e: "La section 'À propos' est le seul endroit où tu peux développer ton positionnement, t'adresser directement à ta cible et inclure un appel à l'action. C'est ton argumentaire de vente.",
  },
  {
    q: "Il est possible de savoir exactement qui a visité ton profil LinkedIn, même sans abonnement Premium.",
    opts: ['Vrai', 'Faux'], c: 1,
    e: "Sans Premium, LinkedIn ne te montre que les 5 derniers visiteurs (ou de manière floue). Pour voir la liste complète et détaillée, un abonnement Sales Navigator ou Premium est nécessaire.",
  },
  {
    q: "Commenter régulièrement les posts de ta cible avant de la démarcher est une bonne pratique de prospection.",
    opts: ['Vrai', 'Faux'], c: 0,
    e: "Interagir en amont avec les posts de ta cible te rend familier avant le premier contact. Tu passes de 'inconnu' à 'celui qui apporte de la valeur' — ce qui augmente considérablement le taux d'acceptation et de réponse.",
  },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Parkinsans:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  #qroot {
    font-family: 'Parkinsans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    color: #121C28;
    position: relative;
    overflow: hidden;
    background: #FAF9F2;
  }
  #qbg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .blob { position: absolute; border-radius: 50%; background: #018EBB; filter: blur(100px); opacity: 0.25; }
  #grain { position: absolute; inset: 0; pointer-events: none; }
  .qouter {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 620px;
    border-radius: 24px;
    border: 10px solid rgba(18,28,40,0.10);
    background: #FAF9F2;
  }
  .qcard { background: #FAF9F2; border-radius: 16px; padding: 2.5rem 2rem; width: 100%; }
  .btag { display: inline-block; background: #018EBB; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .08em; padding: 4px 12px; border-radius: 20px; margin-bottom: 1.25rem; text-transform: uppercase; }
  h1 { font-size: 24px; font-weight: 800; color: #121C28; line-height: 1.25; margin-bottom: .75rem; }
  .sub { font-size: 15px; color: #4a5568; line-height: 1.6; margin-bottom: 2rem; }
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
  .qtxt { font-size: 19px; font-weight: 700; line-height: 1.4; color: #121C28; margin-bottom: 1.5rem; }
  .opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.25rem; }
  .opt { padding: 14px 18px; border: 1.5px solid rgba(18,28,40,0.12); border-radius: 12px; font-size: 14px; font-family: 'Parkinsans', sans-serif; background: #fff; color: #121C28; cursor: pointer; text-align: left; line-height: 1.45; font-weight: 600; transition: all .15s; }
  .opt:hover:not(:disabled) { border-color: #018EBB; background: rgba(1,142,187,0.05); }
  .opt.correct { background: #f0fdf4; border-color: #22c55e; color: #14532d; }
  .opt.wrong { background: #fef2f2; border-color: #ef4444; color: #7f1d1d; }
  .opt.neutral-done { opacity: 0.4; cursor: default; }
  .expl { background: rgba(1,142,187,0.07); border-left: 3px solid #018EBB; border-radius: 0 12px 12px 0; padding: 12px 16px; font-size: 13.5px; line-height: 1.65; color: #2d4a5e; margin-bottom: 1.25rem; }
  .btn-next { background: #018EBB; color: #fff; border: none; border-radius: 12px; padding: 12px 28px; font-size: 14px; font-weight: 700; font-family: 'Parkinsans', sans-serif; cursor: pointer; transition: background .2s; }
  .btn-next:hover { background: #0179a0; }
  .score-big { font-size: 56px; font-weight: 800; color: #121C28; line-height: 1; }
  .score-lbl { font-size: 14px; color: #718096; margin-top: 6px; }
  .score-msg { font-size: 15px; font-weight: 600; line-height: 1.5; color: #121C28; margin-top: 1rem; padding: 1rem 1.25rem; background: rgba(1,142,187,0.07); border-radius: 12px; }
  .recap-title { font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 1rem; margin-top: 1.75rem; }
  .recap-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 1px solid rgba(18,28,40,0.07); font-size: 13px; line-height: 1.5; }
  .ico { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; margin-top: 1px; }
  .ico.ok { background: #dcfce7; color: #166534; }
  .ico.ko { background: #fee2e2; color: #991b1b; }
`

function getScoreMsg(score, total) {
  const p = score / total
  if (p >= 10 / 12) return 'Excellent ! Tu as des bases solides — passons maintenant à leur mise en application concrète.'
  if (p >= 7 / 12) return 'Bien joué ! Quelques points sont à revoir, mais tu as déjà de bonnes fondations à exploiter.'
  return "Les fondations sont à consolider — c'est exactement pour ça qu'on est là."
}

async function sendToSupabase(name, email, score, results) {
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
        total_questions: QUESTIONS.length,
        answers: results.map((r, i) => ({
          question: QUESTIONS[i].q,
          reponse_choisie: QUESTIONS[i].opts[r.selected],
          bonne_reponse: QUESTIONS[i].opts[QUESTIONS[i].c],
          correct: r.correct,
        })),
      }),
    })
  } catch (e) {
    console.error('Supabase error', e)
  }
}

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
      <span className="btag">Quiz LinkedIn</span>
      <h1>Comprends-tu vraiment LinkedIn ?</h1>
      <p className="sub">12 questions pour valider tes bases avant de passer à l'action.</p>
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

function QuizScreen({ onFinish }) {
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([])

  const q = QUESTIONS[cur]
  const pct = Math.round((cur / QUESTIONS.length) * 100)

  function handleSelect(i) {
    if (answered) return
    setSel(i)
    setAnswered(true)
    setResults(prev => [...prev, { selected: i, correct: i === q.c }])
  }

  function handleNext() {
    if (cur < QUESTIONS.length - 1) {
      setCur(c => c + 1)
      setSel(null)
      setAnswered(false)
    } else {
      onFinish([...results, { selected: sel, correct: sel === q.c }].slice(0, QUESTIONS.length))
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
          <span>Question {cur + 1} / {QUESTIONS.length}</span>
          <span>{pct}%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
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
            {cur < QUESTIONS.length - 1 ? 'Question suivante' : 'Voir mes résultats'}
          </button>
        </>
      )}
    </>
  )
}

function ResultScreen({ name, email, results }) {
  const [sent, setSent] = useState(false)
  const score = results.filter(r => r.correct).length

  useState(() => {
    sendToSupabase(name, email, score, results).finally(() => setSent(true))
  })

  return (
    <>
      <span className="btag">Résultats</span>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="score-big">
          {score}<span style={{ fontSize: '32px', color: '#718096' }}>/{QUESTIONS.length}</span>
        </div>
        <div className="score-lbl">bonnes réponses</div>
        <div className="score-msg">{getScoreMsg(score, QUESTIONS.length)}</div>
      </div>
      <div className="recap-title">Détail des réponses</div>
      {results.map((r, i) => (
        <div key={i} className="recap-item">
          <div className={`ico ${r.correct ? 'ok' : 'ko'}`}>{r.correct ? '✓' : '✗'}</div>
          <div>
            <div style={{ fontWeight: 600, color: '#121C28' }}>{QUESTIONS[i].q}</div>
            <div style={{ color: '#4a5568', marginTop: '2px' }}>Bonne réponse : {QUESTIONS[i].opts[QUESTIONS[i].c]}</div>
          </div>
        </div>
      ))}
      {!sent && <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096', marginTop: '1rem' }}>Enregistrement des résultats...</p>}
    </>
  )
}

export default function Quiz() {
  const [screen, setScreen] = useState('home')
  const [participant, setParticipant] = useState({ name: '', email: '' })
  const [finalResults, setFinalResults] = useState([])

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
            {screen === 'quiz' && <QuizScreen onFinish={handleFinish} />}
            {screen === 'result' && <ResultScreen name={participant.name} email={participant.email} results={finalResults} />}
          </div>
        </div>
      </div>
    </>
  )
}
