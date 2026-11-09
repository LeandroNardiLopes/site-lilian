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
  // Textos da mensagem do WhatsApp no idioma da página (atributo lang do <html>)
  var D={
    pt:{oi:'Olá, Lilian! Fiz minha aplicação pelo site.',nome:'Nome',cena:'Cena',data:'Data',cargo:'Cargo',jogo:'O que está em jogo',sem:'ainda não tenho data',m:['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']},
    en:{oi:'Hi Lilian! I applied through your website.',nome:'Name',cena:'Scene',data:'Date',cargo:'Position',jogo:"What's at stake",sem:"I don't have a date yet",m:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']},
    es:{oi:'¡Hola, Lilian! Hice mi aplicación por el sitio.',nome:'Nombre',cena:'Escena',data:'Fecha',cargo:'Cargo',jogo:'Qué está en juego',sem:'todavía no tengo fecha',m:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']}
  };
  var L=D[(document.documentElement.lang||'pt').slice(0,2)]||D.pt;
  function mes(v){if(!v)return L.sem;var p=v.split('-');return L.m[+p[1]-1]+'/'+p[0]}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!val('cargo')){show('e-cargo',true);return}
    var msg=L.oi+'\n\n'+L.nome+': '+val('nome')+'\nWhatsApp: '+val('wa')+'\n'+L.cena+': '+cena()+'\n'+L.data+': '+(semdata.checked?L.sem:mes(val('data')))+'\n'+L.cargo+': '+val('cargo')+(val('jogo')?'\n'+L.jogo+': '+val('jogo'):'');
    var url='https://wa.me/5535984226585?text='+encodeURIComponent(msg);
    document.getElementById('go').href=url;
    s2.style.display='none';done.style.display='block';
  });
})();
