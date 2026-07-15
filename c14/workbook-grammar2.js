(function(){
  const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),key='c14-workbook-grammar2-v2';
  const items=[
    ['지난여름에','갔던','바다에 다시 놀러가기로 했어요.','가다','beach'],['지난주에 친구하고','봤던','영화예요.','보다','movie'],['여행 갈 때','탔던','비행기 안에서 만났어요.','타다','airplane'],['지난번 회식 때','갔던','식당에서 한대요.','가다','restaurant'],['이번 휴가 때 재미있게','읽었던','책이에요.','읽다','book'],['지하철에서','잃어버렸던','지갑을 찾았어요.','잃어버리다','wallet'],['어제저녁 때','먹었던','냉면을 또 먹고 싶어요.','먹다','noodles']
  ];
  $('#g2forms').innerHTML=items.map((x,i)=>`<div class="question has-scene"><label><span class="num">${i+1}</span><span>${x[0]}</span><input data-answer="${x[1]}" aria-label="${x[3]} 활용 답"><span>${x[2]}</span></label><small>(${x[3]})</small><figure class="answer-scene" hidden><img src="../assets/c14/workbook/grammar2-scenes/${x[4]}.webp" alt="${x[2]} 장면" loading="lazy"></figure></div>`).join('');
  $('#checkForms').onclick=()=>{let a=[...$$('#g2forms input')],n=0;a.forEach(x=>{let ok=x.value.replace(/\s/g,'')===x.dataset.answer;x.className=ok?'ok':'no';x.closest('.question').querySelector('.answer-scene').hidden=!ok;n+=ok});$('#forms-result').textContent=`${n} / ${a.length}개 정답`;save()};
  const leads={친구:'이 사람은 제가 예전에 만났던 친구입니다.',음식:'이 음식은 제가 여행에서 먹었던 음식입니다.',영화:'이 영화는 제가 작년에 봤던 영화입니다.',책:'이 책은 제가 재미있게 읽었던 책입니다.',노래:'이 노래는 제가 자주 들었던 노래입니다.'};
  $('#memoryChoice').onclick=e=>{let b=e.target.closest('button');if(!b)return;$('#memoryChoice').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));$('#memoryLead').textContent=leads[b.textContent]};
  $('#saveMemory').onclick=()=>{let v=$('#memorySentence').value.trim();$('#memory-result').textContent=!v?'먼저 나의 기억 문장을 써 보세요.':v.includes('던')?'저장했어요. 과거 경험과 명사를 잘 연결했는지 다시 읽어 보세요.':'저장했어요. ‘-았던/었던’과 뒤의 명사를 넣어 보세요.';save()};
  function save(){try{localStorage.setItem(key,JSON.stringify({answers:[...$$('#g2forms input')].map(x=>x.value),sentence:$('#memorySentence').value}))}catch(e){}}
  try{let v=JSON.parse(localStorage.getItem(key)||'{}');[...$$('#g2forms input')].forEach((x,i)=>x.value=v.answers?.[i]||'');$('#memorySentence').value=v.sentence||''}catch(e){}
  document.addEventListener('input',save);
})();
