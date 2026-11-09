/* Lilian Mesquita · formulário de aplicação em 2 telas que monta a mensagem para o WhatsApp */
(function(){
  var f=document.getElementById('form'), s1=f.querySelector('.step1'), s2=f.querySelector('.step2'), done=f.querySelector('.done');
  function show(id,on){document.getElementById(id).classList.toggle('show',on)}
  function val(id){return document.getElementById(id).value.trim()}
  var semdata=document.getElementById('semdata'), data=document.getElementById('data');
  semdata.addEventListener('change',function(){data.disabled=semdata.checked; if(semdata.checked)show('e-data',false)});
  ['nome','wa','data','cargo'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){show('e-'+id,false)})});
  f.querySelectorAll('input[name=cena]').forEach(function(r){r.addEventListener('change',function(){show('e-cena',false)})});
  function cena(){var c=f.querySelector('input[name=cena]:checked');return c?c.value:''}
  document.getElementById('next').addEventListener('click',function(){
    var ok=true;
    if(!val('nome')){show('e-nome',true);ok=false}
    if(val('wa').replace(/\D/g,'').length<10){show('e-wa',true);ok=false}
    if(!cena()){show('e-cena',true);ok=false}
    if(!semdata.checked&&!val('data')){show('e-data',true);ok=false}
    if(!ok)return;
    s1.style.display='none';s2.style.display='block';document.getElementById('p2').classList.add('on');
    document.getElementById('cargo').focus();
  });
  document.getElementById('back').addEventListener('click',function(){s2.style.display='none';s1.style.display='block';document.getElementById('p2').classList.remove('on')});
  function mes(v){if(!v)return'ainda não tenho data';var p=v.split('-');var m=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];return m[+p[1]-1]+'/'+p[0]}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!val('cargo')){show('e-cargo',true);return}
    var msg='Olá, Lilian! Fiz minha aplicação pelo site.\n\nNome: '+val('nome')+'\nWhatsApp: '+val('wa')+'\nCena: '+cena()+'\nData: '+(semdata.checked?'ainda não tenho data':mes(val('data')))+'\nCargo: '+val('cargo')+(val('jogo')?'\nO que está em jogo: '+val('jogo'):'');
    var url='https://wa.me/5535984226585?text='+encodeURIComponent(msg);
    document.getElementById('go').href=url;
    s2.style.display='none';done.style.display='block';
  });
})();
