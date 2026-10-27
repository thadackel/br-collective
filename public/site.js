// Navigation works without JavaScript; these enhancements close menus predictably.
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  const opened=[...document.querySelectorAll('header details[open]')];
  opened.forEach(item=>item.removeAttribute('open'));
  opened.at(-1)?.querySelector('summary')?.focus();
});
document.addEventListener('click',event=>{
  document.querySelectorAll('header details[open]').forEach(item=>{
    if(!item.contains(event.target))item.removeAttribute('open');
  });
});
