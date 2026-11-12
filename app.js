const $=id=>document.getElementById(id);
const seed={
"Математика":[
["Чему равна производная функции y = x²?",["x","2x","x²","2"],1,"Производная x² равна 2x."],
["Сколько будет 7 × 8?",["54","48","56","64"],2,"7 × 8 = 56."],
["Реши уравнение: 2x = 10",["2","4","5","10"],2,"x = 10 / 2 = 5."],
["Площадь квадрата со стороной 4 см?",["8 см²","12 см²","16 см²","20 см²"],2,"Площадь квадрата: 4² = 16 см²."],
["Сумма углов треугольника?",["90°","180°","270°","360°"],1,"Сумма углов треугольника равна 180°."]
],
"Физика":[
["В каких единицах измеряется сила?",["Джоуль","Ньютон","Паскаль","Ватт"],1,"Сила измеряется в ньютонах."],
["Формула плотности вещества?",["ρ = m/V","ρ = V/m","ρ = F/S","ρ = m·V"],0,"Плотность — масса, делённая на объём."],
["Ускорение свободного падения около Земли?",["1,8 м/с²","9,8 м/с²","20 м/с²","100 м/с²"],1,"Около поверхности Земли g ≈ 9,8 м/с²."],
["Единица давления?",["Ньютон","Паскаль","Килограмм","Метр"],1,"Давление измеряется в паскалях."],
["Формула скорости равномерного движения?",["v=s/t","v=s·t","v=t/s","v=m·a"],0,"Скорость равна пути, делённому на время."]
],
"Минералогия":[
["Какой минерал имеет латунно-жёлтый цвет и металлический блеск?",["Гипс","Пирит","Кальцит","Галит"],1,"Пирит имеет характерный латунно-жёлтый цвет."],
["Какой минерал состоит из NaCl?",["Галит","Кварц","Гематит","Флюорит"],0,"Галит — природный хлорид натрия."],
["Твёрдость кварца по Моосу?",["5","6","7","9"],2,"Твёрдость кварца равна 7."],
["Как выглядит самородная сера?",["Жёлтая","Чёрная","Синяя","Бесцветная"],0,"Сера обычно имеет жёлтую окраску."],
["Какой минерал обладает магнитными свойствами?",["Магнетит","Галит","Опал","Гипс"],0,"Магнетит притягивается магнитом."]
],
"Геометрия":[
["Сколько основных координатных плоскостей?",["Две","Три","Четыре","Шесть"],1,"Основных координатных плоскостей три."],
["Как называется проекция на горизонтальную плоскость?",["Фронтальная","Профильная","Горизонтальная","Центральная"],2,"Это горизонтальная проекция."],
["Сколько основных проекций точки в системе трёх плоскостей?",["Одна","Две","Три","Четыре"],2,"Горизонтальная, фронтальная и профильная."],
["Что такое натуральная величина отрезка?",["Истинная длина","Его проекция","Угол наклона","Координата Z"],0,"Это действительная длина отрезка."],
["Как обозначают ось абсцисс?",["Oy","Oz","Ox","O"],2,"Ось абсцисс обозначают Ox."]
]};
const extra={
"Математика":[["Чему равна производная y = 3x³?",["3x²","9x²","6x","x³"],1,"(3x³)' = 9x²."],["Реши: 3x − 7 = 11",["4","5","6","7"],2,"3x = 18, x = 6."]],
"Физика":[["Масса 2 кг, ускорение 3 м/с². Сила?",["5 Н","6 Н","9 Н","12 Н"],1,"F = ma = 2 × 3 = 6 Н."]],
"Минералогия":[["Твёрдость корунда по Моосу?",["5","7","8","9"],3,"Твёрдость корунда равна 9."]],
"Геометрия":[["Сколько октантов образуют три координатные плоскости?",["4","6","8","12"],2,"Три плоскости делят пространство на восемь октантов."]]
};
let data=load(),current=[],idx=0,chosen=-1,score=0,subject='',difficulty='Лёгкий',fromErrors=false;
function load(){try{return {...{name:'',tests:[],errors:[],xp:0,custom:{}},...JSON.parse(localStorage.getItem('studyup-data')||'{}')}}catch{return {name:'',tests:[],errors:[],xp:0,custom:{}}}}
function save(){localStorage.setItem('studyup-data',JSON.stringify(data))}
function show(id){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===id));render()}
window.show=show;
function allSubjects(){return [...new Set([...Object.keys(seed),...Object.keys(data.custom||{})])]}
function questionsFor(s){return [...(seed[s]||[]),...((data.custom||{})[s]||[])]}
function subjectButton(s){return `<button class="subject" onclick="start('${s.replace(/'/g,"\\'")}')"><span class="emoji">${({'Математика':'📐','Физика':'⚛️','Минералогия':'💎','Геометрия':'📏'}[s]||'📘')}</span><span><b>${s}</b><span class="desc">${questionsFor(s).length} вопросов</span></span><span class="push">›</span></button>`}
function render(){
$('homeSubjects').innerHTML=allSubjects().map(subjectButton).join('');$('testSubjects').innerHTML=allSubjects().map(subjectButton).join('');
let total=data.tests.length,correct=data.tests.reduce((n,t)=>n+t.correct,0),answered=data.tests.reduce((n,t)=>n+t.total,0),pct=answered?Math.round(correct/answered*100):0;
$('mTests').textContent=total;$('mAccuracy').textContent=pct+'%';$('mLevel').textContent=Math.floor(data.xp/100)+1;$('hello').textContent=data.name?`Привет, ${data.name}!`:'Продолжай учиться!';
$('sTests').textContent=total;$('sAvg').textContent=pct+'%';$('sCorrect').textContent=correct;$('sXp').textContent=data.xp+' XP';$('name').value=data.name||'';
$('history').innerHTML=total?[...data.tests].reverse().map(t=>`<div class="smallrow"><span>${t.subject}<small class="desc">${t.date} · ${t.difficulty}</small></span><b>${t.correct}/${t.total}</b></div>`).join(''):'Тестов пока нет.';
$('errorItems').innerHTML=data.errors.length?data.errors.map(e=>`<div class="card"><span class="pill">${e.subject}</span><p><b>${e.q}</b></p><p class="muted">Правильный ответ: ${e.options[e.correct]}</p><button class="secondary" onclick="retryOne('${encodeURIComponent(JSON.stringify(e))}')">Повторить вопрос</button></div>`).join(''):'Ошибок пока нет. Отличная работа!';
}
function start(s,errors=false){subject=s;fromErrors=errors;difficulty=$('difficulty').value;current=errors?data.errors.filter(e=>e.subject===s):questionsFor(s);if(!errors&&difficulty!=='Лёгкий')current=[...current,...(extra[s]||[])];if(!current.length){alert('Пока нет вопросов для этого предмета.');return}idx=0;score=0;show('quiz');draw()}
window.start=start;
function draw(){chosen=-1;let q=current[idx];$('qSubject').textContent=subject;$('qCount').textContent=`${idx+1} / ${current.length}`;$('qBar').style.width=((idx+1)/current.length*100)+'%';$('qLevel').textContent=fromErrors?'Работа над ошибками':difficulty;$('qText').textContent=q.q||q[0];let opts=q.options||q[1];$('qAnswers').innerHTML=opts.map((a,i)=>`<button class="answer" data-i="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('');document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>{chosen=+b.dataset.i;document.querySelectorAll('.answer').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('check').disabled=false});$('check').hidden=false;$('check').disabled=true;$('next').hidden=true;$('explain').hidden=true}
$('check').onclick=()=>{if(chosen<0)return;let q=current[idx],opts=q.options||q[1],right=q.correct??q[2],ok=chosen===right;if(ok)score++;else if(!fromErrors){data.errors.push({subject,q:q.q||q[0],options:opts,correct:right,explanation:q.explanation||q[3]})}document.querySelectorAll('.answer').forEach((b,i)=>{b.disabled=true;if(i===right)b.classList.add('good');else if(i===chosen)b.classList.add('bad')});$('explain').hidden=false;$('explain').textContent=(ok?'Верно! ':'Неверно. ')+(q.explanation||q[3]);$('check').hidden=true;$('next').hidden=false;$('next').textContent=idx===current.length-1?'Завершить тест':'Следующий вопрос →';save()};
$('next').onclick=()=>{if(idx<current.length-1){idx++;draw()}else{data.xp+=score*10;data.tests.push({subject,difficulty:fromErrors?'Повтор':difficulty,correct:score,total:current.length,date:new Date().toLocaleDateString('ru-RU')});save();$('resultText').innerHTML=`<p style="font-size:32px;font-weight:800">${score} / ${current.length}</p><p>Правильных ответов · ${Math.round(score/current.length*100)}%</p><p>Получено опыта: +${score*10} XP</p>`;$('resultDialog').showModal();render()}};
window.retryOne=encoded=>{let q=JSON.parse(decodeURIComponent(encoded));subject=q.subject;current=[q];idx=0;score=0;fromErrors=true;show('quiz');draw()};
$('saveName').onclick=()=>{data.name=$('name').value.trim();save();render();alert('Имя сохранено на устройстве.')};
$('theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('studyup-theme',document.body.classList.contains('dark')?'dark':'light')};
if(localStorage.getItem('studyup-theme')==='dark')document.body.classList.add('dark');
$('export').onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='studyup-backup.json';a.click();URL.revokeObjectURL(url)};
$('import').onchange=async e=>{try{let f=e.target.files[0];if(!f)return;let obj=JSON.parse(await f.text());if(!Array.isArray(obj.tests)||!Array.isArray(obj.errors))throw Error();data={...data,...obj};save();render();alert('Резервная копия восстановлена.')}catch{alert('Не удалось прочитать резервную копию.')}};
$('reset').onclick=()=>{if(confirm('Точно удалить весь прогресс? Это действие нельзя отменить.')){data={name:data.name,tests:[],errors:[],xp:0,custom:{}};save();render()}};
$('addQuestion').onclick=()=>{let s=$('newSubject').value.trim(),q=$('newQuestion').value.trim(),opts=$('newOptions').value.split('\n').map(x=>x.trim()).filter(Boolean),right=+$('newCorrect').value-1,ex=$('newExplanation').value.trim();if(!s||!q||opts.length<2||right<0||right>=opts.length){alert('Заполни предмет, вопрос, минимум два ответа и номер правильного варианта.');return}data.custom[s]=data.custom[s]||[];data.custom[s].push([q,opts,right,ex||'Правильный ответ отмечен.']);save();['newSubject','newQuestion','newOptions','newExplanation'].forEach(id=>$(id).value='');render();alert('Вопрос добавлен.');show('tests')};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.page));
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
