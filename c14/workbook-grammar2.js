(function(){
  const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),key='c14-workbook-grammar2-v3';
  const items=[
    ['지난여름에','갔던','바다에 다시 놀러가기로 했어요.','가다','beach'],['지난주에 친구하고','봤던','영화예요.','보다','movie'],['여행 갈 때','탔던','비행기 안에서 만났어요.','타다','airplane'],['지난번 회식 때','갔던','식당에서 한대요.','가다','restaurant'],['이번 휴가 때 재미있게','읽었던','책이에요.','읽다','book'],['지하철에서','잃어버렸던','지갑을 찾았어요.','잃어버리다','wallet'],['어제저녁 때','먹었던','냉면을 또 먹고 싶어요.','먹다','noodles']
  ];
  const state={answers:Array(items.length).fill(''),checked:Array(items.length).fill(false),sentence:'',choice:'친구'};
  const leads={친구:'이 사람은 제가 예전에 만났던 친구입니다.',음식:'이 음식은 제가 여행에서 먹었던 음식입니다.',영화:'이 영화는 제가 작년에 봤던 영화입니다.',책:'이 책은 제가 재미있게 읽었던 책입니다.',노래:'이 노래는 제가 자주 들었던 노래입니다.'};
  function save(){try{localStorage.setItem(key,JSON.stringify(state));$('#save').textContent='자동 저장됨'}catch(e){$('#save').textContent='이 브라우저에서는 저장되지 않음'}}
  function restore(){try{const raw=JSON.parse(localStorage.getItem(key));if(!raw)return;state.answers=Array.isArray(raw.answers)?items.map((_,i)=>raw.answers[i]||''):state.answers;state.checked=Array.isArray(raw.checked)?items.map((_,i)=>Boolean(raw.checked[i])):state.checked;state.sentence=raw.sentence||'';state.choice=leads[raw.choice]?raw.choice:'친구'}catch(e){}}
  function render(){
    $('#g2forms').innerHTML=items.map((x,i)=>`<div class="question has-scene" data-index="${i}"><label><span class="num">${i+1}</span><span>${x[0]}</span><input value="${state.answers[i].replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-answer="${x[1]}" aria-label="${x[3]} 활용 답"><span>${x[2]}</span></label><small>(${x[3]})</small><div class="question-actions"><button class="check-row" type="button">확인</button><p class="mini-result" aria-live="polite"></p></div><figure class="answer-scene" hidden><img src="../assets/c14/workbook/grammar2-scenes/${x[4]}.webp" alt="${x[2]} 장면" loading="lazy"></figure></div>`).join('');
    $$('#g2forms input').forEach((input,i)=>{input.addEventListener('input',()=>{state.answers[i]=input.value;state.checked[i]=false;input.className='';input.closest('.question').querySelector('.answer-scene').hidden=true;input.closest('.question').querySelector('.mini-result').textContent='';updateProgress();save()});input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check(i)}})});
    $$('#g2forms .check-row').forEach((button,i)=>button.addEventListener('click',()=>check(i)));
    state.checked.forEach((done,i)=>{if(done)check(i,true)});updateProgress();
    $('#memorySentence').value=state.sentence;$('#memoryLead').textContent=leads[state.choice];$('#memoryChoice').querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.textContent===state.choice));
  }
  function check(i,restoring=false){const input=$$('#g2forms input')[i],box=input.closest('.question'),ok=input.value.replace(/\s/g,'')===input.dataset.answer;state.answers[i]=input.value;state.checked[i]=true;input.className=ok?'ok':'no';box.querySelector('.answer-scene').hidden=!ok;box.querySelector('.mini-result').textContent=ok?'정답이에요.':'다시 확인해 보세요.';box.querySelector('.mini-result').className='mini-result '+(ok?'is-ok':'is-no');updateProgress();if(!restoring)save()}
  function updateProgress(){const count=state.checked.filter(Boolean).length;$('#formProgress').textContent=`확인한 문항 ${count} / ${items.length}`}
  $('#memoryChoice').onclick=e=>{const b=e.target.closest('button');if(!b)return;state.choice=b.textContent;$('#memoryChoice').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));$('#memoryLead').textContent=leads[state.choice];save()};
  $('#memorySentence').addEventListener('input',e=>{state.sentence=e.target.value;save()});
  $('#saveMemory').onclick=()=>{const v=$('#memorySentence').value.trim();$('#memory-result').textContent=!v?'먼저 나의 기억 문장을 써 보세요.':v.includes('던')?'저장했어요. 과거 경험과 명사를 잘 연결했는지 다시 읽어 보세요.':'저장했어요. ‘-았던/었던’과 뒤의 명사를 넣어 보세요.';save()};
  restore();render();
})();
