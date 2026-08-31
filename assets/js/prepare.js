document.addEventListener('DOMContentLoaded', () => {
    if (typeof portifolio === "undefined") {
        console.error("Objeto portifolio não encontrado! Certifique-se de que o portfolio.js está carregado antes.");
        return;
    }

    // 1. Título da Página e Nome no Topo (Hero)
    document.title = `Portfólio - ${portifolio.profile.name}`;
    
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.innerText = portifolio.profile.name;

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.innerText = portifolio.profile.name;

    // Configuração Dinâmica do Typed.js
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

    // 2. Seção de Contatos (Dados e Links)
    const contactName = document.getElementById('contact-name');
    if (contactName) contactName.innerText = portifolio.profile.name;

    const contactTitle = document.getElementById('contact-title');
    if (contactTitle) contactTitle.innerText = portifolio.profile.title;

    const contactEmail = document.getElementById('contact-email');
    if (contactEmail) contactEmail.innerText = portifolio.profile.email || "Não informado";

    const contactLinkedin = document.getElementById('contact-linkedin');
    if (contactLinkedin) contactLinkedin.innerText = portifolio.profile.linkedin ? portifolio.profile.linkedin.replace("https://www.","").replace("https://","") : "Não informado";

    const contactGithub = document.getElementById('contact-github');
    if (contactGithub) contactGithub.innerText = portifolio.profile.github ? portifolio.profile.github.replace("https://","") : "Não informado";
    
    // Links de Contato (Esconde se não houver no JSON)
    const setLinkOrHide = (elementId, url, prefix = "") => {
        const el = document.getElementById(elementId);
        if (el) {
            if (url) {
                el.href = prefix + url;
                el.style.display = "inline-flex";
            } else {
                el.style.display = "none";
            }
        }
    };

    setLinkOrHide('contact-linkedin_lnk', portifolio.profile.linkedin);
    setLinkOrHide('contact-github_lnk', portifolio.profile.github);
    setLinkOrHide('contact-email_lnk', portifolio.profile.email, "mailto:");

    // 3. Sobre Mim
    const aboutBox = document.getElementById('about-text');
    if (aboutBox && portifolio.about && portifolio.about.description) {
        const paragraphs = portifolio.about.description.map(p => `<p>${p}</p>`).join('');
        aboutBox.innerHTML = `<h4>Sobre mim</h4>${paragraphs}`;
    }

    // 4. Currículo (Objetivo, Vagas e Formação)
    const resumeObj = document.getElementById('resume-objective');
    if (resumeObj && portifolio.resume) {
        resumeObj.innerText = portifolio.resume.objective;
    }

    const vagasBox = document.getElementById('resume-vagas');
    if (vagasBox && portifolio.vagas) {
       vagasBox.innerHTML = portifolio.vagas.map(vaga => 
            `<span class="badge bg-secondary me-1 mb-1">${vaga}</span>`
        ).join('');
    }

    const eduBox = document.getElementById('resume-education');
    if (eduBox && portifolio.resume && portifolio.resume.education) {
        eduBox.innerHTML = portifolio.resume.education.map(edu => {
            const extraInfo = edu.certifications 
                ? `<ul>${edu.certifications.map(c => `<li>${c}</li>`).join('')}</ul>` 
                : `<p><em>${edu.details || ""}</em></p>`;
            return `
                <div class="resume-item">
                    <h4>${edu.degree}</h4>
                    <h5>${edu.period}</h5>
                    <p><em>${edu.institution}</em></p>
                    ${extraInfo}
                </div>`;
        }).join('');
    }

    // 5. Experiências Profissionais
    const expBox = document.getElementById('resume-experience-list');
    if (expBox && portifolio.resume && portifolio.resume.experience) {
        expBox.innerHTML = portifolio.resume.experience.map(exp => `
            <div class="resume-item">
                <h4>${exp.role}</h4>
                <h5>${exp.period}</h5>
                <p><em>${exp.company}</em></p>
                <ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
                ${exp.stack ? `<p><strong>Stack/Competências:</strong> ${exp.stack}</p>` : ''}
            </div>`).join('');
    }

    // 6. Habilidades / Tecnologias (Dinâmico por Categoria)
    const skillsBox = document.getElementById('skills-wrapper');
    if (skillsBox && portifolio.skills) {
        const groupedSkills = portifolio.skills.reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        }, {});

        let finalHtml = '';
        for (const category in groupedSkills) {            
            finalHtml += `<div class="col-12"><h5 class="skill-group-title mt-4">${category}</h5></div>`;
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

        // Animação das barras de progresso ao rolar a página
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

    // 7. Portfólio de Projetos
    const portBox = document.getElementById('portfolio-container');
    if (portBox && portifolio.portfolio && portifolio.portfolio.projects) {
        portBox.innerHTML = portifolio.portfolio.projects.map(proj => `
            <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${proj.category_class}">
                ${proj.img ? `<img src="${proj.img}" class="img-fluid" alt="">` : ''}
                <div class="portfolio-info">
                    <h4>${proj.title}</h4>
                    <p>${proj.description}</p>
                    ${proj.img ? `<a href="${proj.img}" data-gallery="portfolio-gallery" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>` : ''}
                    ${proj.github_url ? `<a href="${proj.github_url}" target="_blank" class="details-link"><i class="bi bi-link-45deg"></i></a>` : ''}
                </div>
            </div>`).join('');

        imagesLoaded(portBox, function() {
            let iso = new Isotope(portBox, {
                itemSelector: '.portfolio-item',
                layoutMode: 'masonry',
                filter: '*'
            });

            const filters = document.querySelectorAll('.portfolio-filters li');
            filters.forEach(filter => {
                filter.addEventListener('click', function() {
                    filters.forEach(el => el.classList.remove('filter-active'));
                    this.classList.add('filter-active');
                    iso.arrange({ filter: this.getAttribute('data-filter') });
                    
                    if (typeof AOS !== 'undefined') {
                        AOS.init();
                        AOS.refresh();
                    }
                });
            });
        });

        if (typeof GLightbox !== 'undefined') {
            GLightbox({ selector: '.glightbox' });
        }
    }

    // 8. Rodapé Dinâmico (Footer)
    const footerName = document.getElementById('footer-name');
    if (footerName) footerName.innerText = portifolio.profile.name;

    const filtersContainer = document.getElementById('portfolio-filters-container');
    if (filtersContainer && portifolio.portfolio && portifolio.portfolio.filters) {
        filtersContainer.innerHTML = portifolio.portfolio.filters.map((f, index) => {
            const activeClass = index === 0 ? 'filter-active' : '';
            return `<li data-filter="${f.filter}" class="${activeClass}">${f.label}</li>`;
        }).join('');
    }
    setLinkOrHide('footer-email_lnk', portifolio.profile.email, "mailto:");
    setLinkOrHide('footer-github_lnk', portifolio.profile.github);
    setLinkOrHide('footer-linkedin_lnk', portifolio.profile.linkedin);
    const contactQrCode = document.getElementById('contact-qrcode');
    if (contactQrCode && portifolio.profile.qrcode) {
        contactQrCode.src = portifolio.profile.qrcode;
    } else if (contactQrCode) {
        contactQrCode.style.display = "none";
    }
});