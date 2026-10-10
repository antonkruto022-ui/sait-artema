// ==========================================================================
// СКРИПТ САЙТА КУРИЦЫНА АРТЁМА (4 РАЗДЕЛА + ИНТЕРАКТИВНЫЕ КАРТИНКИ С ОПИСАНИЕМ)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const AVATAR_KEY = 'personal_site_artyom_avatar_v2';

  const navTabs = document.querySelectorAll('.nav-tab');
  const tabSections = {
    about: document.getElementById('section-about'),
    sports: document.getElementById('section-sports'),
    games: document.getElementById('section-games'),
    movies: document.getElementById('section-movies'),
  };

  const jumpButtons = document.querySelectorAll('[data-tab-jump], [data-tab-trigger]');
  const pictureCards = document.querySelectorAll('.picture-card');
  const copyVkBtn = document.getElementById('copyVkBtn');
  const avatarTrigger = document.getElementById('avatarTrigger');
  const avatarInput = document.getElementById('avatarInput');
  const avatarImg = document.getElementById('avatarImg');
  const toast = document.getElementById('toast');

  let toastTimeout = null;

  // 1. Всплывающее уведомление (Toast)
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // 2. Плавное поочерёдное появление картинок при входе в раздел
  function animateSectionCards(sectionEl) {
    if (!sectionEl) return;
    const cards = sectionEl.querySelectorAll('.picture-card');
    cards.forEach((card, index) => {
      card.style.animation = 'none';
      // Перезапуск CSS-анимации
      void card.offsetWidth;
      card.style.animation = `cardPopIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.06}s forwards`;
    });
  }

  // 3. Переключение между 4 разделами сайта
  function switchTab(tabName) {
    if (!tabSections[tabName]) return;

    // Обновляем кнопки в шапке
    navTabs.forEach((btn) => {
      const isMatch = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // Показываем нужный раздел и скрываем остальные
    Object.entries(tabSections).forEach(([key, section]) => {
      if (!section) return;
      if (key === tabName) {
        section.hidden = false;
        section.classList.add('active');
        animateSectionCards(section);
      } else {
        section.hidden = true;
        section.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Обработчики вкладок в шапке
  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Обработчики быстрых кнопок перехода из раздела «Обо мне»
  jumpButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab-jump') || btn.getAttribute('data-tab-trigger');
      if (targetTab) {
        switchTab(targetTab);
      }
    });
  });

  // 4. Клик по картинке — открытие / закрытие описания увлечения
  function togglePictureCard(card) {
    const isOpen = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    const hint = card.querySelector('.click-hint');
    if (hint) {
      hint.textContent = isOpen ? '✓ Описание открыто' : '👆 Нажмите для описания';
    }
  }

  pictureCards.forEach((card) => {
    card.addEventListener('click', () => {
      togglePictureCard(card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePictureCard(card);
      }
    });
  });

  // 5. Копирование ссылки на ВКонтакте
  if (copyVkBtn) {
    copyVkBtn.addEventListener('click', async () => {
      const link = copyVkBtn.getAttribute('data-copy') || 'https://vk.ru/temma9';
      try {
        await navigator.clipboard.writeText(link);
        showToast(`Ссылка скопирована: ${link}`);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Ссылка скопирована: ${link}`);
      }
    });
  }

  // 6. Загрузка своего фото на аватарку (по желанию)
  try {
    const savedAvatar = localStorage.getItem(AVATAR_KEY);
    if (savedAvatar && avatarImg) {
      avatarImg.src = savedAvatar;
    }
  } catch (err) {
    console.error(err);
  }

  if (avatarTrigger && avatarInput && avatarImg) {
    avatarTrigger.addEventListener('click', () => {
      avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        avatarImg.src = result;
        try {
          localStorage.setItem(AVATAR_KEY, result);
          showToast('📷 Ваше фото профиля сохранено!');
        } catch {
          showToast('📷 Фото профиля обновлено!');
        }
      };
      reader.readAsDataURL(file);
    });
  }
});
