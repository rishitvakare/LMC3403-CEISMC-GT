/* CEISMC Pathfinder — zero-dependency, client-side recommendations.
   Embed: <div id="ceismc-pathfinder"></div> and load the CSS + this script.
   Content links verified against public CEISMC / Georgia Tech K-12 pages in Oct 2026.
   This is an independent exploratory guide, not an official CEISMC assessment. */
(() => {
  'use strict';
  const ROOT_ID = 'ceismc-pathfinder';
  const icon = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.1 6M20 4v7h-7"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/></svg>'
  };
  const O = (value, title, description, emoji) => ({value,title,description,emoji});
  const GRADES = [O('k-1','K–1','Early explorers','🌱'),O('2-5','Grades 2–5','Elementary','🧩'),O('6-8','Grades 6–8','Middle school','🧪'),O('9-12','Grades 9–12','High school','🚀')];
  const EDUCATOR_GRADES = [O('pk-2','Pre-K–2','Early learning','🌱'),O('3-5','Grades 3–5','Elementary','🧩'),GRADES[2],GRADES[3]];
  const TOPICS = [O('coding','Coding & technology','Build with computers','💻'),O('engineering','Engineering & design','Invent and build things','⚙️'),O('science','Science & discovery','Explore how things work','🔬'),O('math','Math & puzzles','Find patterns and solve','🔢'),O('creative','Art, music & STEAM','Blend creativity with STEM','🎨')];
  const STUDENT_QUESTIONS = [
    {id:'grade',eyebrow:'A little about you',title:'What grade are you in?',description:'We’ll only show programs suited to your school level.',options:GRADES},
    {id:'topic',eyebrow:'Your curiosity compass',title:'Which adventure sounds the most fun?',description:'There are no wrong answers. Pick what catches your eye.',options:TOPICS},
    {id:'focus',eyebrow:'Your growth zone',title:'What would you like to get better at?',description:'Everyone has something they want to practice more.',options:[O('coding','Coding and logical steps','Make a program work','🧠'),O('engineering','Planning and building','Try, test and improve','🏗️'),O('science','Scientific questions','Experiment and explain','🔎'),O('math','Math and number patterns','Work through puzzles','📐'),O('creative','Creative problem-solving','Turn ideas into projects','✨')]},
    {id:'warmup',eyebrow:'60-second brain teaser',title:'A tiny challenge — just for fun',description:'One quick question, not a grade or a formal skill test.',dynamic:true},
    {id:'style',eyebrow:'Your learning superpower',title:'How do you like to learn?',description:'This helps us recommend the best kind of experience.',options:[O('hands','Build it with my hands','Make, tinker, test','🛠️'),O('digital','Try it on a computer','Code, remix and explore','🖥️'),O('explore','Experiment and discover','Ask questions, investigate','🧬'),O('team','Work with a team','Compete, share and create','🤝')]}
  ];
  const EDUCATOR_QUESTIONS = [
    {id:'grade',eyebrow:'Your learners',title:'What grade levels do you teach?',description:'Choose the group that best describes your classroom.',options:EDUCATOR_GRADES},
    {id:'topic',eyebrow:'Your subject',title:'Which topic are you focusing on?',description:'We’ll prioritize the relevant curricula and professional learning.',options:TOPICS},
    {id:'goal',eyebrow:'Your teaching goal',title:'What do you need most right now?',description:'Think of what would make the biggest difference this term.',options:[O('curriculum','Classroom-ready lessons','Activities and teaching materials','📚'),O('pd','Professional development','Build new skills and connections','🎓'),O('engagement','Engaging student experiences','Hands-on projects and challenges','🚀'),O('outreach','STEM experts and partners','Connect with Georgia Tech','🤝')]},
    {id:'format',eyebrow:'A practical fit',title:'How would you prefer to use it?',description:'We’ll make the recommendations more realistic for your schedule.',options:[O('classroom','In my classroom','Lessons I can use with students','🏫'),O('professional','In teacher workshops','Learn with fellow educators','👩‍🏫'),O('virtual','Online or flexible','Explore at my own pace','💻'),O('campus','Through GT programs','Events or hands-on experiences','📍')]}
  ];
  const SCHOOL_QUESTIONS = [
    {id:'grade',eyebrow:'Your school community',title:'Which grade levels do you serve?',description:'Choose the closest fit for the initiative you have in mind.',options:[O('all','Across grade levels','School- or district-wide','🏛️'),...EDUCATOR_GRADES]},
    {id:'topic',eyebrow:'The big priority',title:'Where do you want to expand opportunity?',description:'Pick one starting point; the resources can support several.',options:TOPICS},
    {id:'goal',eyebrow:'Your program needs',title:'What kind of support would help most?',description:'We’ll point you to relevant CEISMC teams, programs and tools.',options:[O('outreach','Build a GT partnership','Speakers, experts, coordination','🤝'),O('curriculum','Strengthen STEM curriculum','Materials and teaching models','📚'),O('pd','Support educators','Workshops and teacher development','🎓'),O('engagement','Grow student participation','Clubs, events and challenges','🚀')]},
    {id:'format',eyebrow:'How it should work',title:'What is your preferred approach?',description:'Match your next step to your school’s needs.',options:[O('classroom','School-based learning','Support for everyday teaching','🏫'),O('professional','Teacher training','Help educators lead programs','🎓'),O('virtual','Remote resources','Flexible access across teams','💻'),O('campus','Campus connections','Events, experts and visits','📍')]}
  ];
  const WARMUPS = {
    'k-1':{question:'What number comes next? 2, 4, 6, ___',options:[O('6','6','', '🌟'),O('7','7','', '⭐'),O('8','8','', '✨'),O('10','10','', '💫')],answer:'8',hint:'Count up by 2 each time.'},
    '2-5':{question:'The numbers double: 3, 6, 12, ___',options:[O('15','15','', '🌟'),O('18','18','', '⭐'),O('24','24','', '✨'),O('36','36','', '💫')],answer:'24',hint:'Multiply the previous number by 2.'},
    '6-8':{question:'A robot moves 3 meters each second for 4 seconds. How far?',options:[O('7','7 meters','', '🌟'),O('12','12 meters','', '✨'),O('16','16 meters','', '⭐'),O('24','24 meters','', '💫')],answer:'12',hint:'Distance equals speed times time.'},
    '9-12':{question:'A model starts at 50 units and increases by 20%. What is the new amount?',options:[O('55','55 units','', '🌟'),O('60','60 units','', '✨'),O('70','70 units','', '⭐'),O('100','100 units','', '💫')],answer:'60',hint:'20% of 50 is 10; add that to 50.'}
  };

  // Categories/tags deliberately map to actual CEISMC programs, not generic external links.
  // grade keys: any = broadly applicable; PK2 = Pre-K–2; 2-5 = specific extracurricular eligibility.
  const RESOURCES = [
    {id:'kids',roles:['student'],title:'KIDS Club',sub:'Saturday STEAM experiences',url:'https://expandedlearning.ceismc.gatech.edu/kidsclub',label:'Expanded Learning · Atlanta',grades:['2-5'],topics:['coding','engineering','science','math','creative'],styles:['hands','explore'],goals:['engagement'],icon:'🧩',note:'Designed for grades 2–5; verify current session dates and fees.',why:'Explore several STEM areas through hands-on Saturday experiences.'},
    {id:'workshops',roles:['student'],title:'STEAM Workshops',sub:'Explore new STEM interests on Saturdays',url:'https://expandedlearning.ceismc.gatech.edu/steamworkshops',label:'Expanded Learning · Atlanta',grades:['6-8','9-12'],topics:['coding','engineering','science','creative','math'],styles:['hands','explore'],goals:['engagement'],icon:'🔬',note:'Programs for grades 6–12; check the upcoming workshop calendar.',why:'Try science, engineering and technology topics in a hands-on setting.'},
    {id:'peaks',roles:['student'],title:'Summer PEAKS',sub:'Hands-on summer STEM exploration',url:'https://www.expandedlearning.ceismc.gatech.edu/',label:'CEISMC · Summer enrichment',grades:['2-5','6-8','9-12'],topics:['coding','engineering','science','math','creative'],styles:['hands','explore','digital'],goals:['engagement'],icon:'☀️',note:'Programs are intended for rising grades 2–12. See current offerings and enrollment details.',why:'Build confidence and explore STEM topics in a themed summer experience.'},
    {id:'inventure-student',roles:['student'],title:'K–12 InVenture Prize',sub:'Turn an idea into an invention',url:'https://k12inventure.gatech.edu/',label:'CEISMC-related · Invention challenge',grades:['k-1','2-5','6-8','9-12'],topics:['engineering','creative','science','math'],styles:['hands','team'],goals:['engagement'],icon:'💡',note:'Competition participation and grade divisions vary; see program rules.',why:'Practice design thinking and creative problem-solving with an invention challenge.'},
    {id:'earsketch-student',roles:['student'],title:'EarSketch',sub:'Make music with Python or JavaScript',url:'https://earsketch.gatech.edu/',label:'Georgia Tech · Computing + music',grades:['6-8','9-12'],topics:['coding','creative','math'],styles:['digital'],goals:['engagement'],icon:'🎛️',note:'Free coding and music learning environment; designed for middle and high school use.',why:'Combine creative expression with computer science through composing and coding.'},
    {id:'fll',roles:['student'],title:'FIRST LEGO League',sub:'Team up to solve a robotics challenge',url:'https://fll.gatech.edu/',label:'Georgia Tech · Robotics',grades:['2-5','6-8'],topics:['coding','engineering','science','math'],styles:['hands','team'],goals:['engagement'],icon:'🤖',note:'Age divisions, team participation and registration are set by the program.',why:'Explore teamwork, engineering and robotics through hands-on challenges.'},
    {id:'student-hub',roles:['student'],title:'K–12 Student Resources',sub:'Browse CEISMC and Georgia Tech opportunities',url:'https://k12.gatech.edu/k12-resources/k-12-student-resources',label:'Georgia Tech · Student directory',grades:['k-1','2-5','6-8','9-12'],topics:['coding','engineering','science','math','creative'],styles:['hands','digital','explore','team'],goals:['engagement'],icon:'🧭',note:'Includes enrichment, internships and events; eligibility varies by program.',why:'Find additional age-appropriate opportunities in Georgia Tech’s student resource directory.'},
    {id:'resource-library-student',roles:['student'],title:'CEISMC Resource Search',sub:'Find projects and learning materials',url:'https://resources.ceismc.gatech.edu/',label:'CEISMC · Searchable library',grades:['k-1','2-5','6-8','9-12'],topics:['coding','engineering','science','math','creative'],styles:['digital','explore'],goals:['curriculum'],icon:'📂',note:'Filter by grade, subject and resource type; some resources are educator-facing.',why:'Use CEISMC’s grade and subject filters to explore more in your chosen area.'},
    {id:'gift',roles:['teacher','school'],title:'GIFT Fellowships',sub:'Real-world STEM immersion for educators',url:'https://ceismc.gatech.edu/gift',label:'CEISMC · Professional development',grades:['pk-2','3-5','6-8','9-12','all'],topics:['coding','engineering','science','math'],styles:['professional','campus'],goals:['pd'],icon:'🎓',note:'For eligible Georgia K–12 teachers; consult current application requirements.',why:'Bring real STEM research and industry experiences back to the classroom.'},
    {id:'codeorg',roles:['teacher','school'],title:'Code.org Regional Partner',sub:'Georgia computer science teacher training',url:'https://ceismc.gatech.edu/community/codeorg',label:'CEISMC · Teacher workshops',grades:['pk-2','3-5','6-8','9-12','all'],topics:['coding'],styles:['professional','classroom'],goals:['pd','curriculum'],icon:'💻',note:'Workshops and scholarship eligibility vary by cohort.',why:'Support school computer science with CEISMC’s Code.org curriculum and training partnership.'},
    {id:'stemid',roles:['teacher','school'],title:'STEM-ID / AMP-IT-UP',sub:'Middle school engineering curriculum',url:'https://stem-id.ceismc.gatech.edu/',label:'CEISMC · Curriculum',grades:['6-8','all'],topics:['engineering','math','science'],styles:['classroom','virtual'],goals:['curriculum','engagement'],icon:'📐',note:'Primarily developed for middle school engineering, science and math.',why:'Use engineering design challenges that connect science and mathematics.'},
    {id:'invteach',roles:['teacher','school'],title:'K–12 InVenture Prize',sub:'Invention education and competition',url:'https://k12inventure.gatech.edu/',label:'Georgia Tech · Curriculum + challenge',grades:['pk-2','3-5','6-8','9-12','all'],topics:['engineering','creative','science'],styles:['classroom','campus'],goals:['curriculum','engagement'],icon:'💡',note:'Consult program details for grade-level resources and competition eligibility.',why:'Help learners move from a real problem to an invention they can present.'},
    {id:'ceismc-library',roles:['teacher','school'],title:'CEISMC Resource Search',sub:'Filter instructional materials by topic and grade',url:'https://resources.ceismc.gatech.edu/',label:'CEISMC · Instructional materials',grades:['pk-2','3-5','6-8','9-12','all'],topics:['coding','engineering','science','math','creative'],styles:['classroom','virtual'],goals:['curriculum'],icon:'📂',note:'Search by grade, subject, program and resource format.',why:'Find CEISMC’s actual lessons, media and educator resources in one place.'},
    {id:'earsketch-teacher',roles:['teacher','school'],title:'EarSketch Curriculum',sub:'Teach programming through music',url:'https://k12.gatech.edu/k12-resources/k-12-teacher-resources',label:'Georgia Tech · Teacher resources',grades:['6-8','9-12','all'],topics:['coding','creative'],styles:['classroom','virtual'],goals:['curriculum','engagement'],icon:'🎼',note:'The linked teacher hub includes EarSketch and other computer science resources.',why:'Bring creative coding into a middle or high school classroom.'},
    {id:'d2d',roles:['teacher','school'],title:'Direct to Discovery',sub:'Remote STEM expertise for classrooms',url:'https://k12.gatech.edu/k12-resources/k-12-teacher-resources',label:'GT/GTRI · Virtual learning',grades:['pk-2','3-5','6-8','9-12','all'],topics:['science','engineering','coding','math'],styles:['virtual','classroom'],goals:['outreach','engagement'],icon:'📡',note:'Access program information through Georgia Tech’s teacher resources directory.',why:'Connect students with authentic inquiry and Georgia Tech researchers remotely.'},
    {id:'assistance',roles:['teacher','school'],title:'Request GT K–12 Assistance',sub:'Connect your school with Georgia Tech',url:'https://k12.gatech.edu/assistance-request',label:'Georgia Tech · Campus & community',grades:['pk-2','3-5','6-8','9-12','all'],topics:['coding','engineering','science','math','creative'],styles:['campus','virtual','classroom'],goals:['outreach'],icon:'🤝',note:'For speaker requests, the university recommends submitting at least 30 days ahead.',why:'Ask the Campus and Community Coordination team about speakers, resources and potential connections.'},
    {id:'teacher-hub',roles:['teacher','school'],title:'K–12 Teacher Resources',sub:'Georgia Tech’s educator opportunity hub',url:'https://k12.gatech.edu/k12-resources/k-12-teacher-resources',label:'Georgia Tech · Educator directory',grades:['pk-2','3-5','6-8','9-12','all'],topics:['coding','engineering','science','math','creative'],styles:['virtual','classroom','professional','campus'],goals:['curriculum','pd','engagement','outreach'],icon:'📚',note:'Directory covers curricula, events, professional development and tours.',why:'Compare CEISMC and Georgia Tech’s educator offerings in one official list.'},
    {id:'steamlead',roles:['teacher','school'],title:'STEAM Leadership Conference',sub:'Connect with leaders in K–12 STEAM',url:'https://steamleadership.ceismc.gatech.edu/',label:'CEISMC · Leadership',grades:['pk-2','3-5','6-8','9-12','all'],topics:['coding','engineering','science','math','creative'],styles:['professional','campus'],goals:['pd','outreach'],icon:'🎤',note:'Conference programming and dates can change.',why:'Explore STEAM leadership practices and network with fellow educators.'}
  ];

  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const TAG_LABEL = Object.fromEntries([...TOPICS, ...GRADES, ...EDUCATOR_GRADES].map(x=>[x.value,x.title]));
  const PROFILE = {coding:['The Code Creator','Logic, systems and creative technology'],engineering:['The Future Builder','Design, invention and hands-on problem solving'],science:['The Curious Scientist','Observation, experiments and discovery'],math:['The Pattern Finder','Numbers, patterns and precise thinking'],creative:['The STEAM Storyteller','Art, music and inventive problem solving']};
  function makeApp(root) {
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const state = {role:null,step:-1,answers:{},result:false};
    const questions = () => ({student:STUDENT_QUESTIONS,teacher:EDUCATOR_QUESTIONS,school:SCHOOL_QUESTIONS})[state.role] || [];
    const getWarmup = () => WARMUPS[state.answers.grade] || WARMUPS['6-8'];
    const progress = () => !state.role ? 0 : state.result ? 100 : Math.round(((state.step+1) / (questions().length+1)) *100);
    const heading = role => role==='student' ? 'Student explorer' : role==='teacher' ? 'Teacher / educator' : 'School / district leader';

    function cards(options,id) {
      return `<div class="gtf-options ${options.length===4?'gtf-options--four':''}" role="group" aria-label="Choose an answer">${options.map(o => `<button type="button" class="gtf-option ${state.answers[id]===o.value?'is-selected':''}" data-answer="${safe(o.value)}" aria-pressed="${state.answers[id]===o.value}"><span class="gtf-option__emoji" aria-hidden="true">${o.emoji||'✦'}</span><span class="gtf-option__copy"><strong>${safe(o.title)}</strong>${o.description?`<span>${safe(o.description)}</span>`:''}</span><span class="gtf-option__select" aria-hidden="true">${icon.check}</span></button>`).join('')}</div>`;
    }
    function hero() {
      const resultTitle = state.role==='student'?'Your curiosity has a direction.':state.role==='teacher'?'Teach with a little more Tech.':'Connect your school to possibility.';
      return `<aside class="gtf-intro"><div class="gtf-brand"><span class="gtf-brand__mark" aria-hidden="true">GT<span>✦</span></span><span>GEORGIA TECH <b>·</b> CEISMC</span></div><div class="gtf-intro__orbits" aria-hidden="true"><span class="gtf-orbit gtf-orbit--one"></span><span class="gtf-orbit gtf-orbit--two"></span><span class="gtf-orbit__core">✦</span><span class="gtf-orbit__mini gtf-orbit__mini--a">⚛</span><span class="gtf-orbit__mini gtf-orbit__mini--b">⌘</span><span class="gtf-orbit__mini gtf-orbit__mini--c">✧</span></div><div class="gtf-eyebrow"><span class="gtf-eyebrow__dot"></span> INTERACTIVE RESOURCE GUIDE</div><h2>${state.result?resultTitle:'Find your <em>next spark.</em>'}</h2><p>${state.result?'A CEISMC-connected path, made around what matters to you.':'Answer a few quick questions. Discover real Georgia Tech CEISMC opportunities for learners, teachers and schools.'}</p><div class="gtf-intro__divider"></div><div class="gtf-intro__foot"><span class="gtf-bullet">✦</span><div><strong>Made for exploration</strong><span>No sign-up. No personal information. Just a smarter place to start.</span></div></div></aside>`;
    }
    function roleView() {
      const opts = [
        {id:'student',icon:'🎒',title:'I’m a student',desc:'Discover your STEM interests and what to try next.'},
        {id:'teacher',icon:'📖',title:'I’m an educator',desc:'Find lessons, training and classroom experiences.'},
        {id:'school',icon:'🏫',title:'I represent a school',desc:'Explore resources, programs and GT connections.'}
      ];
      return `<div class="gtf-stage" id="gtf-stage" tabindex="-1"><div class="gtf-stage__top"><span class="gtf-step-label">LET’S GET STARTED</span><span class="gtf-step-count">CHOOSE A PATH</span></div><h3>How can we help you explore?</h3><p class="gtf-description">Choose the path that feels right. Your recommendations will be tailored to you.</p><div class="gtf-roles">${opts.map(o=>`<button type="button" class="gtf-role" data-role="${o.id}"><span class="gtf-role__icon" aria-hidden="true">${o.icon}</span><span class="gtf-role__text"><strong>${o.title}</strong><small>${o.desc}</small></span><span class="gtf-role__arrow">${icon.arrow}</span></button>`).join('')}</div><p class="gtf-fineprint">A casual discovery guide, not a formal educational assessment or an enrollment application.</p></div>`;
    }
    function stepView() {
      const q = questions()[state.step];
      const warmup = q.dynamic ? getWarmup() : null;
      const title = warmup ? warmup.question : q.title;
      const options = warmup ? warmup.options : q.options;
      const selected = Object.hasOwn(state.answers,q.id);
      return `<div class="gtf-stage" id="gtf-stage" tabindex="-1"><div class="gtf-stage__top"><span class="gtf-step-label">${safe(q.eyebrow)}</span><span class="gtf-step-count">${String(state.step+2).padStart(2,'0')} / ${String(questions().length+1).padStart(2,'0')}</span></div><div class="gtf-stage__role"><span aria-hidden="true">${state.role==='student'?'🎒':state.role==='teacher'?'📖':'🏫'}</span>${heading(state.role)}</div><h3>${safe(title)}</h3><p class="gtf-description">${safe(q.description)}</p>${cards(options,q.id)}<div class="gtf-controls"><button class="gtf-btn gtf-btn--ghost" data-back>${icon.back} Back</button><button class="gtf-btn gtf-btn--primary" data-next ${selected?'':'disabled'}>${state.step===questions().length-1?'Show my pathway':'Continue'} ${icon.arrow}</button></div></div>`;
    }
    function gradeMatches(r, grade) {
      if (r.grades.includes(grade)||r.grades.includes('all')) return true;
      return (grade==='pk-2'&&r.grades.includes('k-1')) || (grade==='3-5'&&r.grades.includes('2-5')) || (grade==='2-5'&&r.grades.includes('3-5'));
    }
    function recommendations() {
      const a=state.answers;
      return RESOURCES.filter(r=>r.roles.includes(state.role)&&gradeMatches(r,a.grade)).map(r=>{
        let score=1;
        if(r.topics.includes(a.topic)) score+=8;
        if(state.role==='student') {
          if(r.topics.includes(a.focus)) score+=3;
          if(r.styles.includes(a.style)) score+=5;
          if(r.id==='student-hub'||r.id==='resource-library-student') score-=7;
          if(a.grade==='k-1'&&r.id==='resource-library-student') score+=5;
          if(a.topic==='coding'&&r.id==='earsketch-student') score+=3;
          if(a.topic==='engineering'&&r.id==='inventure-student') score+=2;
        } else {
          if(r.goals.includes(a.goal)) score+=13;
          if(r.styles.includes(a.format)) score+=5;
          if(state.role==='school'&&a.goal==='outreach'&&r.id==='assistance') score+=9;
          if(r.id==='teacher-hub') score-=4;
          if(a.topic==='coding'&&r.id==='codeorg') score+=5;
        }
        return {...r,score};
      }).sort((a,b)=>b.score-a.score||RESOURCES.findIndex(r=>r.id===a.id)-RESOURCES.findIndex(r=>r.id===b.id));
    }
    function copySummary(items) {
      const prefix=state.role==='student'?`My CEISMC interest: ${PROFILE[state.answers.topic]?.[0]||'STEM explorer'}\nMy focus to practice: ${TAG_LABEL[state.answers.focus]||'STEM'}`:`My CEISMC ${state.role} resource guide\nSubject: ${TAG_LABEL[state.answers.topic]||'STEM'}`;
      const content=prefix+'\n\n'+items.map((r,i)=>`${i+1}. ${r.title}\n${r.why}\n${r.url}`).join('\n\n')+'\n\nRecommendations are exploratory. Confirm eligibility and availability with CEISMC.';
      if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(content);
      const el=document.createElement('textarea');el.value=content;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();const ok=document.execCommand('copy');el.remove();return ok?Promise.resolve():Promise.reject(new Error('Copy not supported'));
    }
    function resultsView() {
      const list=recommendations();const matches=list.slice(0,4);root._recommendations=matches;
      const profile=PROFILE[state.answers.topic]||PROFILE.science;
      const focus=TAG_LABEL[state.answers.focus]||'your next skill';
      const teaser=state.role==='student'?`<div class="gtf-result-focus"><div class="gtf-result-focus__icon">${state.answers.topic==='coding'?'💻':state.answers.topic==='science'?'🔬':state.answers.topic==='engineering'?'⚙️':state.answers.topic==='math'?'🔢':'🎨'}</div><div><span class="gtf-result-focus__eyebrow">YOUR EXPLORER PROFILE</span><h4>${safe(profile[0])}</h4><p>${safe(profile[1])}</p></div></div><div class="gtf-focus-tip"><span class="gtf-focus-tip__symbol">${icon.spark}</span><div><b>Your next growth area: ${safe(focus)}</b><span>${state.answers.warmup===getWarmup().answer?`Nice warm-up! ${safe(getWarmup().hint)} Keep experimenting and learning.`:`A good warm-up to revisit: ${safe(getWarmup().hint)} One question doesn't define your skills.`}</span></div></div>`:`<div class="gtf-result-focus"><div class="gtf-result-focus__icon">${state.role==='school'?'🏫':'🎓'}</div><div><span class="gtf-result-focus__eyebrow">YOUR STARTING POINT</span><h4>${state.role==='teacher'?'Your classroom toolkit':'Your school opportunity map'}</h4><p>Resources selected for your grade levels, focus and most important goal.</p></div></div>`;
      return `<div class="gtf-stage gtf-stage--results" id="gtf-stage" tabindex="-1"><div class="gtf-stage__top"><span class="gtf-step-label">YOUR PERSONALIZED PATHWAY</span><span class="gtf-complete">${icon.check} COMPLETE</span></div><h3>Here’s where to go next <span aria-hidden="true">✦</span></h3><p class="gtf-description">These are real CEISMC and Georgia Tech programs, chosen around your answers.</p>${teaser}<div class="gtf-results-head"><h4>Recommended for you</h4><span>${matches.length} MATCHES</span></div><div class="gtf-results">${matches.map((r,i)=>`<article class="gtf-result" style="--gtf-order:${i}"><span class="gtf-result__icon" aria-hidden="true">${r.icon}</span><div class="gtf-result__main"><span class="gtf-result__tag">${safe(r.label)}</span><h5>${safe(r.title)}</h5><p>${safe(r.why)}</p><small>${safe(r.note)}</small><a href="${safe(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="Explore ${safe(r.title)} on its website (opens in a new tab)">Explore resource ${icon.external}</a></div></article>`).join('')}</div><div class="gtf-result-actions"><button type="button" class="gtf-btn gtf-btn--primary" data-copy>Copy my recommendations ${icon.arrow}</button><button type="button" class="gtf-btn gtf-btn--ghost" data-restart>${icon.refresh} Start again</button></div><p class="gtf-fineprint">This is a quick, interest-based guide—not a formal assessment. Program dates, cost and eligibility should always be checked with the providers.</p></div>`;
    }
    function render(focus=false) {
      const p=progress();
      root.innerHTML=`<section class="gtf-shell" aria-labelledby="gtf-page-heading"><div class="gtf-shell__ambient" aria-hidden="true"></div><header class="gtf-topbar"><div class="gtf-topbar__label"><span class="gtf-topbar__signal"></span> CEISMC PATHFINDER <span class="gtf-topbar__sep">/</span> DISCOVER YOUR NEXT STEP</div><div class="gtf-topbar__meta">GEORGIA TECH STEM CONNECTION <span aria-hidden="true">✦</span></div></header><div class="gtf-layout">${hero()}<main class="gtf-workspace"><div class="gtf-progress"><div><span>YOUR JOURNEY</span><strong>${p}%</strong></div><div class="gtf-progress__track" role="progressbar" aria-label="Survey progress" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div></div>${state.result?resultsView():state.role?stepView():roleView()}<div class="gtf-workspace__bottom">Curiosity leads somewhere great. <a href="https://ceismc.gatech.edu/" target="_blank" rel="noopener noreferrer">Explore CEISMC ${icon.arrow}</a></div></main></div></section>`;
      if (focus) root.querySelector('#gtf-stage')?.focus({preventScroll:true});
    }
    root.addEventListener('click', event=>{
      const btn=event.target.closest('button');
      if(!btn || !root.contains(btn))return;
      if (btn.hasAttribute('data-role')) {state.role=btn.dataset.role;state.step=0;state.result=false;state.answers={};render(true);}
      else if(btn.hasAttribute('data-answer')) {const q=questions()[state.step];state.answers[q.id]=btn.dataset.answer; // Preserve focus while repainting the answer cards.
        const index=[...root.querySelectorAll('[data-answer]')].indexOf(btn);render();root.querySelectorAll('[data-answer]')[index]?.focus({preventScroll:true});}
      else if(btn.hasAttribute('data-next')) {const q=questions()[state.step];if(!Object.hasOwn(state.answers,q.id))return;if(state.step===questions().length-1){state.result=true;}else{state.step++;}render(true);}
      else if(btn.hasAttribute('data-back')) {if(state.step===0){state.role=null;state.answers={};state.step=-1;}else{state.step--;}state.result=false;render(true);}
      else if(btn.hasAttribute('data-restart')) {state.role=null;state.step=-1;state.result=false;state.answers={};render(true);}
      else if(btn.hasAttribute('data-copy')) {const orig=btn.innerHTML;copySummary(root._recommendations||[]).then(()=>{btn.innerHTML=`${icon.check} Copied!`;setTimeout(()=>{if(btn.isConnected)btn.innerHTML=orig;},2000);}).catch(()=>{btn.textContent='Copy unavailable — open each resource below';});}
    });
    render();
  }
  function mount() {makeApp(document.getElementById(ROOT_ID));}
  window.CEISMCPathfinder={mount};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
