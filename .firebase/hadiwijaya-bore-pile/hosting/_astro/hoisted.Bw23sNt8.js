import"https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js";import"./ViewTransitions.astro_astro_type_script_index_0_lang.Bhu4KFNL.js";document.addEventListener("DOMContentLoaded",function(){const a=document.getElementById("contact-page-form");a&&a.addEventListener("submit",function(e){e.preventDefault();const c=e.target.name.value,n=e.target.email.value,s=e.target.subject.value,i=e.target.message.value,o=document.getElementById("contact-phone-number");let m="6281325794818";o&&(m=o.textContent.trim().replace(/^0/,"62").replace(/\D/g,""));let t=`*Pesan dari Website Hadiwijaya*

`;t+=`*Nama:* ${c}
`,n&&(t+=`*Email:* ${n}
`),t+=`*Subjek:* ${s}

`,t+=`${i}`;const r=`https://wa.me/${m}?text=${encodeURIComponent(t)}`;window.open(r,"_blank")})});
