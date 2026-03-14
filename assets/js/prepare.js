document.addEventListener('DOMContentLoaded', () => {
    // 1. Perfil e Hero
    const profileName = document.getElementById('profile-name');
    if(profileName) profileName.innerText = portifolio.profile.name;
    
    // Configuração do Typed.js (Refatorado para funcionar dinamicamente)
    const typedElement = document.getElementById('typed-element');
    if (typedElement && portifolio.profile.hero_typed_items) {
        new Typed('#typed-element', {
            strings: portifolio.profile.hero_typed_items,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }
    // Preenche o nome no Hero e nos Contatos
    if(document.getElementById('profile-name')) 
        document.getElementById('profile-name').innerText = portifolio.profile.name;

    document.getElementById('contact-name').innerText = portifolio.profile.name;
    document.getElementById('contact-title').innerText = portifolio.profile.title;
    document.getElementById('contact-email').innerText = portifolio.profile.email;
    document.getElementById('contact-linkedin').innerText = portifolio.profile.linkedin.replace("https://www.","");
    document.getElementById('contact-github').innerText = portifolio.profile.github.replace("https://","");
    

    document.getElementById('contact-linkedin_lnk').href = portifolio.profile.linkedin;
    document.getElementById('contact-github_lnk').href = portifolio.profile.github;
    document.getElementById('contact-email_lnk').href = `mailto:${portifolio.profile.email}`;

    // 2. Sobre Mim
    const aboutBox = document.getElementById('about-text');
    if(aboutBox) {
        const paragraphs = portifolio.about.description.map(p => `<p>${p}</p>`).join('');
        aboutBox.innerHTML = `<h4>Sobre mim</h4>${paragraphs}`;
    }

    // 3. Currículo (Objetivo, Formação, Experiência)
    if(document.getElementById('resume-objective'))
        document.getElementById('resume-objective').innerText = portifolio.resume.objective;

    const eduBox = document.getElementById('resume-education');
    if(eduBox) {
        eduBox.innerHTML = portifolio.resume.education.map(edu => {
            // Verifica se há detalhes ou certificações para exibir
            const extraInfo = (edu.certifications ? `<ul>${edu.certifications.map(c => `<li>${c}</li>`).join('')}</ul>` : '');
            return `
                <div class="resume-item">
                    <h4>${edu.degree}</h4>
                    <h5>${edu.period}</h5>
                    <p><em>${edu.institution}</em></p>
                    ${extraInfo}
                </div>`;
        }).join('');
    }

    const expBox = document.getElementById('resume-experience-list');
    if(expBox) {
        expBox.innerHTML = portifolio.resume.experience.map(exp => `
            <div class="resume-item">
                <h4>${exp.role}</h4>
                <h5>${exp.period}</h5>
                <p><em>${exp.company}</em></p>
                <ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
                <p><strong>Stack:</strong> ${exp.stack}</p>
            </div>`).join('');
    }

    // 4. Projetos (Portfólio)    
    const portBox = document.getElementById('portfolio-container');
    if(portBox) {
        // Gerar o HTML
        portBox.innerHTML = portifolio.portfolio.projects.map(proj => `
            <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${proj.category_class}">
                <img src="${proj.img}" class="img-fluid" alt="">
                <div class="portfolio-info">
                    <h4>${proj.title}</h4>
                    <p>${proj.description}</p>
                    <a href="${proj.img}" data-gallery="portfolio-gallery" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
                    <a href="${proj.github_url}" target="_blank" class="details-link"><i class="bi bi-link-45deg"></i></a>
                </div>
            </div>`).join('');

        // Reinicializar o Isotope após o carregamento das imagens
        imagesLoaded(portBox, function() {
            let iso = new Isotope(portBox, {
                itemSelector: '.portfolio-item',
                layoutMode: 'masonry',
                filter: '*'
            });

            // Configurar os filtros de clique
            const filters = document.querySelectorAll('.portfolio-filters li');
            filters.forEach(filter => {
                filter.addEventListener('click', function() {
                    // Remover classe ativa de todos e adicionar no clicado
                    filters.forEach(el => el.classList.remove('filter-active'));
                    this.classList.add('filter-active');
                    
                    // Filtrar os itens
                    iso.arrange({ filter: this.getAttribute('data-filter') });
                    
                    // Refresh nas animações AOS
                    if (typeof AOS !== 'undefined') {
                        AOS.init(); // Inicializa
                        AOS.refresh(); // Atualiza os elementos novos
                    }
                });
            });
        });

        // Inicializar o GLightbox para os novos elementos
        const lightbox = GLightbox({ selector: '.glightbox' });
    }
    // Localize onde você quer inserir (ex: dentro de uma div com id 'vagas-list')
    const vagasBox = document.getElementById('resume-vagas');
    if(vagasBox && portifolio.vagas) {
       vagasBox.innerHTML = portifolio.vagas.map(vaga => 
            `<span class="vaga-item">${vaga}</span>`
        ).join('');
    }
    // 5. Skills Dinâmicas com Injeção de Efeito Nativo
    const skillsBox = document.getElementById('skills-wrapper');
    if (skillsBox && portifolio.skills) {
        // 1. Agrupar skills por categoria
        const groupedSkills = portifolio.skills.reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        }, {});

        // 2. Gerar o HTML com títulos
        let finalHtml = '';
        for (const category in groupedSkills) {            
            finalHtml += `<div class="col-12"><h5 class="skill-group-title">${category}</h5></div>`;
            finalHtml += groupedSkills[category].map(skill => `
                <div class="col-lg-6">
                    <div class="progress">
                        <span class="skill"><span>${skill.name}</span> <i class="val">${skill.level}%</i></span>
                        <div class="progress-bar-wrap">
                            <div class="progress-bar" 
                                 role="progressbar" 
                                 data-level="${skill.level}" 
                                 style="width: 0%; transition: width 1.5s ease-in-out;">
                            </div>
                        </div>
                    </div>
                </div>`).join('');
        }
        
        skillsBox.innerHTML = finalHtml;

        // 3. Re-aplicar o Observer para a animação
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.getAttribute('data-level') + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('#skills-wrapper .progress-bar').forEach(bar => observer.observe(bar));
    }    

});