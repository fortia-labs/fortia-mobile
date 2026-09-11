import React, { useEffect, useMemo, useState } from 'react';
import { getLocales } from 'expo-localization';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Language = 'es' | 'en';
type Localized = { es: string; en: string };
type Role = 'client' | 'coach';
type Screen =
  | 'splash' | 'welcome' | 'role'
  | 'clientGoal' | 'clientFocus' | 'clientExperience' | 'clientLocation'
  | 'clientDays' | 'clientDuration' | 'clientHealth' | 'matching' | 'recommendations'
  | 'coachLegal' | 'coachEducation' | 'coachDocuments' | 'coachTestOne'
  | 'coachTestTwo' | 'coachCases' | 'coachPhilosophy' | 'coachSubmitted' | 'coachAudit';

type Option = { value: string; label: Localized; description?: Localized; reward?: Localized };
type CaseStudy = { id: number; goal: string; duration: string; strategy: string; hasMedia: boolean };

const tx = (es: string, en: string): Localized => ({ es, en });

const goals: Option[] = [
  { value: 'weight_loss', label: tx('Perder peso', 'Lose weight'), reward: tx('Enfocaremos tus recomendaciones en adherencia, progresión y hábitos sostenibles.', 'We will focus your recommendations on consistency, progression, and sustainable habits.') },
  { value: 'muscle_gain', label: tx('Ganar masa muscular', 'Build muscle'), reward: tx('¡Excelente! Buscaremos especialistas en hipertrofia y progresión de volumen.', 'Excellent! We will look for specialists in hypertrophy and volume progression.') },
  { value: 'body_recomposition', label: tx('Recomposición corporal', 'Body recomposition'), reward: tx('Combinaremos entrenamiento estructurado con seguimiento constante.', 'We will combine structured training with consistent follow-up.') },
  { value: 'strength', label: tx('Aumentar fuerza', 'Increase strength'), reward: tx('Buscaremos entrenadores con experiencia en técnica y progresión de cargas.', 'We will look for coaches experienced in technique and load progression.') },
];

const focuses: Option[] = [
  { value: 'upper_body', label: tx('Tren superior', 'Upper body'), reward: tx('Daremos prioridad a entrenadores con experiencia en torso, espalda y brazos.', 'We will prioritize coaches experienced in torso, back, and arms.') },
  { value: 'core', label: tx('Abdomen y core', 'Core and abdomen'), reward: tx('El control del tronco será parte importante de tus recomendaciones.', 'Trunk control will be an important part of your recommendations.') },
  { value: 'lower_body', label: tx('Tren inferior', 'Lower body'), reward: tx('Buscaremos experiencia en fuerza y desarrollo del tren inferior.', 'We will look for experience in lower-body strength and development.') },
];

const experiences: Option[] = [
  { value: 'beginner', label: tx('Principiante', 'Beginner'), description: tx('Nunca he entrenado o llevo menos de 3 meses.', 'I have never trained or have trained for less than 3 months.'), reward: tx('Empezaremos con profesionales que prioricen técnica y confianza.', 'We will start with professionals who prioritize technique and confidence.') },
  { value: 'intermediate', label: tx('Intermedio', 'Intermediate'), description: tx('Conozco los ejercicios básicos y he entrenado varios meses.', 'I know the basic exercises and have trained for several months.'), reward: tx('Tu base nos permite buscar una progresión más específica.', 'Your foundation lets us look for more specific progression.') },
  { value: 'advanced', label: tx('Avanzado', 'Advanced'), description: tx('Entreno de forma estructurada y manejo técnicas avanzadas.', 'I train in a structured way and use advanced techniques.'), reward: tx('Priorizaremos entrenadores con metodología avanzada y seguimiento preciso.', 'We will prioritize coaches with advanced methodology and precise follow-up.') },
];

const locations: Option[] = [
  { value: 'gym', label: tx('En el gimnasio', 'At the gym'), reward: tx('Perfecto: podremos considerar una mayor variedad de equipos.', 'Perfect: we can consider a wider variety of equipment.') },
  { value: 'home', label: tx('En casa', 'At home'), reward: tx('Adaptaremos las recomendaciones al equipo que tienes disponible.', 'We will adapt recommendations to the equipment you have available.') },
];

const healthOptions: Option[] = [
  { value: 'knee', label: tx('Problemas de rodilla', 'Knee problems') },
  { value: 'lower_back', label: tx('Espalda o zona lumbar', 'Back or lower-back problems') },
  { value: 'shoulder', label: tx('Problemas de hombro', 'Shoulder problems') },
  { value: 'cardiovascular', label: tx('Hipertensión o problemas del corazón', 'Hypertension or heart problems') },
  { value: 'dizziness', label: tx('Mareos, dolores de cabeza o vértigo durante el esfuerzo', 'Dizziness, headaches, or vertigo during exertion') },
  { value: 'circulatory', label: tx('Condición circulatoria', 'Circulatory condition') },
  { value: 'none', label: tx('Ninguna condición conocida', 'No known condition') },
];

const philosophies: Option[] = [
  { value: 'evidence', label: tx('Evidencia científica actual', 'Current scientific evidence') },
  { value: 'biomechanics', label: tx('Biomecánica y salud articular', 'Biomechanics and joint health') },
  { value: 'performance', label: tx('Alta intensidad y rendimiento', 'High intensity and performance') },
  { value: 'holistic', label: tx('Enfoque holístico', 'Holistic approach') },
];

const mockCoaches = [
  { id: 'coach-1', initials: 'VR', name: 'Valeria R.', years: 7, specialties: ['muscle_gain', 'body_recomposition'], methodology: tx('Hipertrofia basada en evidencia y ajustes semanales.', 'Evidence-based hypertrophy with weekly adjustments.'), price: tx('Desde $45 USD / mes', 'From $45 USD / month') },
  { id: 'coach-2', initials: 'MC', name: 'Mateo C.', years: 9, specialties: ['strength'], methodology: tx('Técnica, fuerza y progresión de cargas sostenible.', 'Technique, strength, and sustainable load progression.'), price: tx('Desde $55 USD / mes', 'From $55 USD / month') },
  { id: 'coach-3', initials: 'SM', name: 'Sara M.', years: 5, specialties: ['weight_loss', 'body_recomposition'], methodology: tx('Hábitos sostenibles, técnica y programación gradual.', 'Sustainable habits, technique, and gradual programming.'), price: tx('Desde $40 USD / mes', 'From $40 USD / month') },
];

export default function App() {
  const [language] = useState<Language>(() => getLocales()[0]?.languageCode === 'en' ? 'en' : 'es');
  const [screen, setScreen] = useState<Screen>('splash');
  const [history, setHistory] = useState<Screen[]>([]);
  const [goal, setGoal] = useState('');
  const [focus, setFocus] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [days, setDays] = useState(3);
  const [duration, setDuration] = useState(60);
  const [health, setHealth] = useState<string[]>([]);
  const [legalName, setLegalName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [education, setEducation] = useState('');
  const [credentialNumber, setCredentialNumber] = useState('');
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [testOne, setTestOne] = useState('');
  const [testTwo, setTestTwo] = useState('');
  const [cases, setCases] = useState<CaseStudy[]>([{ id: 1, goal: '', duration: '', strategy: '', hasMedia: false }]);
  const [philosophy, setPhilosophy] = useState<string[]>([]);
  const L = (text: Localized) => text[language];

  const go = (next: Screen) => {
    setHistory((current) => [...current, screen]);
    setScreen(next);
  };

  const back = () => {
    setHistory((current) => {
      const previous = current[current.length - 1];
      if (previous) setScreen(previous);
      return current.slice(0, -1);
    });
  };

  useEffect(() => {
    if (screen !== 'splash') return;
    const timer = setTimeout(() => setScreen('welcome'), 1600);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'matching') return;
    const timer = setTimeout(() => setScreen('recommendations'), 2800);
    return () => clearTimeout(timer);
  }, [screen]);

  const recommended = useMemo(() => [...mockCoaches].sort(
    (a, b) => Number(b.specialties.includes(goal)) - Number(a.specialties.includes(goal)),
  ), [goal]);

  const toggleHealth = (value: string) => {
    if (value === 'none') {
      setHealth(['none']);
      return;
    }
    setHealth((current) => {
      const withoutNone = current.filter((item) => item !== 'none');
      return withoutNone.includes(value) ? withoutNone.filter((item) => item !== value) : [...withoutNone, value];
    });
  };

  const togglePhilosophy = (value: string) => setPhilosophy((current) =>
    current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const updateCase = (id: number, key: keyof Omit<CaseStudy, 'id'>, value: string | boolean) => {
    setCases((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };

  const addCase = () => setCases((current) => [...current, {
    id: Math.max(...current.map((item) => item.id)) + 1,
    goal: '', duration: '', strategy: '', hasMedia: false,
  }]);

  if (screen === 'splash') {
    return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" /><View style={styles.center}><Image source={require('./assets/fortia-logo.png')} style={styles.splashLogo} /><Text style={styles.brandLarge}>Fort<Text style={styles.red}>IA</Text></Text><ActivityIndicator color="#C7FF38" /><Text style={styles.muted}>{language === 'es' ? 'Preparando tu experiencia' : 'Preparing your experience'}</Text></View></SafeAreaView>;
  }

  if (screen === 'matching') {
    return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" /><View style={styles.center}><View style={styles.magicOrb}><ActivityIndicator size="large" color="#C7FF38" /></View><Text style={styles.titleCenter}>{language === 'es' ? 'Procesando tus datos…' : 'Processing your data…'}</Text><Text style={styles.bodyCenter}>{language === 'es' ? 'Escogiendo al mejor entrenador personal para ti' : 'Choosing the best personal coach for you'}</Text></View></SafeAreaView>;
  }

  if (screen === 'coachSubmitted') {
    return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" /><ScrollView contentContainerStyle={styles.centerPage}><View style={styles.seal}><Text style={styles.sealText}>✓</Text></View><Text style={styles.titleCenter}>{language === 'es' ? `Postulación recibida, Coach ${legalName.split(' ')[0] || ''}` : `Application received, Coach ${legalName.split(' ')[0] || ''}`}</Text><Text style={styles.bodyCenter}>{language === 'es' ? 'Nuestro comité técnico evaluará tus certificaciones, respuestas y antecedentes profesionales.' : 'Our technical committee will review your certifications, answers, and professional background.'}</Text><View style={styles.notice}><Text style={styles.noticeTitle}>{language === 'es' ? 'Tiempo estimado: 48 a 72 horas hábiles' : 'Estimated time: 48 to 72 business hours'}</Text><Text style={styles.noticeText}>{language === 'es' ? 'Recibirás un correo y una notificación con la resolución.' : 'You will receive an email and a notification with the decision.'}</Text></View><PrimaryButton label={language === 'es' ? 'Conocer las herramientas' : 'Explore the tools'} onPress={() => go('coachAudit')} /></ScrollView></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        {screen !== 'welcome' && <Pressable onPress={back} style={styles.back}><Text style={styles.backText}>‹ {language === 'es' ? 'Volver' : 'Back'}</Text></Pressable>}
        <View style={styles.header}><Image source={require('./assets/fortia-logo.png')} style={styles.logo} /><Text style={styles.brand}>Fort<Text style={styles.red}>IA</Text></Text></View>

        {screen === 'welcome' && <Welcome language={language} onStart={() => go('role')} />}
        {screen === 'role' && <RoleScreen language={language} onRole={(role) => go(role === 'client' ? 'clientGoal' : 'coachLegal')} />}

        {screen === 'clientGoal' && <Question title={tx('¿Cuál es tu objetivo principal?', 'What is your main goal?')} step="1 / 7"><OptionList options={goals} value={goal} language={language} onSelect={setGoal} /><Reward option={goals.find((item) => item.value === goal)} language={language} /><PrimaryButton disabled={!goal} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('clientFocus')} /></Question>}

        {screen === 'clientFocus' && <Question title={tx('¿Qué zona quieres enfocar más?', 'Which area would you like to focus on?')} step="2 / 7"><View style={styles.bodyMap}><Image source={require('./assets/body-focus-silhouette.png')} style={styles.bodyImage} /><Pressable accessibilityLabel={L(focuses[0].label)} onPress={() => setFocus('upper_body')} style={[styles.bodyZone, styles.upperZone, focus === 'upper_body' && styles.bodyZoneSelected]} /><Pressable accessibilityLabel={L(focuses[1].label)} onPress={() => setFocus('core')} style={[styles.bodyZone, styles.coreZone, focus === 'core' && styles.bodyZoneSelected]} /><Pressable accessibilityLabel={L(focuses[2].label)} onPress={() => setFocus('lower_body')} style={[styles.bodyZone, styles.lowerZone, focus === 'lower_body' && styles.bodyZoneSelected]} /></View><View style={styles.chipRow}>{focuses.map((item) => <Chip key={item.value} label={L(item.label)} selected={focus === item.value} onPress={() => setFocus(item.value)} />)}</View><Reward option={focuses.find((item) => item.value === focus)} language={language} /><PrimaryButton disabled={!focus} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('clientExperience')} /></Question>}

        {screen === 'clientExperience' && <Question title={tx('¿Cuál es tu nivel actual?', 'What is your current level?')} step="3 / 7"><OptionList options={experiences} value={experience} language={language} onSelect={setExperience} /><Reward option={experiences.find((item) => item.value === experience)} language={language} /><PrimaryButton disabled={!experience} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('clientLocation')} /></Question>}

        {screen === 'clientLocation' && <Question title={tx('¿Dónde entrenas usualmente?', 'Where do you usually train?')} step="4 / 7"><OptionList options={locations} value={location} language={language} onSelect={setLocation} /><Reward option={locations.find((item) => item.value === location)} language={language} /><PrimaryButton disabled={!location} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('clientDays')} /></Question>}

        {screen === 'clientDays' && <Question title={tx('¿Cuántos días puedes entrenar?', 'How many days can you train?')} step="5 / 7"><Text style={styles.bigValue}>{days}</Text><Text style={styles.valueCaption}>{language === 'es' ? 'días por semana' : 'days per week'}</Text><View style={styles.timeline}>{[2, 3, 4, 5, 6].map((item) => <Pressable key={item} onPress={() => setDays(item)} style={[styles.timelineDot, days === item && styles.timelineDotActive]}><Text style={[styles.timelineText, days === item && styles.timelineTextActive]}>{item}</Text></Pressable>)}</View><View style={styles.reward}><Text style={styles.rewardText}>{language === 'es' ? `${days} días permiten construir un programa realista y sostenible.` : `${days} days allow us to build a realistic and sustainable program.`}</Text></View><PrimaryButton label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('clientDuration')} /></Question>}

        {screen === 'clientDuration' && <Question title={tx('¿Cuánto tiempo tienes por sesión?', 'How much time do you have per session?')} step="6 / 7"><Text style={styles.bigValue}>{formatDuration(duration, language)}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.durationRow}>{Array.from({ length: 9 }, (_, index) => 30 + index * 15).map((item) => <Chip key={item} label={`${item} min`} selected={duration === item} onPress={() => setDuration(item)} />)}</ScrollView><Text style={styles.muted}>{language === 'es' ? 'Selecciona entre 30 minutos y 2 horas y 30 minutos.' : 'Choose between 30 minutes and 2 hours and 30 minutes.'}</Text><PrimaryButton label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('clientHealth')} /></Question>}

        {screen === 'clientHealth' && <Question title={tx('Salud y seguridad', 'Health and safety')} step="7 / 7"><Text style={styles.body}>{language === 'es' ? 'Selecciona todas las opciones que debamos tener en cuenta.' : 'Select every option we should take into account.'}</Text>{healthOptions.map((item) => <CheckRow key={item.value} label={L(item.label)} checked={health.includes(item.value)} onPress={() => toggleHealth(item.value)} />)}{health.some((item) => item !== 'none') && <View style={styles.warning}><Text style={styles.warningTitle}>{language === 'es' ? 'Recomendamos consultar a tu médico' : 'We recommend consulting your doctor'}</Text><Text style={styles.warningText}>{language === 'es' ? 'FortIA no diagnostica ni reemplaza la valoración de un profesional de salud. Comparte cualquier restricción con tu entrenador.' : 'FortIA does not diagnose or replace an assessment by a healthcare professional. Share any restrictions with your coach.'}</Text></View>}<PrimaryButton disabled={health.length === 0} label={language === 'es' ? 'Encontrar mis entrenadores' : 'Find my coaches'} onPress={() => go('matching')} /></Question>}

        {screen === 'recommendations' && <Question title={tx('Entrenadores elegidos para ti', 'Coaches selected for you')} step=""><Text style={styles.body}>{language === 'es' ? 'Datos ficticios para probar el prototipo.' : 'Fictional data for prototype testing.'}</Text>{recommended.map((coach, index) => <View key={coach.id} style={styles.coachCard}><View style={styles.avatar}><Text style={styles.avatarText}>{coach.initials}</Text></View><View style={styles.flex}><Text style={styles.cardTitle}>{coach.name}</Text><Text style={styles.verified}>✓ {language === 'es' ? 'Profesional verificado' : 'Verified professional'}</Text><Text style={styles.body}>{L(coach.methodology)}</Text><Text style={styles.price}>{L(coach.price)}</Text>{index === 0 && <Text style={styles.matchBadge}>{language === 'es' ? 'MEJOR COINCIDENCIA' : 'BEST MATCH'}</Text>}</View></View>)}</Question>}

        {screen === 'coachLegal' && <Question title={tx('Identidad profesional', 'Professional identity')} step="1 / 7"><Text style={styles.body}>{language === 'es' ? 'Estos datos serán privados y usados únicamente para verificación.' : 'This data will remain private and will only be used for verification.'}</Text><Field label={language === 'es' ? 'Nombre legal completo' : 'Full legal name'} value={legalName} onChangeText={setLegalName} /><Field label={language === 'es' ? 'Documento de identidad' : 'Identity document number'} value={documentNumber} onChangeText={setDocumentNumber} /><PrimaryButton disabled={!legalName.trim() || !documentNumber.trim()} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('coachEducation')} /></Question>}

        {screen === 'coachEducation' && <Question title={tx('Formación y certificaciones', 'Education and certifications')} step="2 / 7"><OptionList options={[{ value: 'degree', label: tx('Profesional universitario', 'University professional'), description: tx('Deporte, Educación Física o Fisioterapia.', 'Sports, Physical Education, or Physiotherapy.') }, { value: 'international', label: tx('Certificación internacional', 'International certification'), description: tx('NSCA, NASM, ISSA u otra verificable.', 'NSCA, NASM, ISSA, or another verifiable certification.') }]} value={education} language={language} onSelect={setEducation} /><Field label={language === 'es' ? 'Número de tarjeta o código verificable' : 'Professional card or verification code'} value={credentialNumber} onChangeText={setCredentialNumber} /><PrimaryButton disabled={!education || !credentialNumber.trim()} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('coachDocuments')} /></Question>}

        {screen === 'coachDocuments' && <Question title={tx('Documentos de respaldo', 'Supporting documents')} step="3 / 7"><Text style={styles.body}>{language === 'es' ? 'En el prototipo los archivos no se envían ni almacenan.' : 'In this prototype, files are not uploaded or stored.'}</Text><UploadCard title={language === 'es' ? 'Identificación oficial' : 'Official identification'} uploaded={identityUploaded} onPress={() => setIdentityUploaded(true)} language={language} /><UploadCard title={language === 'es' ? 'Diploma o certificado' : 'Diploma or certificate'} uploaded={certificateUploaded} onPress={() => setCertificateUploaded(true)} language={language} /><View style={styles.notice}><Text style={styles.noticeTitle}>{language === 'es' ? 'Estándar FortIA' : 'FortIA standard'}</Text><Text style={styles.noticeText}>{language === 'es' ? 'La documentación será revisada manualmente por el comité de admisión.' : 'Documents will be reviewed manually by the admissions committee.'}</Text></View><PrimaryButton disabled={!identityUploaded || !certificateUploaded} label={language === 'es' ? 'Comenzar evaluación' : 'Start assessment'} onPress={() => go('coachTestOne')} /></Question>}

        {screen === 'coachTestOne' && <Question title={tx('Caso de seguridad', 'Safety scenario')} step="4 / 7"><Text style={styles.body}>{language === 'es' ? 'Un atleta intermedio reporta una hernia lumbar controlada y molestias al agacharse. ¿Cuál sería tu primera actuación?' : 'An intermediate athlete reports a controlled lumbar disc condition and discomfort when bending. What would be your first action?'}</Text><OptionList options={[{ value: 'a', label: tx('A. Mantener la rutina y subir cargas.', 'A. Keep the routine and increase loads.') }, { value: 'b', label: tx('B. Solicitar valoración profesional y adaptar temporalmente el programa.', 'B. Request professional assessment and temporarily adapt the program.') }, { value: 'c', label: tx('C. Suspender todo ejercicio indefinidamente.', 'C. Stop all exercise indefinitely.') }]} value={testOne} language={language} onSelect={setTestOne} /><PrimaryButton disabled={!testOne} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('coachTestTwo')} /></Question>}

        {screen === 'coachTestTwo' && <Question title={tx('Caso de programación', 'Programming scenario')} step="5 / 7"><Text style={styles.body}>{language === 'es' ? 'Un principiante dispone de 3 días semanales y 45 minutos por sesión. ¿Qué estructura inicial propondrías?' : 'A beginner has 3 days per week and 45 minutes per session. What initial structure would you propose?'}</Text><OptionList options={[{ value: 'a', label: tx('A. Un único músculo por día.', 'A. One muscle per day.') }, { value: 'b', label: tx('B. Cuerpo completo con volumen progresivo.', 'B. Full body with progressive volume.') }, { value: 'c', label: tx('C. Seis sesiones comprimidas en tres días.', 'C. Six sessions compressed into three days.') }]} value={testTwo} language={language} onSelect={setTestTwo} /><PrimaryButton disabled={!testTwo} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('coachCases')} /></Question>}

        {screen === 'coachCases' && <Question title={tx('Casos de éxito', 'Success stories')} step="6 / 7">{cases.map((item, index) => <View key={item.id} style={styles.caseCard}><Text style={styles.cardTitle}>{language === 'es' ? `Caso ${index + 1}` : `Case ${index + 1}`}</Text><Field label={language === 'es' ? 'Objetivo del cliente' : 'Client goal'} value={item.goal} onChangeText={(value) => updateCase(item.id, 'goal', value)} /><Field label={language === 'es' ? 'Duración del proceso' : 'Process duration'} value={item.duration} onChangeText={(value) => updateCase(item.id, 'duration', value)} /><Field label={language === 'es' ? 'Estrategia utilizada' : 'Strategy used'} value={item.strategy} onChangeText={(value) => updateCase(item.id, 'strategy', value)} multiline /><UploadCard title={language === 'es' ? 'Fotos con autorización del cliente (opcional)' : 'Photos with client authorization (optional)'} uploaded={item.hasMedia} onPress={() => updateCase(item.id, 'hasMedia', true)} language={language} /></View>)}<Pressable onPress={addCase} style={styles.addButton}><Text style={styles.addText}>＋ {language === 'es' ? 'Agregar otro caso' : 'Add another case'}</Text></Pressable><PrimaryButton disabled={!cases[0].goal.trim() || !cases[0].duration.trim() || !cases[0].strategy.trim()} label={language === 'es' ? 'Continuar' : 'Continue'} onPress={() => go('coachPhilosophy')} /></Question>}

        {screen === 'coachPhilosophy' && <Question title={tx('Tu filosofía de trabajo', 'Your coaching philosophy')} step="7 / 7"><Text style={styles.body}>{language === 'es' ? 'Puedes seleccionar más de un pilar.' : 'You may select more than one pillar.'}</Text>{philosophies.map((item) => <CheckRow key={item.value} label={L(item.label)} checked={philosophy.includes(item.value)} onPress={() => togglePhilosophy(item.value)} />)}<PrimaryButton disabled={philosophy.length === 0} label={language === 'es' ? 'Enviar postulación' : 'Submit application'} onPress={() => setScreen('coachSubmitted')} /></Question>}

        {screen === 'coachAudit' && <Question title={tx('Perfil en auditoría', 'Profile under review')} step=""><View style={styles.auditBadge}><Text style={styles.auditText}>{language === 'es' ? 'REVISIÓN PENDIENTE' : 'REVIEW PENDING'}</Text></View><Text style={styles.body}>{language === 'es' ? 'Puedes explorar las herramientas, pero aún no puedes recibir clientes.' : 'You can explore the tools, but you cannot receive clients yet.'}</Text>{['Clientes', 'Programas', 'Solicitudes'].map((item) => <View key={item} style={styles.lockedCard}><Text style={styles.cardTitle}>🔒 {item}</Text><Text style={styles.muted}>{language === 'es' ? 'Disponible tras la verificación de credenciales.' : 'Available after credential verification.'}</Text></View>)}</Question>}
      </ScrollView>
    </SafeAreaView>
  );
}

function Welcome({ language, onStart }: { language: Language; onStart: () => void }) {
  return <View style={styles.welcome}><Image source={require('./assets/fortia-logo.png')} style={styles.heroLogo} /><Text style={styles.eyebrow}>{language === 'es' ? 'ENTRENAMIENTO PERSONAL, A TU RITMO' : 'PERSONAL TRAINING, AT YOUR PACE'}</Text><Text style={styles.heroTitle}>{language === 'es' ? 'Encuentra entrenadores personalizados hechos para ti.' : 'Find personalized coaches made for you.'}</Text><Text style={styles.body}>{language === 'es' ? 'Profesionales verificados, programación y seguimiento en un solo lugar.' : 'Verified professionals, programming, and follow-up in one place.'}</Text><Pressable onPress={onStart} style={styles.googleButton}><Text style={styles.googleLetter}>G</Text><Text style={styles.googleText}>{language === 'es' ? 'Continuar con Google' : 'Continue with Google'}</Text></Pressable><Pressable onPress={onStart} style={styles.emailButton}><Text style={styles.emailText}>✉  {language === 'es' ? 'Continuar con correo' : 'Continue with email'}</Text></Pressable><View style={styles.signInRow}><Text style={styles.muted}>{language === 'es' ? '¿Ya tienes una cuenta? ' : 'Already have an account? '}</Text><Pressable onPress={() => Alert.alert(language === 'es' ? 'Inicio de sesión' : 'Sign in', language === 'es' ? 'Se conectará al backend en una entrega posterior.' : 'This will connect to the backend in a future delivery.')}><Text style={styles.link}>{language === 'es' ? 'Iniciar sesión' : 'Sign in'}</Text></Pressable></View></View>;
}

function RoleScreen({ language, onRole }: { language: Language; onRole: (role: Role) => void }) {
  return <Question title={tx('¿Cómo usarás FortIA?', 'How will you use FortIA?')} step=""><RoleCard title={language === 'es' ? 'Quiero entrenar' : 'I want to train'} body={language === 'es' ? 'Encuentra al profesional adecuado y sigue tu progreso.' : 'Find the right professional and track your progress.'} onPress={() => onRole('client')} /><RoleCard title={language === 'es' ? 'Soy entrenador' : 'I am a coach'} body={language === 'es' ? 'Gestiona clientes, programas y seguimiento.' : 'Manage clients, programs, and follow-up.'} onPress={() => onRole('coach')} /></Question>;
}

function Question({ title, step, children }: { title: Localized; step: string; children: React.ReactNode }) {
  const language: Language = getLocales()[0]?.languageCode === 'en' ? 'en' : 'es';
  return <View style={styles.question}>{step ? <Text style={styles.eyebrow}>{step}</Text> : null}<Text style={styles.title}>{title[language]}</Text>{children}</View>;
}

function OptionList({ options, value, language, onSelect }: { options: Option[]; value: string; language: Language; onSelect: (value: string) => void }) {
  return <View style={styles.optionList}>{options.map((item) => <Pressable key={item.value} onPress={() => onSelect(item.value)} style={[styles.option, value === item.value && styles.optionSelected]}><Text style={styles.optionMark}>{value === item.value ? '●' : '○'}</Text><View style={styles.flex}><Text style={styles.optionTitle}>{item.label[language]}</Text>{item.description && <Text style={styles.optionDescription}>{item.description[language]}</Text>}</View></Pressable>)}</View>;
}

function Reward({ option, language }: { option?: Option; language: Language }) {
  if (!option?.reward) return null;
  return <View style={styles.reward}><Text style={styles.rewardIcon}>✦</Text><Text style={styles.rewardText}>{option.reward[language]}</Text></View>;
}

function RoleCard({ title, body, onPress }: { title: string; body: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.roleCard}><View style={styles.flex}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.body}>{body}</Text></View><Text style={styles.arrow}>›</Text></Pressable>; }
function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></Pressable>; }
function CheckRow({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={[styles.checkRow, checked && styles.checkRowSelected]}><View style={[styles.checkbox, checked && styles.checkboxChecked]}><Text style={styles.checkmark}>{checked ? '✓' : ''}</Text></View><Text style={styles.checkLabel}>{label}</Text></Pressable>; }
function PrimaryButton({ label, disabled = false, onPress }: { label: string; disabled?: boolean; onPress: () => void }) { return <Pressable disabled={disabled} onPress={onPress} style={[styles.primary, disabled && styles.disabled]}><Text style={styles.primaryText}>{label}</Text></Pressable>; }
function Field({ label, value, onChangeText, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} multiline={multiline} style={[styles.input, multiline && styles.inputMultiline]} placeholderTextColor="#64748B" /></View>; }
function UploadCard({ title, uploaded, onPress, language }: { title: string; uploaded: boolean; onPress: () => void; language: Language }) { return <Pressable onPress={onPress} style={[styles.upload, uploaded && styles.uploadDone]}><Text style={styles.uploadIcon}>{uploaded ? '✓' : '↑'}</Text><View style={styles.flex}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{uploaded ? (language === 'es' ? 'Archivo simulado agregado' : 'Demo file added') : (language === 'es' ? 'Tomar foto o seleccionar PDF' : 'Take a photo or select a PDF')}</Text></View></Pressable>; }
function formatDuration(minutes: number, language: Language) { const hours = Math.floor(minutes / 60); const rest = minutes % 60; if (!hours) return `${rest} min`; return rest ? `${hours} h ${rest} min` : `${hours} ${language === 'es' ? 'hora' : 'hour'}${hours > 1 ? 's' : ''}`; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08111E' }, page: { flexGrow: 1, padding: 24, paddingBottom: 48 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28 }, centerPage: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 28 }, header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }, logo: { width: 36, height: 36, resizeMode: 'contain' }, brand: { color: '#F8FAFC', fontSize: 25, fontWeight: '900' }, red: { color: '#FF4D57' }, splashLogo: { width: 142, height: 142, resizeMode: 'contain' }, brandLarge: { color: '#F8FAFC', fontSize: 36, fontWeight: '900' }, back: { minHeight: 38, justifyContent: 'center' }, backText: { color: '#AAB8CA', fontSize: 15, fontWeight: '700' },
  welcome: { gap: 16, paddingTop: 8 }, heroLogo: { width: 106, height: 106, resizeMode: 'contain', alignSelf: 'center', marginBottom: 10 }, eyebrow: { color: '#C7FF38', fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }, heroTitle: { color: '#F8FAFC', fontSize: 35, lineHeight: 42, fontWeight: '900', letterSpacing: -1.1 }, title: { color: '#F8FAFC', fontSize: 30, lineHeight: 37, fontWeight: '900', letterSpacing: -0.8 }, titleCenter: { color: '#F8FAFC', fontSize: 30, lineHeight: 37, fontWeight: '900', textAlign: 'center' }, body: { color: '#B3C0D0', fontSize: 15, lineHeight: 23 }, bodyCenter: { color: '#B3C0D0', fontSize: 16, lineHeight: 24, textAlign: 'center' }, muted: { color: '#8292A7', fontSize: 13, lineHeight: 19 },
  googleButton: { minHeight: 56, marginTop: 12, borderRadius: 16, backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, googleLetter: { color: '#4285F4', fontSize: 22, fontWeight: '900' }, googleText: { color: '#0F172A', fontSize: 16, fontWeight: '900' }, emailButton: { minHeight: 56, borderRadius: 16, borderWidth: 1, borderColor: '#53647A', alignItems: 'center', justifyContent: 'center' }, emailText: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' }, signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 5 }, link: { color: '#C7FF38', fontSize: 13, fontWeight: '900' },
  question: { gap: 16 }, optionList: { gap: 10 }, option: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 16, borderRadius: 17, backgroundColor: '#142134', borderWidth: 1, borderColor: '#31445D' }, optionSelected: { backgroundColor: '#1B332B', borderColor: '#C7FF38' }, optionMark: { color: '#C7FF38', fontSize: 18 }, optionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' }, optionDescription: { color: '#95A6BB', fontSize: 13, lineHeight: 19, marginTop: 4 }, flex: { flex: 1 }, primary: { minHeight: 56, borderRadius: 16, backgroundColor: '#C7FF38', alignItems: 'center', justifyContent: 'center', marginTop: 5 }, primaryText: { color: '#08111E', fontSize: 16, fontWeight: '900' }, disabled: { opacity: 0.38 }, reward: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 15, backgroundColor: '#172C37', borderWidth: 1, borderColor: '#285160' }, rewardIcon: { color: '#C7FF38', fontSize: 17 }, rewardText: { flex: 1, color: '#D8F5EA', fontSize: 13, lineHeight: 19, fontWeight: '600' }, roleCard: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 19, borderRadius: 19, backgroundColor: '#142134', borderWidth: 1, borderColor: '#31445D' }, cardTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '900' }, arrow: { color: '#C7FF38', fontSize: 32 },
  bodyMap: { width: 220, height: 330, alignSelf: 'center', borderRadius: 22, overflow: 'hidden', backgroundColor: '#050A10' }, bodyImage: { width: '100%', height: '100%', resizeMode: 'cover' }, bodyZone: { position: 'absolute', left: 38, width: 144, borderWidth: 2, borderColor: 'transparent', borderRadius: 18 }, upperZone: { top: 40, height: 100 }, coreZone: { top: 140, height: 70 }, lowerZone: { top: 212, height: 112 }, bodyZoneSelected: { borderColor: '#C7FF38', backgroundColor: 'rgba(199,255,56,0.10)' }, chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }, chip: { paddingVertical: 10, paddingHorizontal: 13, borderRadius: 99, borderWidth: 1, borderColor: '#3B4E66', backgroundColor: '#142134' }, chipSelected: { borderColor: '#C7FF38', backgroundColor: '#1B332B' }, chipText: { color: '#AAB8CA', fontSize: 13, fontWeight: '800' }, chipTextSelected: { color: '#C7FF38' },
  bigValue: { color: '#C7FF38', fontSize: 58, fontWeight: '900', textAlign: 'center', marginTop: 8 }, valueCaption: { color: '#95A6BB', textAlign: 'center', fontSize: 14 }, timeline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 }, timelineDot: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1A2A3E', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3B4E66' }, timelineDotActive: { backgroundColor: '#C7FF38', borderColor: '#C7FF38' }, timelineText: { color: '#C8D2DF', fontWeight: '900' }, timelineTextActive: { color: '#08111E' }, durationRow: { gap: 8, paddingVertical: 5 },
  checkRow: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 15, backgroundColor: '#142134', borderWidth: 1, borderColor: '#31445D' }, checkRowSelected: { borderColor: '#C7FF38' }, checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 1, borderColor: '#64748B', alignItems: 'center', justifyContent: 'center' }, checkboxChecked: { backgroundColor: '#C7FF38', borderColor: '#C7FF38' }, checkmark: { color: '#08111E', fontWeight: '900' }, checkLabel: { flex: 1, color: '#E5EBF2', fontSize: 14, lineHeight: 20, fontWeight: '700' }, warning: { padding: 16, borderRadius: 16, backgroundColor: '#382819', borderWidth: 1, borderColor: '#A96823', gap: 6 }, warningTitle: { color: '#FFD18A', fontSize: 15, fontWeight: '900' }, warningText: { color: '#F2D8B4', fontSize: 13, lineHeight: 20 },
  magicOrb: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#172C37', borderWidth: 2, borderColor: '#C7FF38', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, coachCard: { flexDirection: 'row', gap: 14, padding: 17, borderRadius: 19, backgroundColor: '#142134', borderWidth: 1, borderColor: '#31445D' }, avatar: { width: 50, height: 50, borderRadius: 17, backgroundColor: '#FF4D57', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#FFF', fontWeight: '900' }, verified: { color: '#C7FF38', fontSize: 12, fontWeight: '800', marginTop: 3 }, price: { color: '#F8FAFC', fontSize: 14, fontWeight: '900', marginTop: 5 }, matchBadge: { alignSelf: 'flex-start', color: '#08111E', backgroundColor: '#C7FF38', borderRadius: 99, overflow: 'hidden', paddingVertical: 5, paddingHorizontal: 8, fontSize: 9, fontWeight: '900', marginTop: 7 },
  field: { gap: 7 }, fieldLabel: { color: '#DCE4ED', fontSize: 13, fontWeight: '800' }, input: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: '#3B4E66', backgroundColor: '#101C2D', color: '#F8FAFC', paddingHorizontal: 14, fontSize: 15 }, inputMultiline: { minHeight: 92, paddingTop: 13, textAlignVertical: 'top' }, upload: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#53647A', backgroundColor: '#101C2D' }, uploadDone: { borderColor: '#C7FF38', borderStyle: 'solid' }, uploadIcon: { color: '#C7FF38', fontSize: 23, fontWeight: '900' }, notice: { padding: 16, borderRadius: 16, backgroundColor: '#15263A', borderWidth: 1, borderColor: '#33506D', gap: 6 }, noticeTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' }, noticeText: { color: '#AAB8CA', fontSize: 13, lineHeight: 19 }, caseCard: { gap: 12, padding: 16, borderRadius: 18, backgroundColor: '#142134', borderWidth: 1, borderColor: '#31445D' }, addButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#53647A' }, addText: { color: '#C7FF38', fontSize: 14, fontWeight: '900' }, seal: { width: 104, height: 104, borderRadius: 52, backgroundColor: '#C7FF38', alignItems: 'center', justifyContent: 'center' }, sealText: { color: '#08111E', fontSize: 52, fontWeight: '900' }, auditBadge: { alignSelf: 'flex-start', borderRadius: 99, backgroundColor: '#493719', paddingHorizontal: 12, paddingVertical: 7 }, auditText: { color: '#FFD18A', fontSize: 11, fontWeight: '900' }, lockedCard: { padding: 17, borderRadius: 17, backgroundColor: '#142134', borderWidth: 1, borderColor: '#31445D', gap: 6, opacity: 0.75 },
});
