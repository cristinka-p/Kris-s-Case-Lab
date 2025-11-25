// Loads markdown dynamically
async function loadMD(path, target){
  const res = await fetch(path);
  const text = await res.text();
  document.getElementById(target).innerHTML = marked.parse(text);
}