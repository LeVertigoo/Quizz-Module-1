import { useState } from 'react'

const SUPABASE_URL = 'https://qglyfohuebgbuztjqaok.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbHlmb2h1ZWJnYnV6dGpxYW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTgxODQsImV4cCI6MjA5MTgzNDE4NH0.HKqxiTKQDV8zvfpTmE8RlDq_GsbwHATzfn1gyDkJLxQ'

const QUESTIONS = [
  {
    q: "LinkedIn favorise les posts qui génèrent des commentaires longs plutôt que des likes.",
    options: ['Vrai', 'Faux'],
    correct: 0,
    explication: "Le dwell time (temps passé sur un post) est un signal fort pour l'algo. Les commentaires longs augmentent le dwell time des autres utilisateurs qui les lisent.",
  },
  {
    q: "Combien de temps par jour est recommandé pour ta routine d'engagement ?",
    options: ['5 minutes', '15-20 minutes', '1 heure'],
    correct: 1,
    explication: "15-20 minutes suffisent si tu commentes les bonnes personnes avec des commentaires de valeur. 5 minutes c'est trop peu pour créer de vrais liens, 1 heure c'est du temps perdu.",
  },
  {
    q: "Quel est le facteur qui impacte le plus l'acceptation d'une demande de connexion ?",
    options: ['Avoir un titre accrocheur', 'Avoir un profil complet et cohérent', 'Envoyer une note personnalisée'],
    correct: 1,
    explication: "La première chose que fait la personne est de visiter ton profil. Si ton profil est flou ou incohérent, même la meilleure note ne passera pas. Le profil est le fondement de tout.",
  },
  {
    q: "Il vaut mieux poster 5 fois par semaine avec du contenu moyen que 2 fois par semaine avec du contenu excellent.",
    options: ['Vrai', 'Faux'],
    correct: 1,
    explication: "La qualité bat la quantité sur LinkedIn. 2 posts excellents par semaine qui génèrent de l'engagement valent plus que 5 posts moyens qui passent inaperçus.",
  },
  {
    q: "Quel type de post génère le plus d'impressions organiques sur LinkedIn en 2024-2025 ?",
    options: ['Les posts avec des liens externes', 'Les posts texte ou carousel sans lien', 'Les articles LinkedIn natifs'],
    correct: 1,
    explication: "LinkedIn pénalise les posts qui font sortir les utilisateurs de la plateforme. Les posts sans lien externe (texte, carrousel, vidéo native) sont systématiquement mieux distribués.",
  },
  {
    q: "Un message de prospection doit idéalement être envoyé :",
    options: ["Juste après avoir envoyé la demande de connexion", "Quelques jours après l'acceptation, en démarrant une vraie conversation", "Uniquement si la personne a interagi avec tes posts"],
    correct: 1,
    explication: "Envoyer un pitch immédiatement après l'acceptation est l'erreur la plus courante. Construire un minimum de relation avant de proposer quelque chose augmente drastiquement le taux de réponse.",
  },
  {
    q: "Le SSI (Social Selling Index) de LinkedIn a un impact direct sur la portée de tes posts.",
    options: ['Vrai', 'Faux'],
    correct: 1,
    explication: "LinkedIn n'a jamais confirmé de lien direct entre le SSI et la portée des posts. C'est un score indicatif de ta présence, mais ce n'est pas un levier algorithmique validé.",
  },
  {
    q: "Quel est le nombre idéal de hashtags à utiliser dans un post LinkedIn ?",
    options: ['0 — les hashtags sont contre-productifs', '3 à 5 hashtags ciblés', '10+ pour maximiser la visibilité'],
    correct: 1,
    explication: "3 à 5 hashtags pertinents et ciblés suffisent. En mettre trop donne un signal de spam à l'algo. En mettre 0 prive ton post de toute catégorisation thématique.",
  },
  {
    q: "La bannière LinkedIn a un impact sur la décision d'une personne d'accepter ta demande de connexion.",
    options: ['Vrai', 'Faux'],
    correct: 0,
    explication: "La bannière est la première chose visible quand on visite un profil. Elle doit renforcer ton positionnement en 3 secondes, avant même que la personne lise ton titre ou ton résumé.",
  },
  {
    q: "Quelle section du profil LinkedIn a le plus de poids pour convaincre un prospect de te contacter ?",
    options: ["Le titre (headline)", "La section 'À propos'", "Les recommandations"],
    correct: 1,
    explication: "La section 'À propos' est le seul endroit où tu peux développer ton positionnement, t'adresser directement à ta cible et inclure un appel à l'action. C'est ton argumentaire de vente.",
  },
  {
    q: "Il est possible de savoir exactement qui a visité ton profil LinkedIn, même sans abonnement Premium.",
    options: ['Vrai', 'Faux'],
    correct: 1,
    explication: "Sans Premium, LinkedIn ne te montre que les 5 derniers visiteurs (ou de manière floue). Pour voir la liste complète et détaillée, un abonnement Sales Navigator ou Premium est nécessaire.",
  },
  {
    q: "Commenter régulièrement les posts de ta cible avant de la démarcher est une bonne pratique de prospection.",
    options: ['Vrai', 'Faux'],
    correct: 0,
    explication: "Interagir en amont avec les posts de ta cible te rend familier avant le premier contact. Tu passes de 'inconnu' à 'celui qui apporte de la valeur' — ce qui augmente considérablement le taux d'acceptation et de réponse.",
  },
]

const styles = {
  root: { fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#FAF9F2', minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', color: '#121C28' },
  card: { background: '#fff', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: '640px', border: '1px solid rgba(18,28,40,0.1)' },
  brandTag: { display: 'inline-block', background: '#018EBB', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.25rem', textTransform: 'uppercase' },
  h1: { fontSize: '26px', fontWeight: 700, color: '#121C28', lineHeight: 1.25, marginBottom: '.75rem' },
  subtitle: { fontSize: '15px', color: '#4a5568', lineHeight: 1.6, marginBottom: '2rem' },
  fieldGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '13px', fontWeight: 700, color: '#121C28', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid rgba(18,28,40,0.15)', borderRadius: '12px', fontSize: '15px', fontFamily: 'inherit', background: '#FAF9F2', color: '#121C28', outline: 'none' },
  btnPrimary: { width: '100%', background: '#121C28', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', marginTop: '1.5rem' },
  btnPrimaryDisabled: { width: '100%', background: '#b0b8c1', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit', cursor: 'not-allowed', marginTop: '1.5rem' },
  progressWrap: { marginBottom: '1.75rem' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#718096', marginBottom: '8px' },
  progressBg: { height: '4px', background: 'rgba(18,28,40,0.08)', borderRadius: '4px', overflow: 'hidden' },
  questionText: { fontSize: '20px', fontWeight: 700, lineHeight: 1.4, color: '#121C28', marginBottom: '1.5rem' },
  optionsWrap: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' },
  optionBase: { padding: '14px 18px', border: '1.5px solid rgba(18,28,40,0.12)', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#fff', color: '#121C28', cursor: 'pointer', textAlign: 'left', lineHeight: 1.45, fontWeight: 500 },
  optionCorrect: { padding: '14px 18px', border: '1.5px solid #22c55e', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#f0fdf4', color: '#14532d', cursor: 'default', textAlign: 'left', lineHeight: 1.45, fontWeight: 500 },
  optionWrong: { padding: '14px 18px', border: '1.5px solid #ef4444', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#fef2f2', color: '#7f1d1d', cursor: 'default', textAlign: 'left', lineHeight: 1.45, fontWeight: 500 },
  optionNeutralAnswered: { padding: '14px 18px', border: '1.5px solid rgba(18,28,40,0.12)', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#fff', color: '#121C28', cursor: 'default', textAlign: 'left', lineHeight: 1.45, fontWeight: 500, opacity: 0.5 },
  explication: { background: '#f0f9fc', borderLeft: '3px solid #018EBB', borderRadius: '0 12px 12px 0', padding: '12px 16px', fontSize: '13.5px', lineHeight: 1.65, color: '#2d4a5e', marginBottom: '1.25rem' },
  btnNext: { background: '#018EBB', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' },
  scoreBig: { fontSize: '56px', fontWeight: 700, color: '#121C28', lineHeight: 1 },
  scoreLabel: { fontSize: '14px', color: '#718096', marginTop: '6px' },
  scoreMsg: { fontSize: '16px', fontWeight: 600, lineHeight: 1.5, color: '#121C28', marginTop: '1rem', padding: '1rem 1.25rem', background: '#f7fafc', borderRadius: '12px' },
  recapTitle: { fontSize: '13px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem', marginTop: '1.75rem' },
  recapItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 0', borderBottom: '1px solid rgba(18,28,40,0.07)', fontSize: '13.5px', lineHeight: 1.5 },
  recapIconOk: { flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, marginTop: '1px', background: '#dcfce7', color: '#166534' },
  recapIconKo: { flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, marginTop: '1px', background: '#fee2e2', color: '#991b1b' },
  sendingMsg: { textAlign: 'center', fontSize: '13px', color: '#718096', marginTop: '1rem' },
}

function getScoreMsg(score, total) {
  const pct = score / total
  if (pct >= 10 / 12) return 'Excellent ! Tu as des bases solides — passons maintenant à leur mise en application concrète.'
  if (pct >= 7 / 12) return 'Bien joué ! Quelques points sont à revoir, mais tu as déjà de bonnes fondations à exploiter.'
  return "Les fondations sont à consolider — c'est exactement pour ça qu'on est là."
}

async function sendToSupabase(name, email, score, results) {
  const body = {
    client_name: name,
    client_email: email || null,
    score,
    total_questions: QUESTIONS.length,
    answers: results.map((r, i) => ({
      question: QUESTIONS[i].q,
      reponse_choisie: QUESTIONS[i].options[r.selected],
      bonne_reponse: QUESTIONS[i].options[QUESTIONS[i].correct],
      correct: r.correct,
    })),
  }
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/quiz_results`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body),
    })
  } catch (e) {
    console.error('Supabase error', e)
  }
}

function HomeScreen({ onStart }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <span style={styles.brandTag}>Quiz LinkedIn</span>
        <h1 style={styles.h1}>Comprends-tu vraiment LinkedIn ?</h1>
        <p style={styles.subtitle}>12 questions pour valider tes bases avant de passer à l'action.</p>
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="fname">Ton prénom <span style={{ color: '#ef4444' }}>*</span></label>
          <input id="fname" style={styles.input} type="text" placeholder="Ex : Thomas" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="femail">Ton email <span style={{ color: '#718096', fontWeight: 400 }}>(optionnel)</span></label>
          <input id="femail" style={styles.input} type="email" placeholder="Ex : thomas@kalanis.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button style={name.trim() ? styles.btnPrimary : styles.btnPrimaryDisabled} disabled={!name.trim()} onClick={() => onStart(name.trim(), email.trim())}>
          Commencer le quiz
        </button>
      </div>
    </div>
  )
}

function QuizScreen({ onFinish }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([])
  const q = QUESTIONS[current]
  const pct = Math.round((current / QUESTIONS.length) * 100)

  function handleSelect(i) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    setResults((prev) => [...prev, { selected: i, correct: i === q.correct }])
  }

  function handleNext() {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      onFinish([...results])
    }
  }

  function getOptionStyle(i) {
    if (!answered) return styles.optionBase
    if (i === q.correct) return styles.optionCorrect
    if (i === selected) return styles.optionWrong
    return styles.optionNeutralAnswered
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.progressWrap}>
          <div style={styles.progressLabel}>
            <span>Question {current + 1} / {QUESTIONS.length}</span>
            <span>{pct}%</span>
          </div>
          <div style={styles.progressBg}>
            <div style={{ height: '4px', background: '#018EBB', borderRadius: '4px', width: `${pct}%`, transition: 'width .4s ease' }} />
          </div>
        </div>
        <p style={styles.questionText}>{q.q}</p>
        <div style={styles.optionsWrap}>
          {q.options.map((opt, i) => (
            <button key={i} style={getOptionStyle(i)} disabled={answered} onClick={() => handleSelect(i)}>{opt}</button>
          ))}
        </div>
        {answered && (
          <>
            <div style={styles.explication}>{q.explication}</div>
            <button style={styles.btnNext} onClick={handleNext}>
              {current < QUESTIONS.length - 1 ? 'Question suivante' : 'Voir mes résultats'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ResultScreen({ name, email, results }) {
  const [sending, setSending] = useState(true)
  const score = results.filter((r) => r.correct).length

  useState(() => {
    sendToSupabase(name, email, score, results).finally(() => setSending(false))
  })

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <span style={styles.brandTag}>Résultats</span>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={styles.scoreBig}>{score}<span style={{ fontSize: '32px', color: '#718096' }}>/{QUESTIONS.length}</span></div>
          <div style={styles.scoreLabel}>bonnes réponses</div>
          <div style={styles.scoreMsg}>{getScoreMsg(score, QUESTIONS.length)}</div>
        </div>
        <div style={styles.recapTitle}>Détail des réponses</div>
        {results.map((r, i) => {
          const q = QUESTIONS[i]
          return (
            <div key={i} style={styles.recapItem}>
              <div style={r.correct ? styles.recapIconOk : styles.recapIconKo}>{r.correct ? '✓' : '✗'}</div>
              <div>
                <div style={{ fontWeight: 600, color: '#121C28' }}>{q.q}</div>
                <div style={{ color: '#4a5568', marginTop: '2px' }}>Bonne réponse : {q.options[q.correct]}</div>
              </div>
            </div>
          )
        })}
        {sending && <p style={styles.sendingMsg}>Enregistrement des résultats...</p>}
      </div>
    </div>
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

  if (screen === 'home') return <HomeScreen onStart={handleStart} />
  if (screen === 'quiz') return <QuizScreen onFinish={handleFinish} />
  if (screen === 'result') return <ResultScreen name={participant.name} email={participant.email} results={finalResults} />
}
