import { afterNextRender, Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('home');
  protected readonly currentYear = new Date().getFullYear();

  constructor() {
    afterNextRender(() => {
      const sections = document.querySelectorAll<HTMLElement>('main section[id]');
      const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
      const sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.activeSection.set(visible.target.id);
      }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.6] });
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      sections.forEach((section) => sectionObserver.observe(section));
      revealItems.forEach((item) => revealObserver.observe(item));
    });
  }

  protected toggleMenu(): void { this.menuOpen.update((open) => !open); }
  protected closeMenu(): void { this.menuOpen.set(false); }
}
